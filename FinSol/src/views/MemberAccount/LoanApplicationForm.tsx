import React, { useState, useEffect } from 'react';
import { Form, Input, Button, DatePicker, Select, InputNumber, message } from 'antd';
import moment from 'moment';
import { fetchLoanTypes } from '../../services/loanTypeService';
import { PaginationOptions } from '../../types/paginationTypes';
import { LoanType } from '../../types/loanTypeTypes';
import { submitLoanApplication } from '../../services/memberLoanService';
import { alertService } from '../../services/alertService';
import dayjs, { Dayjs } from 'dayjs';
import { CreateLoanApplicationRequest } from '../../types/MemberLoan/memberLoanTypes';
import { fetchAllMembers } from '../../services/memberService';
import { MemberListDto } from '../../types/Member/memberTypes';

const { Option } = Select;
const { showAlert } = alertService();

const LoanApplicationForm: React.FC = () => {
    const [loanTypes, setLoanTypes] = useState<LoanType[]>([]);
    const [loading, setLoading] = useState(false);
    const [totalRecords, setTotalRecords] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [searchField, setSearchField] = useState<string>('');
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
            console.log(types.data.items);
            
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

    // Submit the form data
    const onFinish = async (values: any) => {
        const requestData: CreateLoanApplicationRequest = {
            applicationDate: values.applicationDate.format('YYYY-MM-DD'),
            loanTypeId: values.loanTypeId,
            memberNumber: values.memberNumber,
            repayPeriod: values.repayPeriod,
            amount: values.amount,
        };

        setLoading(true);
        try {
            const submitResponse = await submitLoanApplication(requestData);
            if (submitResponse.success) {

                showAlert("Success", submitResponse.message, 'success');
            }
            else {
                showAlert("Error", submitResponse.message, 'error');

            }
        } catch (error) {
            message.error('Failed to submit loan application');
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
                name="memberNumber"
                rules={[{ required: true, message: 'Please enter member number' }]}
            >
                <Select
                    placeholder="Select a member"
                    style={{ width: '100%' }}
                    loading={members.length === 0}  // Show loading if members haven't been fetched yet
                >
                    {members.map((member) => (
                        <Option key={member.memberNumber} value={member.memberNumber}>
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
