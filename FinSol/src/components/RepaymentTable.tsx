import { Table } from "antd";
import { MonthlyRepayment, RepaymentTableProps } from "../types/Member/memberTypes";
import { ColumnsType } from "antd/es/table";
import moment from "moment";

const RepaymentTable: React.FC<RepaymentTableProps> = ({ repayments }) => {
    const repaymentColumns: ColumnsType<MonthlyRepayment> = [
      { title: 'Month', dataIndex: 'month', key: 'month' },
      { title: 'Year', dataIndex: 'year', key: 'year' },
      { title: 'Amount Paid', dataIndex: 'amountPaid', key: 'amountPaid' },
      { title: 'Interest Paid', dataIndex: 'interestPaid', key: 'interestPaid' },
      { title: 'Principal Paid', dataIndex: 'principalPaid', key: 'principalPaid' },
      { title: 'Payment Date', dataIndex: 'paymentDate', key: 'paymentDate', render: (date) => moment(date).format('YYYY-MM-DD') },
    ];
  
    return <Table columns={repaymentColumns} dataSource={repayments} rowKey={(repayment:MonthlyRepayment) => `${repayment.month}-${repayment.year}`} pagination={false} />;
  };
  
  export default RepaymentTable;