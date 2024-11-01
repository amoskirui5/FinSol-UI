import Table, { ColumnsType } from "antd/es/table";
import { DepositTableProps, MonthlyDeposit } from "../types/Member/memberTypes";
import DepositStatementDetailsTable from "./DepositStatementDetailsTable";

const DepositStatementTable: React.FC<DepositTableProps> = ({ deposits }) => {
    const depositColumns: ColumnsType<MonthlyDeposit> = [
      { title: 'Month', dataIndex: 'depositMonth', key: 'depositMonth' },
      { title: 'Year', dataIndex: 'depositYear', key: 'depositYear' },
      { title: 'Total Monthly Deposit', dataIndex: 'totalMonthlyDeposit', key: 'totalMonthlyDeposit' },
    ];
  
    return (
      <Table
        columns={depositColumns}
        dataSource={deposits}
        rowKey={(record:MonthlyDeposit ) => `${record.depositYear}-${record.depositMonth}`}
        expandable={{
          expandedRowRender: (record:MonthlyDeposit ) => <DepositStatementDetailsTable deposits={record.deposits} />,
          rowExpandable: (record:MonthlyDeposit ) => record.deposits.length > 0,
        }}
        pagination={false}
      />
    );
  };
  
  export default DepositStatementTable;