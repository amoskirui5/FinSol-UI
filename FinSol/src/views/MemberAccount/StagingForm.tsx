import React, { useEffect } from 'react';
import { Form, Input, Button, DatePicker } from 'antd';
import moment from 'moment';
import { LoanStagingRequestDTO, PaymentStagingRequestDTO } from '../../types/MemberLoan/memberLoanTypes';

interface StagingFormProps {
  memberId: string;
  loanAppId: string;
  initialAmount?: number;
  onSubmit: (dto: PaymentStagingRequestDTO) => void;
}

export const StagingForm: React.FC<StagingFormProps> = ({
  memberId,
  loanAppId,
  initialAmount,
  onSubmit,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      amount: initialAmount ?? 0,
      transactionDate: moment(),
      description: `Loan Staging loan Id ${loanAppId}`, // or memberName if available
    });
  }, [initialAmount, loanAppId, form]);

  const handleFinish = (values: any) => {
    const dto: LoanStagingRequestDTO = {
      memberId,
      loanApplicationId: loanAppId,
      amount: parseFloat(values.amount),
      transactionDate: values.transactionDate.toISOString(),
      description: values.description,
    };
    onSubmit(dto);
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleFinish}>
      <Form.Item
        label="Amount"
        name="amount"
        rules={[{ required: true, message: 'Please enter the amount' }]}
      >
        <Input type="number" />
      </Form.Item>

      <Form.Item
        label="Transaction Date"
        name="transactionDate"
        rules={[{ required: true, message: 'Please select the date' }]}
      >
        <DatePicker
          style={{ width: '100%' }}
          disabledDate={(current) => current && current > moment().endOf('day')}
        />
      </Form.Item>

      <Form.Item
        label="Description"
        name="description"
        rules={[{ required: true, message: 'Please enter a description' }]}
      >
        <Input.TextArea rows={3} />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Stage Loan
        </Button>
      </Form.Item>
    </Form>
  );
};
