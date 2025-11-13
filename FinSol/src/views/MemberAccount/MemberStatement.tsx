import React, { useEffect, useState } from 'react';
import { Button, Col, Row, Typography, Card, Spin, Alert, Empty, Space, Statistic, Divider, Badge } from 'antd';
import LoanStatementTable from '../../components/LoanStatementTable';
import DepositStatementTable from '../../components/DepositStatementTable';
import MemberSelectField from '../../components/MemberSelectField';
import { MemberListDto, MemberStatementData } from '../../types/Member/memberTypes';
import { exportMemberStatementByMemberId, fetchMemberStatementByMemberId } from '../../services/memberStatementService';
import { 
    DownloadOutlined, 
    UserOutlined, 
    IdcardOutlined, 
    BankOutlined, 
    WalletOutlined,
    FilePdfOutlined 
} from '@ant-design/icons';

const { Text, Title } = Typography;

const MemberStatement: React.FC = () => {
    const [selectedMember, setSelectedMember] = useState<MemberListDto | null>(null);
    const [memberStatementData, setMemberStatementData] = useState<MemberStatementData | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [downloading, setDownloading] = useState<boolean>(false);

    const handleMemberSelect = (member: MemberListDto) => {
        setSelectedMember(member);
    };

    useEffect(() => {
        if (!selectedMember) return;

        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await fetchMemberStatementByMemberId(selectedMember.memberId);
                setMemberStatementData(data);
            } catch (err) {
                setError('Failed to load member statement. Please try again.');
                setMemberStatementData(null);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [selectedMember]);

    const handleDownload = async () => {
        if (selectedMember) {
            setDownloading(true);
            try {
                await exportMemberStatementByMemberId(selectedMember.memberId);
            } finally {
                setDownloading(false);
            }
        }
    };

    const getTotalLoanBalance = () => {
        if (!memberStatementData?.loanStatements) return 0;
        return memberStatementData.loanStatements.reduce((sum, loan) => sum + (loan.outstandingBalance || 0), 0);
    };

    const getTotalDeposits = () => {
        if (!memberStatementData?.monthlyDeposits) return 0;
        return memberStatementData.monthlyDeposits.reduce((sum, deposit) => sum + (deposit.totalMonthlyDeposit || 0), 0);
    };

    return (
        <div style={{ padding: 24, maxWidth: 1400, margin: '0 auto' }}>
            {/* Header Section */}
            <Card 
                bordered={false}
                style={{ 
                    marginBottom: 24,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: '#fff'
                }}
            >
                <Row justify="space-between" align="middle">
                    <Col>
                        <Space direction="vertical" size={0}>
                            <Title level={2} style={{ color: '#fff', margin: 0 }}>
                                Member Statement
                            </Title>
                            <Text style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: 14 }}>
                                View comprehensive loan and deposit statements
                            </Text>
                        </Space>
                    </Col>
                    <Col>
                        <FilePdfOutlined style={{ fontSize: 48, opacity: 0.3 }} />
                    </Col>
                </Row>
            </Card>

            {/* Member Selection Card */}
            <Card 
                title={
                    <Space>
                        <UserOutlined />
                        <span>Select Member</span>
                    </Space>
                }
                bordered={false}
                style={{ marginBottom: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
            >
                <MemberSelectField 
                    selectedMember={selectedMember} 
                    onMemberSelect={handleMemberSelect} 
                />
            </Card>

            {/* Member Info Card */}
            {selectedMember && (
                <Card 
                    bordered={false}
                    style={{ marginBottom: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                >
                    <Row gutter={[24, 16]}>
                        <Col xs={24} sm={12} md={6}>
                            <Statistic
                                title={
                                    <Space>
                                        <IdcardOutlined />
                                        <span>Member Number</span>
                                    </Space>
                                }
                                value={selectedMember.memberNumber}
                                valueStyle={{ color: '#1890ff', fontSize: 20 }}
                            />
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <Statistic
                                title={
                                    <Space>
                                        <UserOutlined />
                                        <span>Member Name</span>
                                    </Space>
                                }
                                value={`${selectedMember.firstName} ${selectedMember.otherName || ''}`}
                                valueStyle={{ fontSize: 18 }}
                            />
                        </Col>
                        {memberStatementData && (
                            <>
                                <Col xs={24} sm={12} md={6}>
                                    <Statistic
                                        title={
                                            <Space>
                                                <BankOutlined />
                                                <span>Total Loan Balance</span>
                                            </Space>
                                        }
                                        value={getTotalLoanBalance()}
                                        precision={2}
                                        valueStyle={{ color: '#cf1322', fontSize: 20 }}
                                        prefix="KES"
                                    />
                                </Col>
                                <Col xs={24} sm={12} md={6}>
                                    <Statistic
                                        title={
                                            <Space>
                                                <WalletOutlined />
                                                <span>Total Deposits</span>
                                            </Space>
                                        }
                                        value={getTotalDeposits()}
                                        precision={2}
                                        valueStyle={{ color: '#3f8600', fontSize: 20 }}
                                        prefix="KES"
                                    />
                                </Col>
                            </>
                        )}
                    </Row>
                    
                    {memberStatementData && (
                        <>
                            <Divider />
                            <Row justify="end">
                                <Button
                                    type="primary"
                                    size="large"
                                    icon={<DownloadOutlined />}
                                    onClick={handleDownload}
                                    loading={downloading}
                                >
                                    Download PDF Statement
                                </Button>
                            </Row>
                        </>
                    )}
                </Card>
            )}

            {/* Loading State */}
            {loading && (
                <Card style={{ textAlign: 'center', padding: 60 }}>
                    <Spin size="large" />
                    <div style={{ marginTop: 16 }}>
                        <Text type="secondary">Loading member statement...</Text>
                    </div>
                </Card>
            )}

            {/* Error State */}
            {error && !loading && (
                <Alert
                    message="Error Loading Statement"
                    description={error}
                    type="error"
                    showIcon
                    style={{ marginBottom: 24 }}
                />
            )}

            {/* Empty State - No Member Selected */}
            {!selectedMember && !loading && (
                <Card style={{ textAlign: 'center', padding: 60 }}>
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description={
                            <Space direction="vertical">
                                <Text type="secondary" style={{ fontSize: 16 }}>
                                    No member selected
                                </Text>
                                <Text type="secondary">
                                    Please select a member to view their statement
                                </Text>
                            </Space>
                        }
                    />
                </Card>
            )}

            {/* Statement Data */}
            {selectedMember && memberStatementData && !loading && (
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    {/* Loan Statements Section */}
                    <Card
                        title={
                            <Space>
                                <BankOutlined />
                                <span>Loan Statements</span>
                                <Badge 
                                    count={memberStatementData.loanStatements?.length || 0} 
                                    style={{ backgroundColor: '#52c41a' }}
                                />
                            </Space>
                        }
                        bordered={false}
                        style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                    >
                        {memberStatementData.loanStatements && memberStatementData.loanStatements.length > 0 ? (
                            <LoanStatementTable loans={memberStatementData.loanStatements} />
                        ) : (
                            <Empty 
                                description="No loan statements available"
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                            />
                        )}
                    </Card>

                    {/* Deposit Statements Section */}
                    <Card
                        title={
                            <Space>
                                <WalletOutlined />
                                <span>Monthly Deposits</span>
                                <Badge 
                                    count={memberStatementData.monthlyDeposits?.length || 0} 
                                    style={{ backgroundColor: '#1890ff' }}
                                />
                            </Space>
                        }
                        bordered={false}
                        style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                    >
                        {memberStatementData.monthlyDeposits && memberStatementData.monthlyDeposits.length > 0 ? (
                            <DepositStatementTable deposits={memberStatementData.monthlyDeposits} />
                        ) : (
                            <Empty 
                                description="No deposit statements available"
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                            />
                        )}
                    </Card>
                </Space>
            )}
        </div>
    );
};

export default MemberStatement;
