import React, { useState, useEffect } from 'react';
import { Form, Input, Button, DatePicker, Select, InputNumber, Table, Modal, Alert, Switch } from 'antd';
import { CreateMemberReceiptRequestDTO, ReceiptItemDTO } from '../../types/MemberAccount/memberAccountTypes';
import { alertService } from '../../services/alertService';
import { useNavigate } from 'react-router-dom';
import { MemberAccountType } from '../../enums/enums';

const { Option } = Select;



const CreateReceiptForm: React.FC = () => {
    const [form] = Form.useForm();
    const [receiptItems, setReceiptItems] = useState<ReceiptItemDTO[]>([]);
    const [totalAmountDue, setTotalAmountDue] = useState<number>(0);
    const [totalAmountReceipted, setTotalAmountReceipted] = useState<number>(0);
    const [totalAmount, setTotalAmount] = useState<number>(0);
    const [warningVisible, setWarningVisible] = useState(false);
    const [autoDistribute, setAutoDistribute] = useState(false);
    const { showAlert } = alertService();
    const navigate = useNavigate();

    useEffect(() => {
        setWarningVisible(totalAmount !== totalAmountReceipted && totalAmount > 0);
    }, [totalAmount, totalAmountReceipted]);
    useEffect(() => {
        // If autoDistribute is enabled, set amountReceipted equal to amountDue for all items
        if (autoDistribute) {
            const updatedItems = receiptItems.map(item => ({
                ...item,
                amountReceipted: item.amountDue,
            }));
            setReceiptItems(updatedItems);
            calculateTotalReceipted(updatedItems);
        }
    }, [autoDistribute]);
    const handleMemberSelect = (memberId: string) => {
        const fetchedItems: ReceiptItemDTO[] = defaultReceiptItems.map((item, index) => ({
            key: (index + 1).toString(),
            description: item.description,
            amountDue: item.amountDue,
            amountReceipted: autoDistribute ? item.amountDue : 0,
            accountType: item.accountType
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
        if (value === null) {
            setTotalAmount(0);
        } else {
            setTotalAmount(value);
        }
    };

    const handleSubmit = (values: any) => {
        if (totalAmountReceipted !== totalAmount) {
            showAlert('Error', 'The total receipted amount must match the distributed amount.', 'error');
            return;
        }
    
        const receiptData: CreateMemberReceiptRequestDTO = {
            memberId: values.memberId,
            amount: totalAmount,
            receiptDate: values.receiptDate.format('YYYY-MM-DD'), // Format DatePicker value if necessary
            receiptMethod: values.receiptMethod,
            debitAccountId: values.debitAccountId,
            transactionReference: values.transactionReference,
            description: values.description,
            receiptItems: receiptItems.map(item => ({
                key: item.key,
                description: item.description,
                loanNo: item?.loanNo,
                amountDue: item.amountDue,
                amountReceipted: item.amountReceipted,
                accountType: item.accountType
            })),
        };
    
        console.log('Sending data to API: ', receiptData);
        // Call API here, e.g., API service call with receiptData
        showAlert('Success', 'Receipt created successfully!', 'success');
    };
    

    const handleBack = ()=>{
        navigate('/receipt-list')
    }
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

    const defaultReceiptItems = [
        { description: 'Principal',accountType: MemberAccountType.Loan, amountDue: 2300 },
        { description: 'Interest',accountType: MemberAccountType.Loan, amountDue: 200 },
        { description: 'Deposit', accountType: MemberAccountType.Deposits,amountDue: 200 },
        { description: 'Registration Fee',accountType: MemberAccountType.RegistrationFee, amountDue: 100 },
    ];

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
                    <Select placeholder="Select a member" onChange={handleMemberSelect} style={{ width: '100%' }}>
                        <Option value="member1">Member 1</Option>
                        <Option value="member2">Member 2</Option>
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
                        style={{ width: '100%' }} // Ensure it fills the column
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
                    label="Debit Account ID"
                    name="debitAccountId"
                    rules={[{ required: true, message: 'Please input the debit account ID' }]}
                    style={{ flex: 1 }}
                >
                    <Input style={{ width: '100%' }} />
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
            {warningVisible && (
                <Alert
                    message="Warning"
                    description="The total amount receipted does not match the total amount."
                    type="warning"
                    showIcon
                    style={{ marginTop: '24px' }}
                />
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                <Form.Item
                    label="Distribute Amount Automatically"
                    valuePropName="checked"
                    style={{ flex: 1 }}
                >
                    <Switch checked={autoDistribute} onChange={setAutoDistribute} />
                </Form.Item>
            </div>
            <Table
                columns={columns}
                dataSource={receiptItems}
                pagination={false}
                rowClassName="receipt-table-row"
                style={{ marginTop: '24px' }}
            />

            <Form.Item style={{ marginTop: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>

                    <Button type="primary" htmlType="submit">
                        Create Receipt
                    </Button>
                    <Button type="info" onClick={handleBack}>
                        Back To List
                    </Button>
                </div>

            </Form.Item>
        </Form>
    );
};

export default CreateReceiptForm;
