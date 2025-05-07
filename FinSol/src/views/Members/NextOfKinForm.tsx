import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Row, Col, Card, Typography, Spin, message, Switch, Table, Space, Popconfirm } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { createNextOfKin, deleteNextOfKin, fetchNextOfKinById, fetchNextOfKinByMemberId, updateNextOfKin } from '../../services/memberService';
import { CreateMemberNextOfKinDto, MemberListDto, MemberNextOfKinDto, UpdateMemberNextOfKinDto } from '../../types/Member/memberTypes';
import MemberSelectField from '../../components/MemberSelectField';

const { Title } = Typography;

interface NextOfKinFormProps {
    kinId?: string;
    onSuccess?: () => void;
}
const NextOfKinForm: React.FC<NextOfKinFormProps> = ({ kinId, onSuccess }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedMember, setSelectedMember] = useState<MemberListDto | null>(null);
    const [nextOfKins, setNextOfKins] = useState<MemberNextOfKinDto[]>([]); // New state for next-of-kin list
    const [editingKinId, setEditingKinId] = useState<string | null>(null); // Track editing next-of-kin
    const navigate = useNavigate();
    const isUpdate = !!editingKinId || !!kinId; // Update mode if editing or kinId provided

    // Fetch next-of-kin data when kinId is provided (initial load for editing)
    useEffect(() => {
        if (kinId && !editingKinId) {
            const fetchKin = async () => {
                setLoading(true);
                try {
                    const kin = await fetchNextOfKinById(kinId);
                    form.setFieldsValue({
                        memberId: kin.memberId,
                        firstName: kin.firstName,
                        otherName: kin.otherName,
                        email: kin.email,
                        contact: kin.contact,
                        isActive: kin.isActive,
                    });
                } catch (error) {
                    message.error('Failed to load next-of-kin data');
                } finally {
                    setLoading(false);
                }
            };
            fetchKin();
        }
    }, [kinId, form]);

    // Fetch next-of-kin records when selectedMember changes
    useEffect(() => {
        if (selectedMember?.memberId) {
            const fetchNextOfKins = async () => {
                setLoading(true);
                try {
                    const kins = await fetchNextOfKinByMemberId(selectedMember.memberId);
                    setNextOfKins(kins);
                } catch (error) {
                    message.error('Failed to load next-of-kin records');
                } finally {
                    setLoading(false);
                }
            };
            fetchNextOfKins();
        } else {
            setNextOfKins([]); // Clear list if no member is selected
        }
    }, [selectedMember]);

    // Handle member selection
    const handleMemberSelect = async (member: MemberListDto) => {
        if (member) {
            setSelectedMember(member);
            form.setFieldsValue({ memberId: member.memberId });
        }
        setIsModalVisible(false);
    };

    // Handle edit button click
    const handleEdit = (kin: MemberNextOfKinDto) => {
        setEditingKinId(kin.kinId); // Set editing mode
        form.setFieldsValue({
            memberId: kin.memberId,
            firstName: kin.firstName,
            otherName: kin.otherName,
            email: kin.email,
            contact: kin.contact,
            isActive: kin.isActive,
        });
    };

    // Handle delete button click
    const handleDelete = async (kinId: string) => {
        setLoading(true);
        try {
            await deleteNextOfKin(kinId);
            // Refresh next-of-kin list
            if (selectedMember?.memberId) {
                const kins = await fetchNextOfKinByMemberId(selectedMember.memberId);
                setNextOfKins(kins);
            }
            if (editingKinId === kinId) {
                setEditingKinId(null); // Clear editing mode if deleted
                form.resetFields();
            }
        } catch (error) {
            message.error('Failed to delete next-of-kin');
        } finally {
            setLoading(false);
        }
    };

    // Handle form submission
    const handleFinish = async (values: CreateMemberNextOfKinDto & UpdateMemberNextOfKinDto) => {
        setLoading(true);
        try {
            if (isUpdate && (editingKinId || kinId)) {
                const updateDto: UpdateMemberNextOfKinDto = {
                    firstName: values.firstName,
                    otherName: values.otherName,
                    email: values.email,
                    contact: values.contact,
                    isActive: values.isActive,
                    memberId: values.memberId,
                };
                await updateNextOfKin(editingKinId || kinId!, updateDto);
            } else {
                const createDto: CreateMemberNextOfKinDto = {
                    memberId: values.memberId,
                    firstName: values.firstName,
                    otherName: values.otherName,
                    email: values.email,
                    contact: values.contact,
                };
                await createNextOfKin(createDto);
            }
            form.resetFields();
            setEditingKinId(null); // Clear editing mode
            if (selectedMember?.memberId) {
                // Refresh next-of-kin list
                const kins = await fetchNextOfKinByMemberId(selectedMember.memberId);
                setNextOfKins(kins);
            }
            if (onSuccess) onSuccess();
            if (!isUpdate) navigate('/next-of-kin'); // Redirect only on create
        } catch (error) {
            message.error(isUpdate ? 'Failed to update next-of-kin' : 'Failed to create next-of-kin');
        } finally {
            setLoading(false);
        }
    };

    // Handle form cancel
    const handleCancel = () => {
        form.resetFields();
        setEditingKinId(null); // Clear editing mode
        setSelectedMember(null); // Optional: Clear selected member
        navigate('/next-of-kin');
    };

    // Table columns for next-of-kin list
    const columns = [
        {
            title: 'First Name',
            dataIndex: 'firstName',
            key: 'firstName',
        },
        {
            title: 'Other Name',
            dataIndex: 'otherName',
            key: 'otherName',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Contact',
            dataIndex: 'contact',
            key: 'contact',
        },
        {
            title: 'Active',
            dataIndex: 'isActive',
            key: 'isActive',
            render: (isActive: boolean) => (isActive ? 'Yes' : 'No'),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: MemberNextOfKinDto) => (
                <Space>
                    <Button icon={<EditOutlined />} onClick={() => handleEdit(record)}>
                        Edit
                    </Button>
                    <Popconfirm
                        title="Are you sure you want to delete this next-of-kin?"
                        onConfirm={() => handleDelete(record.kinId)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button icon={<DeleteOutlined />} danger>
                            Delete
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <Card bordered={false} style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)', marginBottom: '24px' }}>
            <Title level={3}>{isUpdate ? 'Update Next-of-Kin' : 'Add Next-of-Kin'}</Title>
            <Spin spinning={loading}>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleFinish}
                    initialValues={{ isActive: true }}
                    scrollToFirstError
                >
                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={12}>
                            <MemberSelectField selectedMember={selectedMember} onMemberSelect={handleMemberSelect} />
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="firstName"
                                label="First Name"
                                rules={[{ required: true, message: 'Please enter the first name' }]}
                            >
                                <Input prefix={<UserOutlined />} placeholder="Enter first name" size="large" allowClear autoFocus />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="otherName"
                                label="Other Name"
                                rules={[{ required: true, message: 'Please enter the other name' }]}
                            >
                                <Input prefix={<UserOutlined />} placeholder="Enter other name" size="large" allowClear />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="email"
                                label="Email"
                                rules={[{ type: 'email', message: 'Please enter a valid email' }]}
                            >
                                <Input prefix={<MailOutlined />} placeholder="Enter email" size="large" allowClear />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="contact"
                                label="Contact Number"
                                rules={[
                                    {
                                        pattern: /^\+?[1-9]\d{1,14}$/,
                                        message: 'Please enter a valid phone number',
                                    },
                                ]}
                            >
                                <Input prefix={<PhoneOutlined />} placeholder="Enter contact number" size="large" allowClear />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item name="isActive" label="Active Status" valuePropName="checked">
                                <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="memberId"
                                label="Member ID"
                                rules={[{ required: true, message: 'Please select a member' }]}
                                hidden // Hidden input to store memberId
                            >
                                <Input type="hidden" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row justify="end" style={{ marginTop: '24px' }}>
                        <Col>
                            <Button style={{ marginRight: '8px' }} onClick={handleCancel}>
                                Cancel
                            </Button>
                            <Button type="primary" htmlType="submit" loading={loading} disabled={loading}>
                                {isUpdate ? 'Update' : 'Add'} Next-of-Kin
                            </Button>
                        </Col>
                    </Row>
                </Form>

                {/* Next-of-Kin List */}
                {nextOfKins.length > 0 && (
                    <div style={{ marginTop: '24px' }}>
                        <Title level={4}>Existing Next-of-Kin</Title>
                        <Table
                            columns={columns}
                            dataSource={nextOfKins}
                            rowKey="kinId"
                            pagination={false}
                            bordered
                        />
                    </div>
                )}
            </Spin>
        </Card>
    );
};

export default NextOfKinForm;