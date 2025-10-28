import { useState, useEffect } from 'react';
import { Form, Input, Button, DatePicker, Select, InputNumber, Table, Modal, Alert, Switch, Space, Typography, Statistic } from 'antd';
import { CreateMemberReceiptRequestDTO, ReceiptItemDTO } from '../../types/MemberAccount/memberAccountTypes';
import { alertService } from '../../services/alertService';
import { useNavigate } from 'react-router-dom';
import { MemberListDto } from '../../types/Member/memberTypes';
import { getReceiptableChartOfAccounts } from '../../services/chartOfAccountsService';
import { ChartOfAccount } from '../../types/Accounting/accountingTypes';
import moment from 'moment';
import { createMemberReceipt, fetchMembersItemToReceipt } from '../../services/memberReceiptService';
import MemberSearch from '../../components/MemberSearch';

const { Option } = Select;
const { Text } = Typography;

export default function CreateReceiptForm() {
    const [form] = Form.useForm();
    const [receiptItems, setReceiptItems] = useState<ReceiptItemDTO[]>([]);
    const [totalAmountDue, setTotalAmountDue] = useState<number>(0);
    const [totalAmountReceipted, setTotalAmountReceipted] = useState<number>(0);
    const [totalAmount, setTotalAmount] = useState<number>(0);
    const [autoDistribute, setAutoDistribute] = useState(false);
    const [selectedMember, setSelectedMember] = useState<MemberListDto | null>(null);
    const [chartsOfAccount, setChartsOfAccount] = useState<ChartOfAccount[]>([]);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

    const navigate = useNavigate();
    const { showAlert } = alertService();

    useEffect(() => {
        const fetchChartsOfAccounts = async () => {
            const results = await getReceiptableChartOfAccounts();
            if (results.success) {
                setChartsOfAccount(results.data);
            }
        };
        fetchChartsOfAccounts();
    }, []);

    useEffect(() => {
        if (!autoDistribute || receiptItems.length === 0 || totalAmount <= 0) {
            const updatedItems = receiptItems.map(item => ({
                ...item,
                amountReceipted: 0,
            }));
            setReceiptItems(updatedItems);
            calculateTotalReceipted(updatedItems);
            return;
        }

        let remainingAmount = totalAmount;
        const updatedItems = receiptItems.map(item => {
            const amountToReceipt = Math.min(item.amountDue, remainingAmount);
            remainingAmount -= amountToReceipt;
            return {
                ...item,
                amountReceipted: amountToReceipt,
            };
        });

        setReceiptItems(updatedItems);
        calculateTotalReceipted(updatedItems);
    }, [autoDistribute, totalAmount]);

    const fetchMemberItems = async (memberId: string) => {
        const response = await fetchMembersItemToReceipt(memberId);
        if (response.success) {
            const apiItems = response.data;
            const fetchedItems: ReceiptItemDTO[] = apiItems.map((item: any, index: number) => ({
                key: (index + 1).toString(),
                description: item.description,
                loanNo: item.loanNo,
                loanAppId: item?.loanAppId,
                amountDue: item.amountDue,
                amountReceipted: 0,
                accountType: item.accountType,
            }));
            setReceiptItems(fetchedItems);
            calculateTotalDue(fetchedItems);
            calculateTotalReceipted(fetchedItems);
        }
    };

    const handleMemberSelect = (member: MemberListDto) => {
        if (!member || member.memberId === selectedMember?.memberId) return;
        setSelectedMember(member);
        form.setFieldsValue({ memberId: member.memberId });
        fetchMemberItems(member.memberId);
        setIsModalVisible(false);
    };

    const calculateTotalDue = (items: ReceiptItemDTO[]) => {
        const totalDue = items.reduce((sum, item) => sum + item.amountDue, 0);
        setTotalAmountDue(totalDue);
    };

    const calculateTotalReceipted = (items: ReceiptItemDTO[]) => {
        const totalReceipted = items.reduce((sum, item) => sum + item.amountReceipted, 0);
        setTotalAmountReceipted(totalReceipted);
    };

    const handleAmountReceiptedChange = (key: string, value: number) => {
        if (autoDistribute) return;
        const updatedItems = receiptItems.map(item =>
            item.key === key ? { ...item, amountReceipted: value } : item
        );
        setReceiptItems(updatedItems);
        calculateTotalReceipted(updatedItems);
    };

    const confirmLargerAmountDistribution = (amount: number, due: number, description: string) => {
        Modal.confirm({
            title: 'Confirm Distribution',
            content: `You are distributing ${amount} for ${description}, exceeding the due amount of ${due}. Proceed?`,
            okText: 'Yes',
            cancelText: 'No',
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
        if (totalAmountReceipted !== totalAmount) {
            showAlert('Error', 'Total receipted amount must match the total amount.', 'error');
            return;
        }

        const receiptData: CreateMemberReceiptRequestDTO = {
            memberId: values.memberId,
            amount: totalAmount,
            receiptDate: moment(values.receiptDate).format('YYYY-MM-DDTHH:mm:ss'),
            receiptMethod: values.receiptMethod,
            debitAccountId: values.debitAccountId,
            transactionReference: values.transactionReference,
            description: values.description,
            receiptItems: receiptItems.map(item => ({
                key: item.key,
                description: item.description,
                loanNo: item?.loanNo,
                loanAppId: item?.loanAppId,
                amountDue: item.amountDue,
                amountReceipted: item.amountReceipted,
                accountType: item.accountType,
            })),
        };

        await createMemberReceipt(receiptData);
    };

    const handleBack = () => {
        navigate('/receipt-list');
    };

    const removeReceiptItem = (key: string) => {
        const updatedItems = receiptItems.filter(item => item.key !== key);
        setReceiptItems(updatedItems);
        calculateTotalDue(updatedItems);
        calculateTotalReceipted(updatedItems);
    };

    const columns = [
        {
            title: 'Item to be Receipted',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Amount Due',
            dataIndex: 'amountDue',
            key: 'amountDue',
            render: (value: number) => (
                <Text>{value.toLocaleString()}</Text>
            ),
        },
        {
            title: 'Amount Receipted',
            dataIndex: 'amountReceipted',
            key: 'amountReceipted',
            render: (_text: number, record: ReceiptItemDTO) => (
                <InputNumber
                    min={0}
                    value={record.amountReceipted}
                    onChange={value => handleAmountReceiptedChange(record.key, value || 0)}
                    disabled={autoDistribute}
                    style={{ width: '100%' }}
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value?.replace(/\$\s?|(,*)/g, '') as any}
                    onBlur={() => {
                        if (!autoDistribute && record.amountReceipted > record.amountDue) {
                            confirmLargerAmountDistribution(record.amountReceipted, record.amountDue, record.description);
                        }
                    }}
                />
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_: any, record: ReceiptItemDTO) => (
                <Button type="link" danger onClick={() => removeReceiptItem(record.key)}>
                    Remove
                </Button>
            ),
        },
    ];

    const balanceRemaining = totalAmount - totalAmountReceipted;

    return (
        <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
            <Typography.Title level={2} style={{ marginBottom: 24 }}>
                Create Receipt
            </Typography.Title>

            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                style={{ background: '#fff', padding: 24, borderRadius: 8, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}
            >
                <Space direction="horizontal" size="large" style={{ width: '100%', marginBottom: 24 }}>
                    <Form.Item
                        label="Member ID"
                        name="memberId"
                        rules={[{ required: true, message: 'Please select a member' }]}
                        style={{ flex: 1 }}
                    >
                        <Select
                            placeholder="Select a member"
                            value={selectedMember?.memberId}
                            onClick={() => setIsModalVisible(true)}
                            allowClear
                            dropdownRender={() => <></>}
                            style={{ width: '100%' }}
                        >
                            {selectedMember && (
                                <Option key={selectedMember.memberId} value={selectedMember.memberId}>
                                    {`${selectedMember.firstName} ${selectedMember.otherName}`}
                                </Option>
                            )}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Total Amount"
                        name="totalAmount"
                        rules={[{ required: true, message: 'Please input the total amount' }]}
                        style={{ flex: 1 }}
                    >
                        <InputNumber
                            min={0}
                            value={totalAmount}
                            onChange={handleTotalAmountChange}
                            style={{ width: '100%' }}
                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value?.replace(/\$\s?|(,*)/g, '') as any}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Receipt Date"
                        name="receiptDate"
                        rules={[{ required: true, message: 'Please select a receipt date' }]}
                        style={{ flex: 1 }}
                    >
                        <DatePicker
                            format="YYYY-MM-DD"
                            style={{ width: '100%' }}
                            disabledDate={current => current && current > moment().endOf('day')} // Disable dates after today
                        />
                    </Form.Item>
                </Space>

                <Form.Item
                    label="Receipt Method"
                    name="receiptMethod"
                    rules={[{ required: true, message: 'Please select a receipt method' }]}
                >
                    <Select placeholder="Select a receipt method" style={{ width: '100%' }}>
                        <Option value="cash">Cash</Option>
                        <Option value="bank_transfer">Bank Transfer</Option>
                        <Option value="cheque">Cheque</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Debit Account"
                    name="debitAccountId"
                    rules={[{ required: true, message: 'Please select a debit account' }]}
                >
                    <Select placeholder="Select a debit account" style={{ width: '100%' }} loading={!chartsOfAccount.length}>
                        {chartsOfAccount.map(account => (
                            <Option key={account.id} value={account.id}>{account.accountName}</Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item label="Transaction Reference" name="transactionReference"
                    rules={[{ required: true, message: 'Please enter a transaction reference' }]}>
                    <Input placeholder="Enter transaction reference" />
                </Form.Item>

                <Form.Item label="Description" name="description" rules={[{ required: true, message: 'Please enter description' }]}>
                    <Input.TextArea rows={4} placeholder="Enter description" />
                </Form.Item>

                <Form.Item>
                    <Space>
                        <Switch
                            checked={autoDistribute}
                            onChange={setAutoDistribute}
                            checkedChildren="Auto Distribute"
                            unCheckedChildren="Manual"
                        />
                        <Text type="secondary">
                            {autoDistribute
                                ? 'Distributes total amount across items up to due amounts.'
                                : 'Manually input receipted amounts.'}
                        </Text>
                    </Space>
                </Form.Item>

                <Space size="middle" style={{ width: '100%', marginBottom: 24 }}>
                    <Statistic title="Total Amount Due" value={totalAmountDue} precision={2} />
                    <Statistic title="Total Amount Receipted" value={totalAmountReceipted} precision={2} />
                    <Statistic
                        title="Balance Remaining"
                        value={balanceRemaining}
                        precision={2}
                        valueStyle={{ color: balanceRemaining < 0 ? '#cf1322' : balanceRemaining > 0 ? '#faad14' : '#3f8600' }}
                    />
                </Space>

                {balanceRemaining !== 0 && totalAmount > 0 && (
                    <Alert
                        message={balanceRemaining > 0 ? 'Warning' : 'Error'}
                        description={
                            balanceRemaining > 0
                                ? 'Not all of the total amount has been distributed.'
                                : 'The total amount receipted exceeds the total amount entered.'
                        }
                        type={balanceRemaining > 0 ? 'warning' : 'error'}
                        showIcon
                        style={{ marginBottom: 24 }}
                    />
                )}

                <Table
                    columns={columns}
                    dataSource={receiptItems}
                    pagination={false}
                    rowKey="key"
                    bordered
                    style={{ marginBottom: 24 }}
                    scroll={{ x: true }}
                />

                <Form.Item style={{ textAlign: 'right' }}>
                    <Space>
                        <Button type="default" onClick={handleBack}>
                            Back
                        </Button>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Space>
                </Form.Item>
            </Form>

            <Modal
                title="Search Member"
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                width="80%"
                bodyStyle={{ padding: 0 }}
            >
                <MemberSearch onMemberSelect={handleMemberSelect} />
            </Modal>
        </div>
    );
}
