import React, { useEffect, useState } from 'react';
import { Button, Col, Row, Typography } from 'antd';
import LoanStatementTable from '../../components/LoanStatementTable';
import DepositStatementTable from '../../components/DepositStatementTable';
import MemberSelectField from '../../components/MemberSelectField';
import { MemberListDto, MemberStatementData } from '../../types/Member/memberTypes';
import { exportMemberStatementByMemberId, fetchMemberStatementByMemberId } from '../../services/memberStatementService';
import { DownloadOutlined } from '@ant-design/icons';

const { Text } = Typography;

const MemberStatement: React.FC = () => {

    const [selectedMember, setSelectedMember] = useState<MemberListDto | null>(null);

    const handleMemberSelect = (member: MemberListDto) => {
        setSelectedMember(member);
    };
    const [memberStatementData, setMemberStatementData] = useState<MemberStatementData | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!selectedMember) return;

        const fetchData = async () => {
            setLoading(true);
            try {

                const data = await fetchMemberStatementByMemberId(selectedMember.memberId);
                setMemberStatementData(data);
                setError(null);
            } catch (err) {
                console.error('Failed to load member statement:', err);
                setError('Failed to load member data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [selectedMember]);

    const handleDownload = async () => {
        if (selectedMember) {
            await exportMemberStatementByMemberId(selectedMember.memberId);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <Text strong>Select a Member</Text>
            <MemberSelectField selectedMember={selectedMember} onMemberSelect={handleMemberSelect} />

            {selectedMember && (
                <div style={{ marginBottom: '20px' }}>
                    <Text>
                        Member Number: <Text strong>{selectedMember.memberNumber}</Text>
                    </Text>
                    <br />
                    <Text>
                        Name: <Text strong>{`${selectedMember.firstName} ${selectedMember.otherName || ''}`}</Text>
                    </Text>
                </div>
            )}

            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>{error}</p>
            ) : (
                <>
                    {memberStatementData && (
                        <>
                            <Row justify="space-between" align="middle" style={{ marginBottom: '20px' }}>
                                <Col>
                                    <Button
                                        icon={<DownloadOutlined />}
                                        onClick={handleDownload}
                                    >
                                        Download Statement
                                    </Button>
                                </Col>
                            </Row>


                            <Text strong>Loan Statements</Text>
                            <LoanStatementTable loans={memberStatementData.loanStatements} />

                            <Text strong style={{ marginTop: '20px' }}>Monthly Deposits</Text>
                            <DepositStatementTable deposits={memberStatementData.monthlyDeposits} />
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default MemberStatement;
