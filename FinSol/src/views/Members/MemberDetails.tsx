import React, { useEffect, useState } from 'react';
import { Descriptions, Card, Button, Spin, Typography, message } from 'antd';
import { MemberListDto } from '../../types/Member/memberTypes';
import { useNavigate, useParams } from 'react-router-dom';
import { Gender } from '../../enums/enums';
import { fetchMemberById } from '../../services/memberService';
import { formatDate } from '../../helpers/dateFormater';

const { Title } = Typography;

const MemberDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = useState<boolean>(true);
    const [member, setMember] = useState<MemberListDto | null>(null);
    const navigate = useNavigate();
    const isValidUUID = (id: string | undefined): id is `${string}-${string}-${string}-${string}-${string}` => {
        return !!id && /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(id);
    };
    useEffect(() => {

        const fetchMemberDetails = async () => {
            try {
                setLoading(true);
                if (!isValidUUID(id)) {
                    message.error("Invalid or missing ID");
                    return;
                }
                const response = await fetchMemberById(id);
                if (response.success) {
                    setMember(response.data);

                }
            } catch (error) {
                setLoading(false);

            } finally {
                setLoading(false);
            }
        };

        fetchMemberDetails();
    }, [id]);

    const handleBackClick = () => {
        navigate('/members-list');
    };

    if (loading) {
        return <Spin tip="Loading member details..." />;
    }

    if (!member) {
        return <p>Member not found</p>;
    }

    return (
        <Card>
            <Title level={3}>Member Details</Title>
            <Descriptions bordered layout="vertical">
                <Descriptions.Item label="Member Name">{member.firstName + ' ' + member.otherName}</Descriptions.Item>
                <Descriptions.Item label="Member Number">{member.memberNumber}</Descriptions.Item>
                <Descriptions.Item label="Email">{member.email}</Descriptions.Item>
                <Descriptions.Item label="Phone Number">{member.phoneNumber}</Descriptions.Item>
                <Descriptions.Item label="Bank Account">{member.bankAccount}</Descriptions.Item>
                <Descriptions.Item label="Bank Name">{member.bankName}</Descriptions.Item>
                <Descriptions.Item label="Work Place">{member.workPlace || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Work Type">{member.workType || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Date of Birth">{member.dateOfBirth ? formatDate(member.dateOfBirth.toString()) : 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="National ID">{member.nationalID || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Passport Number">{member.passportNumber || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Tax PIN">{member.taxPIN || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Date Joined">{member.dateJoined ? formatDate(member.dateJoined.toString()) : "N/A"}</Descriptions.Item>
                <Descriptions.Item label="Gender">{member.gender !== undefined ? Gender[member.gender] : "N/A"}</Descriptions.Item>
            </Descriptions>
            <Button type="primary" onClick={handleBackClick} style={{ marginTop: '20px' }}>
                Back to List
            </Button>
        </Card>
    );
};

export default MemberDetails;
