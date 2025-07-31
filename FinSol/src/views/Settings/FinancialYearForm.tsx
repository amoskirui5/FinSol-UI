import React, { useEffect } from "react";
import { Form, Input, DatePicker, Switch, Button } from "antd";
import dayjs from "dayjs";
import { FinancialYearFormProps } from "../../types/Settings/financialYearTypes";

const FinancialYearForm: React.FC<FinancialYearFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        year: initialValues.year,
        startDate: dayjs(initialValues.startDate),
        endDate: dayjs(initialValues.endDate),
        isActive: initialValues.isActive,
      });
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  const handleFinish = (values: any) => {
    onSubmit(values);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      initialValues={{
        isActive: true,
      }}
    >
      <Form.Item
        label="Year"
        name="year"
        rules={[{ required: true, message: "Please enter the financial year" }]}
      >
        <Input placeholder="e.g. 2024/2025" />
      </Form.Item>

      <Form.Item
        label="Start Date"
        name="startDate"
        rules={[
          { required: true, message: "Please select start date" },
          {
            validator: (_, value) => {
              const endDate = form.getFieldValue("endDate");
              if (!value || !endDate || value.isBefore(endDate)) {
                return Promise.resolve();
              }
              return Promise.reject(
                new Error("Start date must be before end date")
              );
            },
          },
        ]}
      >
        <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item
        label="End Date"
        name="endDate"
        rules={[
          { required: true, message: "Please select end date" },
          {
            validator: (_, value) => {
              const startDate = form.getFieldValue("startDate");
              if (!value || !startDate || value.isAfter(startDate)) {
                return Promise.resolve();
              }
              return Promise.reject(
                new Error("End date must be after start date")
              );
            },
          },
        ]}
      >
        <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
      </Form.Item>


      <Form.Item label="Is Active" name="isActive" valuePropName="checked">
        <Switch />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Save
        </Button>{" "}
        <Button onClick={onCancel} style={{ marginLeft: 8 }}>
          Cancel
        </Button>
      </Form.Item>
    </Form>
  );
};

export default FinancialYearForm;
