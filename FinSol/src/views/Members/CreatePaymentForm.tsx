import React, { useState, useEffect } from 'react';
import { Form, Button, DatePicker, InputNumber, Table, Modal, Alert, Switch, Space } from 'antd';
import { alertService } from '../../services/alertService';
import { useNavigate } from 'react-router-dom';
import { ChartOfAccount } from '../../types/accountingTypes';
import moment from 'moment';
import { MemberListDto } from '../../types/Member/memberTypes';
import { CreateMemberPaymentRequestDTO, PaymentItemDTO } from '../../types/MemberAccount/memberAccountTypes';
import { getPayeableChartOfAccounts } from '../../services/chartOfAccountsService';
import { createMemberPayment, fetchMembersItemToPay } from '../../services/memberPaymentService';
import MemberSelectField from '../../components/MemberSelectField';

const CreatePaymentForm: React.FC = () => {
    const [form] = Form.useForm();
    const [paymentItems, setPaymentItems] = useState<PaymentItemDTO[]>([]);
    const [, setTotalAmountDue] = useState<number>(0);
    const [totalAmountPaid, setTotalAmountPaid] = useState<number>(0);
    const [totalAmount, setTotalAmount] = useState<number>(0);
    const [warningVisible, setWarningVisible] = useState(false);
    const [autoDistribute, setAutoDistribute] = useState(false);
    const [selectedMember, setSelectedMember] = useState<MemberListDto | null>(null);
    const [, setChartsOfAccount] = useState<ChartOfAccount[]>([]);
    const [, setIsModalVisible] = useState<boolean>(false);

    const navigate = useNavigate();
    const { showAlert } = alertService();

    useEffect(() => {
        setWarningVisible(totalAmount !== totalAmountPaid && totalAmount > 0);
    }, [totalAmount, totalAmountPaid]);

    useEffect(() => {
        if (autoDistribute) {
            const updatedItems = paymentItems.map(item => ({
                ...item,
                amountPaid: item.amountPaid,
            }));
            setPaymentItems(updatedItems);
            calculateTotalPaid(updatedItems);
        }
    }, [autoDistribute]);

    const handleMemberSelect = async (member: MemberListDto) => {
        if (member) {
            setSelectedMember(member);
            form.setFieldsValue({ memberId: member.memberId });
        }
        setIsModalVisible(false);
        const response = await fetchMembersItemToPay(`${member.memberId}`);
        const apiItems = response.data;

        const fetchedItems: PaymentItemDTO[] = apiItems.map((item: any, index: number) => ({
            key: (index + 1).toString(),
            description: item.description,
            loanNo: item.loanNo,
            loanAppId: item?.loanAppId,
            amountDue: item.amountDue,
            amountPaid: autoDistribute ? item.amount : 0,
            memberAccountType: item.accountType,
        }));

        setPaymentItems(fetchedItems);
        calculateTotalDue(fetchedItems);
    };

    const calculateTotalDue = (items: PaymentItemDTO[]) => {
        const totalDue = items.reduce((sum, item) => sum + item.amountPaid, 0);
        setTotalAmountDue(totalDue);
    };

    const calculateTotalPaid = (items: PaymentItemDTO[]) => {
        const totalPaid = items.reduce((sum, item) => sum + item.amountPaid, 0);
        setTotalAmountPaid(totalPaid);
    };

    const handleAmountPaidChange = (key: string, value: number) => {
        const updatedItems = paymentItems.map(item =>
            item.key === key ? { ...item, amountPaid: value } : item
        );
        setPaymentItems(updatedItems);
        calculateTotalPaid(updatedItems);
    };

    const confirmLargerAmountDistribution = (amount: number, due: number, description?: string) => {
        return Modal.confirm({
            title: 'Distribute Amount',
            content: `You are about to pay ${amount} for ${description}, which exceeds the due amount of ${due}. Do you want to proceed?`,
            onOk: async () => {
                const values = await form.validateFields();
                await handleSubmit(values);
            },
        });
    };

    const handleTotalAmountChange = (value: number | null) => {
        setTotalAmount(value || 0);
    };

    const handleSubmit = async (values: any) => {
        console.log('Processing payment...');

        if (totalAmountPaid !== totalAmount) {
            showAlert('Error', 'The total paid amount must match the distributed amount.', 'error');
            return;
        }

        const paymentData: CreateMemberPaymentRequestDTO = {
            memberId: values.memberId,
            amount: totalAmount,
            paymentDate: moment(values.paymentDate).format('YYYY-MM-DDTHH:mm:ss'),
            paymentMethod: values.paymentMethod,
            creditAccount: values.creditAccountId,
            transactionReference: values.transactionReference,
            description: values.description,
            paymentItems: paymentItems.map(item => ({
                key: item.key,
                description: item.description,
                loanNo: item?.loanNo,
                loanAppId: item?.loanAppId,
                amountDue: item.amountPaid,
                amountPaid: item.amountPaid,
                memberAccountType: item.memberAccountType,
                isPartiallyDisbursed: item.isPartiallyDisbursed,

            })),
        };

        const response = await createMemberPayment(paymentData);
        if (response.success) {
            navigate('/payment-list');
        } else {
            showAlert('Error', response.message, 'error');
        }
    };

    const handleBack = () => {
        navigate('/payment-list');
    };

    const columns = [
        {
            title: 'Item to be Paid',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Amount Due',
            dataIndex: 'amountDue',
            key: 'amountDue',
        },
        {
            title: 'Amount Paid',
            dataIndex: 'amountPaid',
            key: 'amountPaid',
            render: (record: PaymentItemDTO) => (
                <InputNumber
                    min={0}
                    value={record.amountPaid}
                    onChange={value => handleAmountPaidChange(record.key, value || 0)}
                    style={{ width: '100%' }}
                    onBlur={() => {
                        if (record.amountPaid > record.amountPaid) {
                            confirmLargerAmountDistribution(record.amountPaid, record.amountPaid, record?.description);
                        }
                    }}
                />
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (record: PaymentItemDTO) => (
                <Button type="link" onClick={() => removePaymentItem(record.key)}>Remove</Button>
            ),
        },
    ];

    const removePaymentItem = (key: string) => {
        const updatedItems = paymentItems.filter(item => item.key !== key);
        setPaymentItems(updatedItems);
        calculateTotalPaid(updatedItems);
    };

    useEffect(() => {
        const fetchChartsOfAccounts = async () => {
            const results = await getPayeableChartOfAccounts();
            if (results.success) {
                setChartsOfAccount(results.data);
            }
        };
        fetchChartsOfAccounts();
    }, []);

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
        >
            <div style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
                <MemberSelectField selectedMember={selectedMember} onMemberSelect={handleMemberSelect} />
                <Form.Item
                    label="Total Amount"
                    name="totalAmount"
                    rules={[{ required: true, message: 'Please input the total amount' }]}>
                    <InputNumber
                        min={0}
                        value={totalAmount}
                        onChange={handleTotalAmountChange}
                        style={{ width: '100%' }}
                    />
                </Form.Item>

                <Form.Item
                    label="Payment Date"
                    name="paymentDate"
                    rules={[{ required: true, message: 'Please select a payment date' }]}>
                    <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
                </Form.Item>
            </div>

            <div style={{ marginBottom: '24px' }}>
                <Switch checked={autoDistribute} onChange={setAutoDistribute} /> Auto Distribute Amount
            </div>

            <Table
                columns={columns}
                dataSource={paymentItems}
                pagination={false}
                rowKey="key"
                bordered
                style={{ marginBottom: '24px' }}
            />

            {warningVisible && (
                <Alert message="Total Paid Amount does not match Total Amount. Please verify." type="warning" showIcon />
            )}

            <Form.Item>
                <Space>
                    <Button onClick={handleBack}>Back</Button>
                    <Button type="primary" htmlType="submit">Submit</Button>
                </Space>
            </Form.Item>

        </Form>
    );
};

export default CreatePaymentForm;
