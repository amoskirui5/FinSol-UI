import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Select, Switch } from 'antd';
import { useNavigate } from 'react-router-dom';
import { getChartOfAccounts } from '../../services/chartOfAccountsService';
import { ChartOfAccount } from '../../types/Accounting/accountingTypes';
import { MemberAccountType } from '../../enums/enums';
import { registerMemberAccountSettings } from '../../services/memberAccountService';
import { RegisterMemberAccountDTO } from '../../types/MemberAccount/memberAccountTypes';

const { Option } = Select;

const CreateMemberAccountForm: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [chartsOfAccount, setChartsOfAccount] = useState<ChartOfAccount[]>([]);

    const onFinish = async (values:RegisterMemberAccountDTO) => {
        setLoading(true);
        const response= await registerMemberAccountSettings(values);
        if (response.success) {
            setLoading(false);
            navigate('/member-account-settings');
        }
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
        <Form layout="vertical" onFinish={onFinish}>
            <Form.Item
                label="Account Type"
                name="accountType"
                rules={[{ required: true, message: 'Please select account type' }]}
            >
                <Select placeholder="Select account type">
                    {Object.keys(MemberAccountType)
                        .filter(key => !isNaN(Number(key))) // Filter out non-numeric keys
                        .map((key) => (
                            <Option key={key} value={Number(key)}>
                                {MemberAccountType[key as keyof typeof MemberAccountType]}
                            </Option>
                        ))}
                </Select>
            </Form.Item>

            <Form.Item
                label="Description"
                name="description"
                rules={[{ required: true, message: 'Please enter a description' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Minimum Amount"
                name="minimumAmount"
                rules={[{ required: true, message: 'Please enter minimum amount' }]}
            >
                <Input type="number" />
            </Form.Item>

            <Form.Item
                label="Maximum Amount"
                name="maximumAmount"
                rules={[{ required: true, message: 'Please enter maximum amount' }]}
            >
                <Input type="number" />
            </Form.Item>

            <Form.Item
                label="Credit Account ID"
                name="creditAccountNumberId"
                rules={[{ required: true, message: 'Please select credit account ID!' }]}
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
                label="Is Withdrawable"
                name="isWithdrawable"
                valuePropName="checked"
            >
                <Switch />
            </Form.Item>

            <Form.Item
                label="Can Guarantee"
                name="canGuarantee"
                valuePropName="checked"
            >
                <Switch />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                    Create Account
                </Button>
            </Form.Item>
        </Form>
    );
};

export default CreateMemberAccountForm;
