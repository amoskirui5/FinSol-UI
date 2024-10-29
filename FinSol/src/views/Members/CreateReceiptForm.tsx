import React, { useState, useEffect } from 'react';
import { Form, Input, Button, DatePicker, Select, InputNumber, Table, Modal, Alert, Switch, Space } from 'antd';
import { CreateMemberReceiptRequestDTO, ReceiptItemDTO } from '../../types/MemberAccount/memberAccountTypes';
import { alertService } from '../../services/alertService';
import { useNavigate } from 'react-router-dom';
import { MemberListDto } from '../../types/Member/memberTypes';
import { getChartOfAccounts } from '../../services/chartOfAccountsService';
import { ChartOfAccount } from '../../types/accountingTypes';
import moment from 'moment';
import { createMemberReceipt, fetchMembersItemToReceipt } from '../../services/memberReceiptService';
import MemberSearch from '../../components/MemberSearch';

const { Option } = Select;

const CreateReceiptForm: React.FC = () => {
    const [form] = Form.useForm();
    const [receiptItems, setReceiptItems] = useState<ReceiptItemDTO[]>([]);
    const [totalAmountDue, setTotalAmountDue] = useState<number>(0);
    const [totalAmountReceipted, setTotalAmountReceipted] = useState<number>(0);
    const [totalAmount, setTotalAmount] = useState<number>(0);
    const [warningVisible, setWarningVisible] = useState(false);
    const [autoDistribute, setAutoDistribute] = useState(false);
    const [selectedMember, setselectedMember] = useState<MemberListDto | null>(null);
    const [chartsOfAccount, setChartsOfAccount] = useState<ChartOfAccount[]>([]);
    const [isModalVisible, SetIsModalVisible] = useState<boolean>(false);

    const navigate = useNavigate();
    const { showAlert } = alertService();

    useEffect(() => {
        setWarningVisible(totalAmount !== totalAmountReceipted && totalAmount > 0);
    }, [totalAmount, totalAmountReceipted]);

    useEffect(() => {
        if (autoDistribute) {
            const updatedItems = receiptItems.map(item => ({
                ...item,
                amountReceipted: item.amountDue,
            }));
            setReceiptItems(updatedItems);
            calculateTotalReceipted(updatedItems);
        }
    }, [autoDistribute]);

    const handleMemberSelect = async (member: MemberListDto) => {
        if (member) {
            setselectedMember(member);
            form.setFieldsValue({ memberId: member.memberId });
        }
        SetIsModalVisible(false);
        const response = await fetchMembersItemToReceipt(`${member.memberId}`);
        const apiItems = response.data;

        const fetchedItems: ReceiptItemDTO[] = apiItems.map((item: any, index: number) => ({
            key: (index + 1).toString(),
            description: item.description,
            loanNo: item.loanNo,
            loanAppId :item?.loanAppId,
            amountDue: item.amountDue,
            amountReceipted: autoDistribute ? item.amount : 0,
            accountType: item.accountType,
        }));

        setReceiptItems(fetchedItems);
        calculateTotalDue(fetchedItems);
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
        const updatedItems = receiptItems.map(item =>
            item.key === key ? { ...item, amountReceipted: value } : item
        );
        setReceiptItems(updatedItems);
        calculateTotalReceipted(updatedItems);
    };

    const confirmLargerAmountDistribution = (amount: number, due: number, description: string) => {
        return Modal.confirm({
            title: 'Distribute Amount',
            content: `You are about to distribute ${amount} for ${description}, which exceeds the due amount of ${due}. Do you want to proceed?`,
            onOk: () => { },
        });
    };

    const handleTotalAmountChange = (value: number | null) => {
        setTotalAmount(value || 0);
    };

    const handleSubmit = async (values: any) => {
        if (totalAmountReceipted !== totalAmount) {
            showAlert('Error', 'The total receipted amount must match the distributed amount.', 'error');
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
                accountType: item.accountType
            })),
        };

        const response = await createMemberReceipt(receiptData);
        if (response.success) {
            navigate('/receipt-list');
        } else {
            showAlert('Error', response.message, 'error');
        }
    };

    const handleBack = () => {
        navigate('/receipt-list');
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
        },
        {
            title: 'Amount Receipted',
            dataIndex: 'amountReceipted',
            key: 'amountReceipted',
            render: (text: number, record: ReceiptItemDTO) => (
                <InputNumber
                    min={0}
                    value={record.amountReceipted}
                    onChange={value => handleAmountReceiptedChange(record.key, value || 0)}
                    style={{ width: '100%' }}
                    onBlur={() => {
                        if (record.amountReceipted > record.amountDue) {
                            confirmLargerAmountDistribution(record.amountReceipted, record.amountDue, record.description);
                        }
                    }}
                />
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (text: any, record: ReceiptItemDTO) => (
                <Button type="link" onClick={() => removeReceiptItem(record.key)}>Remove</Button>
            ),
        },
    ];

    const removeReceiptItem = (key: string) => {
        const updatedItems = receiptItems.filter(item => item.key !== key);
        setReceiptItems(updatedItems);
        calculateTotalReceipted(updatedItems);
    };

    useEffect(() => {
        const fetchChartsOfAccounts = async () => {
            const results = await getChartOfAccounts();
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
                <Form.Item
                    label="Member ID"
                    name="memberId"
                    rules={[{ required: true, message: 'Please select a member' }]}
                    style={{ flex: 1 }}
                >
                    <Select
                        placeholder="Select a member"
                        value={selectedMember ? selectedMember.memberId : undefined}
                        onClick={() => SetIsModalVisible(true)}
                        allowClear
                        dropdownRender={() => <></>}
                        popupMatchSelectWidth={false}
                        style={{ width: '100%' }}
                        loading={selectedMember?.memberId === null}
                    >
                        {selectedMember && (
                            <Select.Option key={selectedMember.memberId} value={selectedMember.memberId}>
                                {`${selectedMember.firstName} ${selectedMember.otherName}`}
                            </Select.Option>
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
                    />
                </Form.Item>
            </div>

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
                <Select placeholder="Select a debit account" style={{ width: '100%' }}>
                    {chartsOfAccount.map(account => (
                        <Option key={account.id} value={account.id}>
                            {account.accountName}
                        </Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item
                label="Transaction Reference"
                name="transactionReference"
            >
                <Input placeholder="Enter transaction reference" />
            </Form.Item>

            <Form.Item
                label="Description"
                name="description"
            >
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
                    <span>{autoDistribute ? "Auto distributing amounts to all items." : "Manual input of amounts."}</span>
                </Space>
            </Form.Item>

            {warningVisible && (
                <Alert
                    message="Warning"
                    description="The total amount receipted does not match the total amount due."
                    type="warning"
                    showIcon
                    style={{ marginBottom: 16 }}
                />
            )}

            <Table
                columns={columns}
                dataSource={receiptItems}
                pagination={false}
                rowKey="key"
                style={{ marginBottom: 16 }}
            />

            <div style={{ textAlign: 'right', marginTop: 16 }}>
                <Button type="default" onClick={handleBack} style={{ marginRight: 8 }}>
                    Back
                </Button>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </div>
            <Modal
                title="Search Member"
                open={isModalVisible}
                onCancel={() => SetIsModalVisible(false)}
                footer={null}
                width="80%"
                bodyStyle={{ padding: '0' }}
            >
                <MemberSearch onMemberSelect={handleMemberSelect} />
            </Modal>
        </Form>
    );
};

export default CreateReceiptForm;
