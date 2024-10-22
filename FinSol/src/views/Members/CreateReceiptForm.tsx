import React, { useState, useEffect } from 'react';
import { Form, Input, Button, DatePicker, Select, InputNumber, Table, Modal, Alert } from 'antd';
import { CreateMemberReceiptRequestDTO } from '../../types/MemberAccount/memberAccountTypes';
import { alertService } from '../../services/alertService';
import { ChartOfAccount } from '../../types/accountingTypes';
import { getChartOfAccounts } from '../../services/chartOfAccountsService';
import { MemberListDto } from '../../types/Member/memberTypes';
import { fetchAllMembers } from '../../services/memberService';
import { PaginationOptions } from '../../types/paginationTypes';
import MemberSearch from '../../components/MemberSearch';

const { Option } = Select;

interface ReceiptItem {
    key: string;
    description: string;
    amountDue: number;
    amountReceipted: number;
}

const CreateReceiptForm: React.FC = () => {
    const [form] = Form.useForm();
    const [receiptItems, setReceiptItems] = useState<ReceiptItem[]>([]);
    const [totalAmountDue, setTotalAmountDue] = useState<number>(0);
    const [totalAmountReceipted, setTotalAmountReceipted] = useState<number>(0);
    const [totalAmount, setTotalAmount] = useState<number>(0);
    const [warningVisible, setWarningVisible] = useState(false);
    const { showAlert } = alertService();
    const [chartsOfAccount, setChartsOfAccount] = useState<ChartOfAccount[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedMember, setSelectedMember] = useState<MemberListDto | null>(null);

    useEffect(() => {
        setWarningVisible(totalAmount !== totalAmountReceipted && totalAmount > 0);
    }, [totalAmount, totalAmountReceipted]);

    useEffect(() => {
        const fetchChartsOfAccounts = async () => {
            const results = await getChartOfAccounts();
            if (results.success) {
                setChartsOfAccount(results.data);
            }
        };
        fetchChartsOfAccounts();
    }, []);


    const handleMemberSelect = (member: MemberListDto) => {
        if (member) {
            setSelectedMember(member);
            form.setFieldsValue({ member: member.memberId });
        }
        setIsModalVisible(false);
        const fetchedItems: ReceiptItem[] = defaultReceiptItems.map((item, index) => ({
            key: (index + 1).toString(),
            description: item.description,
            amountDue: item.amountDue,
            amountReceipted: 0,
        }));

        setReceiptItems(fetchedItems);
        calculateTotalDue(fetchedItems);
    };

    const calculateTotalDue = (items: ReceiptItem[]) => {
        const totalDue = items.reduce((sum, item) => sum + item.amountDue, 0);
        setTotalAmountDue(totalDue);
    };

    const calculateTotalReceipted = (items: ReceiptItem[]) => {
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
        if (value === null) {
            setTotalAmount(0);
        } else {
            setTotalAmount(value);
        }
    };

    const handleSubmit = (values: CreateMemberReceiptRequestDTO) => {
        if (totalAmountReceipted !== totalAmount) {
            showAlert('Error', 'The total receipted amount must match the distributed amount.', 'error');
            return;
        }
        
        console.log('Form values: ', values);
        showAlert('Success', 'Receipt created successfully!', 'success');
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
            render: (text: number, record: ReceiptItem) => (
                <InputNumber
                    min={0}
                    value={record.amountReceipted}
                    onChange={value => handleAmountReceiptedChange(record.key, value || 0)}
                    style={{ width: '100%' }} // Ensure it fills the column
                    onBlur={() => {
                        // Show alert if amount receipted is greater than amount due
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
            render: (text: any, record: ReceiptItem) => (
                <Button type="link" onClick={() => removeReceiptItem(record.key)}>Remove</Button>
            ),
        },
    ];

    const addReceiptItem = (value: string) => {
        if (receiptItems.some(item => item.description === value)) {
            showAlert('Error', 'This receipt item has already been added.', 'error');
            return;
        }

        const newItem: ReceiptItem = {
            key: Date.now().toString(), // Unique key using timestamp
            description: value,
            amountDue: defaultReceiptItems.find(item => item.description === value)?.amountDue || 0,
            amountReceipted: 0,
        };

        setReceiptItems([...receiptItems, newItem]);
    };

    const removeReceiptItem = (key: string) => {
        const updatedItems = receiptItems.filter(item => item.key !== key);
        setReceiptItems(updatedItems);
        calculateTotalReceipted(updatedItems);
    };

    const defaultReceiptItems = [
        { description: 'Principal', amountDue: 2300 },
        { description: 'Interest', amountDue: 200 },
        { description: 'Deposit', amountDue: 200 },
        { description: 'Registration Fee', amountDue: 100 },
    ];

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
        >
            <div style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
                <Form.Item label="Member" name="member" style={{ marginBottom: '24px',width: '50%' }}>
                    <Select
                        placeholder="Select a member"
                        value={selectedMember ? selectedMember.memberId : undefined}
                        onClick={() => setIsModalVisible(true)}
                        allowClear
                        dropdownRender={() => <></>}
                        popupMatchSelectWidth={false}
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
                        placeholder="Total amount to be distributed"
                        style={{ width: '100%' }}
                    />
                </Form.Item>
            </div>

            <div style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
                <Form.Item
                    label="Receipt Date"
                    name="receiptDate"
                    rules={[{ required: true, message: 'Please select the receipt date' }]}
                    style={{ flex: 1 }}
                >
                    <DatePicker style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                    label="Receipt Method"
                    name="receiptMethod"
                    rules={[{ required: true, message: 'Please select a receipt method' }]}
                    style={{ flex: 1 }}
                >
                    <Select placeholder="Select a method" style={{ width: '100%' }}>
                        <Option value="cash">Cash</Option>
                        <Option value="bank_transfer">Bank Transfer</Option>
                        <Option value="mobile_money">Mobile Money</Option>
                    </Select>
                </Form.Item>
            </div>

            <div style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>

                <Form.Item
                    label="Debit Account"
                    name="debitAccountId"
                    rules={[{ required: true, message: 'Please select an debit account' }]}
                >
                    <Select placeholder="Select an account">
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
                    style={{ flex: 1 }}
                >
                    <Input placeholder="Optional" style={{ width: '100%' }} />
                </Form.Item>
            </div>

            <Form.Item
                label="Description"
                name="description"
                rules={[{ required: true, message: 'Please provide a description' }]}
                style={{ marginBottom: '24px' }}
            >
                <Input.TextArea rows={3} style={{ width: '100%' }} />
            </Form.Item>
            <Button type="primary" onClick={() => addReceiptItem('Item Description Here')}>Add Item</Button>
            {warningVisible && (
                <Alert
                    message="Warning"
                    description="The total amount receipted does not match the total amount."
                    type="warning"
                    showIcon
                    style={{ marginTop: '24px' }}
                />
            )}
            <Table
                columns={columns}
                dataSource={receiptItems}
                pagination={false}
                rowClassName="receipt-table-row"
                style={{ marginTop: '24px' }}
            />

            <Form.Item style={{ marginTop: '24px' }}>
                <Button type="primary" htmlType="submit">
                    Create Receipt
                </Button>
            </Form.Item>
            <Modal
                title="Search Members"
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                width={800}
            >
                <MemberSearch onMemberSelect={handleMemberSelect} />
            </Modal>
        </Form>
    );
};

export default CreateReceiptForm;
