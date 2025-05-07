import React, { useState, useEffect } from 'react';
import { Form, Button, DatePicker, Select, InputNumber } from 'antd';
import { fetchLoanTypes } from '../../services/loanTypeService';
import { PaginationOptions } from '../../types/paginationTypes';
import { LoanType } from '../../types/loanTypeTypes';
import { submitLoanApplication } from '../../services/memberLoanService';
import dayjs, { Dayjs } from 'dayjs';
import { CreateLoanApplicationRequest } from '../../types/MemberLoan/memberLoanTypes';
import { fetchAllMembers } from '../../services/memberService';
import { MemberListDto } from '../../types/Member/memberTypes';

const { Option } = Select;

const LoanApplicationForm: React.FC = () => {
    const [loanTypes, setLoanTypes] = useState<LoanType[]>([]);
    const [loading, setLoading] = useState(false);
    const [pageNumber, ] = useState<number>(1);
    const [pageSize, ] = useState<number>(10);
    const [searchTerm, ] = useState<string>('');
    const [searchField, ] = useState<string>('');
    const [members, setMembers] = useState<MemberListDto[]>([]);
    const [sortingType,] = useState<boolean>(false);

    const paginationOptions: PaginationOptions = {
        pageNumber,
        pageSize,
        searchTerm,
        searchField,
        sortDescending: sortingType
    };
    useEffect(() => {
        const getLoanTypes = async () => {
            const types = await fetchLoanTypes(paginationOptions);
            setLoanTypes(types.data.items);

        };
        getLoanTypes();
    }, []);

    useEffect(() => {
        fetchAllMembersAPI();
    }, [pageNumber, pageSize, searchTerm, searchField, sortingType]);

    const fetchAllMembersAPI = async () => {
        const response = await fetchAllMembers(paginationOptions);
        if (response.success) {
            setMembers(response.data.items);
        }

    };

    const onFinish = async (values: any) => {
        const requestData: CreateLoanApplicationRequest = {
            applicationDate: values.applicationDate.format('YYYY-MM-DD'),
            loanTypeId: values.loanTypeId,
            memberId: values.memberId,
            repayPeriod: values.repayPeriod,
            amount: values.amount,
        };

        setLoading(true);
        try {
            await submitLoanApplication(requestData);

        } catch (error) {
            setLoading(false);

        } finally {
            setLoading(false);
        }
    };

    // Validate that the application date does not exceed today
    const validateDate = (current: Dayjs) => {
        return current && current.isAfter(dayjs().endOf('day'));
    };

    return (
        <Form layout="vertical" onFinish={onFinish}>
            <Form.Item
                label="Application Date"
                name="applicationDate"
                rules={[{ required: true, message: 'Please select application date' }]}
            >
                <DatePicker disabledDate={validateDate} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
                label="Loan Type"
                name="loanTypeId"
                rules={[{ required: true, message: 'Please select loan type' }]}
            >
                <Select placeholder="Select loan type">
                    {loanTypes.map((type: any) => (
                        <Option key={type.loanTypeId} value={type.loanTypeId}>
                            {type.loanName}
                        </Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item
                label="Member Number"
                name="memberId"
                rules={[{ required: true, message: 'Please enter member number' }]}
            >
                <Select
                    placeholder="Select a member"
                    style={{ width: '100%' }}
                    loading={members.length === 0}
                >
                    {members.map((member) => (
                        <Option key={member.memberId} value={member.memberId}>
                            {member.firstName + ' ' + member.otherName}
                        </Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item
                label="Repay Period (Months)"
                name="repayPeriod"
                rules={[{ required: true, message: 'Please enter repay period' }]}
            >
                <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
                label="Loan Amount"
                name="amount"
                rules={[{ required: true, message: 'Please enter loan amount' }]}
            >
                <InputNumber min={0} precision={2} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                    Submit
                </Button>
            </Form.Item>
        </Form>
    );
};

export default LoanApplicationForm;
