import Table, { ColumnsType } from "antd/es/table";
import RepaymentTable from "./RepaymentTable";
import { LoanStatement, LoanTableProps } from "../types/Member/memberTypes";
import moment from "moment";

const LoanStatementTable: React.FC<LoanTableProps> = ({ loans }) => {
    const loanColumns: ColumnsType<LoanStatement> = [
      { title: 'Loan Number', dataIndex: 'loanNumber', key: 'loanNumber' },
      { title: 'Total Loan Amount', dataIndex: 'totalLoanAmount', key: 'totalLoanAmount' },
      { title: 'Monthly Repayment Amount', dataIndex: 'monthlyRepaymentAmount', key: 'monthlyRepaymentAmount' },
      { title: 'Outstanding Balance', dataIndex: 'outstandingBalance', key: 'outstandingBalance' },
      { title: 'Interest Rate (%)', dataIndex: 'interestRate', key: 'interestRate' },
      { title: 'Due Date', dataIndex: 'dueDate', key: 'dueDate', render: (date) => moment(date).format('YYYY-MM-DD') },
    ];
  
    return (
      <Table
        columns={loanColumns}
        dataSource={loans}
        rowKey="loanId"
        expandable={{
          expandedRowRender: (record:LoanStatement) => <RepaymentTable repayments={record.monthlyRepayments} />,
          rowExpandable: (record: LoanStatement) => record.monthlyRepayments.length > 0,
        }}
        pagination={false}
      />
    );
  };
  
  export default LoanStatementTable;