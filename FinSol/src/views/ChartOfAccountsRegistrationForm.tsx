import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Select, Switch } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { AccountClass, ChartOfAccount, RegisterAccountDTO } from '../types/accountingTypes';
import { editChartOfAccount, getAccountClass, getChartOfAccountsById, registerChartOfAccount } from '../services/chartOfAccountsService';

const ChartOfAccountsRegistrationForm: React.FC = () => {
    const [accountClasses, setAccountClasses] = useState<AccountClass[]>([]);
    const [chartsOfAccount, setChartsOfAccount] = useState<ChartOfAccount | null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [form] = Form.useForm();

    const fetchAccountClasses = async () => {
        const results = await getAccountClass();
        if (results.success) {
            setAccountClasses(results.data);
        }
    };

    const fetchChartsOfAccountById = async () => {
        const results = await getChartOfAccountsById(id);
        if (results) {

            setChartsOfAccount(results.data);
        }
    };

    useEffect(() => {
        fetchAccountClasses();
        fetchChartsOfAccountById();
    }, [id]);

    useEffect(() => {
        if (chartsOfAccount) {
            form.setFieldsValue({
                AccountName: chartsOfAccount.accountName,
                ClassId: chartsOfAccount.classId,
                Description: chartsOfAccount.description,
                isReceiptable: chartsOfAccount.isReceiptable,
                isPayable: chartsOfAccount.isPayable
            });
        }
    }, [chartsOfAccount, form]);

    const handleBack = () => {
        navigate('/chart-of-accounts');
    };



    const onFinish = async (values: any) => {
        try {
            setLoading(true);
            const requestDTO: RegisterAccountDTO = {
                accountName: values.AccountName,
                classId: values.ClassId,
                description: values.Description,
                accountCode: '',
                isReceiptable: values.isReceiptable,
                isPayable: values.isPayable
            };

            if (id) {
                await editChartOfAccount(id, requestDTO);
            }
            else {
                await registerChartOfAccount(requestDTO);

            }
            handleBack();
        } catch (error) {
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form
            form={form}
            name="chartOfAccountForm"
            layout="vertical"
            onFinish={onFinish}
        >
            <Form.Item
                label="Account Name"
                name="AccountName"
                rules={[{ required: true, message: 'Please input the account name!' }]}
            >
                <Input type="text" />
            </Form.Item>

            <Form.Item
                label="Account Class"
                name="ClassId"
                rules={[{ required: true, message: 'Please select an account class!' }]}
            >
                <Select placeholder="Select an account class">
                    {accountClasses.map((accountClass) => (
                        <Select.Option key={accountClass.id} value={accountClass.id}>
                            {accountClass.name}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item
                label="Description"
                name="Description"
                rules={[{ required: true, message: 'Please input the description!' }]}
            >
                <Input.TextArea />
            </Form.Item>

            <Form.Item
                label="Is Receiptable"
                name="isReceiptable"
                valuePropName="checked"
                initialValue={false}
            >
                <Switch />
            </Form.Item>

            <Form.Item
                label="Is Payable"
                name="isPayable"
                valuePropName="checked"
                initialValue={false}
            >
                <Switch />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} style={{ marginRight: 8 }}>
                    Submit
                </Button>
                <Button type="default" onClick={handleBack}>
                    Back
                </Button>
            </Form.Item>
        </Form>
    );

};

export default ChartOfAccountsRegistrationForm;
