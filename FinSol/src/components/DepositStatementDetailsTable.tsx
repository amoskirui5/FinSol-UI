import { Table } from "antd";
import { Deposit, DepositDetailsTableProps } from "../types/Member/memberTypes";
import { ColumnsType } from "antd/es/table";
import moment from "moment";

const DepositStatementDetailsTable: React.FC<DepositDetailsTableProps> = ({ deposits }) => {
    const depositDetailsColumns: ColumnsType<Deposit> = [
      { title: 'Deposit Date', dataIndex: 'depositDate', key: 'depositDate', render: (date) => moment(date).format('YYYY-MM-DD') },
      { title: 'Amount', dataIndex: 'amount', key: 'amount' },
      { title: 'Deposit Type', dataIndex: 'depositType', key: 'depositType' },
      { title: 'Notes', dataIndex: 'notes', key: 'notes' },
    ];
  
    return <Table columns={depositDetailsColumns} dataSource={deposits} rowKey={(deposit:Deposit) => deposit.depositDate + deposit.amount} pagination={false} />;
  };
  
  export default DepositStatementDetailsTable;