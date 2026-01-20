import React, { useEffect, useState, useMemo } from 'react';
import { Table, Button, Tooltip, Tag, Popconfirm, Input, Form, DatePicker, InputNumber, Modal, Space, Select, message, Typography } from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DollarCircleOutlined,
  InfoCircleOutlined,
  EyeOutlined,
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  HourglassOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

import LoanEligibilityModal from './LoanEligibilityModal';
import LoanApprovalConfirmationModal from './LoanApprovalConfirmationModal';
import { AddGuarantorRequest, GuarantorList, LoanApplicationList, LoanInfoResponseDTO, LoanStagingRequestDTO, UpdateGuarantorRequest, LoanElegibilityResponse } from '../types/MemberLoan/memberLoanTypes';
import { PaginationOptions } from '../types/paginationTypes';
import { fetchLoanApplications, fetchLoanEligibility, StageLoanDisbursement } from '../services/memberLoanService';
import { LoanStatus } from '../enums/enums';
import { formatCurrency } from '../Utility/formatCurrency';
import { ColumnsType } from 'antd/es/table';
import { MemberListDto } from '../types/Member/memberTypes';
import { Option } from 'antd/es/mentions';
import MemberSearch from './MemberSearch';
import { alertService } from '../services/alertService';
import { AddGuarantor, DeleteGuarantor, UpdateGuarantor } from '../services/GuarantorService';
import { StagingForm } from '../views/MemberAccount/StagingForm';


const LoanApplicationsTable: React.FC = () => {
  const [loanApplications, setLoanApplications] = useState<LoanApplicationList[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isGuarantorModalVisible, setIsGuarantorModalVisible] = useState(false);
  const [isMemberModalVisible, setIsMemberModalVisible] = useState(false);
  const [loanInfo, setLoanInfo] = useState<LoanInfoResponseDTO | null>(null);
  const [eligibilityResponseState, setEligibilityResponseState] = useState<LoanElegibilityResponse | null>(null);
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [requestedLoanAmount, setRequestedLoanAmount] = useState<number>(0);
  const [memLoanId, SetMemLoanId] = useState<string>('');
  const [selectedLoan, setSelectedLoan] = useState<LoanApplicationList | null>(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [selectedGuarantorMember, setSelectedGuarantorMember] = useState<MemberListDto | null>(null);
  const [editingGuarantor, setEditingGuarantor] = useState<GuarantorList | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isStagingModalVisible, setIsStagingModalVisible] = useState(false);


  const paginationOptions: PaginationOptions = useMemo(() => ({
    ...(searchTerm && searchTerm.trim() !== '' && {
      searchTerm,
      searchField: 'name',
    }),
  }), [searchTerm]);

  const { showAlert } = alertService();
  const { Text } = Typography;

  useEffect(() => {
    const getLoanApplications = async () => {
      setLoading(true);
      const response = await fetchLoanApplications(paginationOptions);

      console.log('Loan Applications Data:', response.data.items);
      setLoanApplications(response.data.items);
      setLoading(false);
    };
    getLoanApplications();
  }, [paginationOptions]);

  const handleApproveLoan = async (
    loanId: string,
    memberId: string,
    loanTypeId: string,
    requestedAmount: number
  ) => {
    // store the requested amount and loan id
    setRequestedLoanAmount(requestedAmount);
    SetMemLoanId(loanId);

    const eligibilityResponse = await fetchLoanEligibility(memberId, loanTypeId);
    // store the full eligibility response for debugging/consumption by the modal if needed
    setEligibilityResponseState(eligibilityResponse as LoanElegibilityResponse);
    if (eligibilityResponse.success) {
      // attach the applied/requested amount directly to the loanInfo object so it is available
      // to the modal immediately (avoids timing issues with separate state updates)
      setLoanInfo({ ...eligibilityResponse.data, loanId, appliedAmount: requestedAmount } as any);
      setIsModalVisible(true);
    }
  };

  const handleConfirmApproval = (_loanId?: string) => {
    // mark param as used to avoid unused-var lint
    void _loanId;
    setIsConfirmModalVisible(false);
    // Trigger your approval logic here
  };

  const handleCancelApproval = () => {
    setIsConfirmModalVisible(false);
  };

  const handleDeclineLoan = (_loanId?: string) => {
    // mark param as used to avoid unused-var lint
    void _loanId;
    // Trigger your decline logic here
  };

  const handleCheckMemberInfo = async (
    memberId: string,
    loanTypeId: string,
    loanId: string
  ) => {
    setLoading(true);
    const eligibilityResponse = await fetchLoanEligibility(memberId, loanTypeId);
    // store full response for modal
    setEligibilityResponseState(eligibilityResponse as LoanElegibilityResponse);
    if (eligibilityResponse.success) {
      setLoanInfo({ ...eligibilityResponse.data, loanId });
      setIsModalVisible(true);
    }
    setLoading(false);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const handleContinueApproval = () => {
    // Pass the applied/requested amount along so the approval form can prefill the approved amount
    navigate(`/loan-approval/${loanInfo?.loanId}`, { state: { loanInfo, appliedAmount: requestedLoanAmount } });
  };

  const handleDisburseLoan = (loanAppId: string) => {
    navigate(`/loan-disbursement/${loanAppId}`);
  };

  const handleViewDetails = (loanId: string) => {
    navigate(`/loan-applications/${loanId}`);
  };

  const showAddGuarantorModal = (loan: LoanApplicationList) => {
    setSelectedLoan(loan);
    form.resetFields();
    setIsGuarantorModalVisible(true);
  };

  const handleAddGuarantor = async () => {
    try {
      const values = await form.validateFields();
      const newGuarantor: AddGuarantorRequest = {
        guarantorMemberId: values.memberId,
        guaranteedAmount: values.guaranteedAmount,
        guaranteeDate: values.guaranteeDate.format("YYYY-MM-DD"),
        loanId: selectedLoan!.loanId,
      };

      await AddGuarantor(newGuarantor);

      setIsGuarantorModalVisible(false);

      // Refresh the table data
      const response = await fetchLoanApplications(paginationOptions);
      setLoanApplications(response.data.items);

    } catch (error) {
      console.error("Validation or AddGuarantor failed:", error);
    }
  };


  const handleGuarantorMemberSelect = (member: MemberListDto) => {
    if (!member || member.memberId === selectedGuarantorMember?.memberId) return;
    setSelectedGuarantorMember(member);

    if (selectedLoan?.memberId === member?.memberId) {

      showAlert('A member cannot guarantee their own loan.', 'Please select a different member.', 'error');
      return;
    }
    form.setFieldsValue({ memberId: member.memberId });
    setIsMemberModalVisible(false);
  };

  const renderStatusTag = (status: LoanStatus) => {
    const colorMap: Record<LoanStatus, string> = {
      [LoanStatus.Applied]: 'blue',
      [LoanStatus.Approved]: 'green',
      [LoanStatus.Declined]: 'red',
      [LoanStatus.Disbursed]: 'gold',
      [LoanStatus.Pending]: 'gray',
      [LoanStatus.PartiallyDisbursed]: 'purple',
      [LoanStatus.Staged]: 'orange',
    };

    return <Tag color={colorMap[status]}>{LoanStatus[status]}</Tag>;
  };

  const handleEditGuarantor = (guarantor: GuarantorList) => {
    setIsEditMode(true);
    setEditingGuarantor(guarantor);
    setIsGuarantorModalVisible(true);

    form.setFieldsValue({
      memberId: guarantor.guarantorMemberId,
      guaranteedAmount: guarantor.guaranteedAmount,
      guaranteeDate: guarantor.guaranteeDate ? moment(guarantor.guaranteeDate) : null,
    });

    const guarantorMemberDto: MemberListDto = {
      memberId: guarantor.guarantorMemberId,
      firstName: guarantor.guarantorMemberName?.split(' ')[0] || '',
      otherName: guarantor.guarantorMemberName?.split(' ').slice(1).join(' ') || '',
      memberNumber: guarantor.memberNumber || '',
    };

    setSelectedGuarantorMember(guarantorMemberDto);
  };


  const handleDeleteGuarantor = async (guarantorId: string, loanId: string) => {
    try {

      await DeleteGuarantor(loanId, guarantorId);

      // Refresh the loan applications data
      const response = await fetchLoanApplications(paginationOptions);
      setLoanApplications(response.data.items);

    } catch (error) {
      console.error('Error deleting guarantor:', error);
      message.error('Failed to remove guarantor');
    }
  };

  const handleModalCancel = () => {
    setIsGuarantorModalVisible(false);
    setIsEditMode(false);
    setEditingGuarantor(null);
    setSelectedGuarantorMember(null);
    form.resetFields();
  };

  const handleGuarantorSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (isEditMode && editingGuarantor) {
        if (!editingGuarantor.loanGuarantorId) {
          message.error('Guarantor ID is missing, cannot update.');
          return;
        }

        const updateDto: UpdateGuarantorRequest = {
          guaranteedAmount: values.guaranteedAmount,
          guaranteeDate: values.guaranteeDate.format("YYYY-MM-DD"),
          guarantorMemberId: values.memberId,
          loanGuarantorId: editingGuarantor.loanGuarantorId,
          loanId: editingGuarantor.loanId,
        };

        await UpdateGuarantor(updateDto.loanGuarantorId, updateDto);
      } else {
        await handleAddGuarantor();
        return;
      }

      handleModalCancel();
      const response = await fetchLoanApplications(paginationOptions);
      setLoanApplications(response.data.items);

    } catch (error) {
      console.error('Error saving guarantor:', error);
      message.error(`Failed to ${isEditMode ? 'update' : 'add'} guarantor`);
    }
  };

  const handleStageLoan = (record: LoanApplicationList) => {
    setSelectedLoan(record);
    setIsStagingModalVisible(true);
  };

  const loanColumns = [
    {
      title: 'Loan Number',
      dataIndex: 'loanNumber',
      key: 'loanNumber',
    },
    {
      title: 'Application Date',
      dataIndex: 'applicationDate',
      key: 'applicationDate',
      render: (text: string) => moment(text).format('YYYY-MM-DD'),
    },
    {
      title: 'Loan Type',
      dataIndex: 'loanName',
      key: 'loanName',
    },
    {
      title: 'Member Number',
      dataIndex: 'memberNumber',
      key: 'memberNumber',
    },
    {
      title: 'Member Name',
      dataIndex: 'memberName',
      key: 'memberName',
    },
    {
      title: 'Repayment (Months)',
      dataIndex: 'repayPeriod',
      key: 'repayPeriod',
    },
    {
      title: 'Status',
      dataIndex: 'loanStatus',
      key: 'loanStatus',
      render: renderStatusTag,
    },
    {
      // The API/type uses `amount` for the applied/requested amount. Use the record's amount to be safe.
      title: 'Applied Amount',
      dataIndex: 'amount',
      key: 'appliedAmount',
      render: (_: unknown, record: LoanApplicationList) =>
        formatCurrency(record.amount ?? (record as Partial<LoanApplicationList> & { appliedAmount?: number }).appliedAmount ?? 0),
    },
    {
      title: 'Approved Amount',
      key: 'approvedAmount',
      dataIndex: 'approvedAmount',

      render: (_: unknown, record: LoanApplicationList) =>
        record.loanApproval?.approvedAmount != null
          ? formatCurrency(record.loanApproval.approvedAmount)
          : '-',
    },
    {
      title: 'Disbursed Amount',
      dataIndex: 'disbursedAmount',
      key: 'disbursedAmount',
      render: (_: unknown, record: LoanApplicationList) =>
        record.loanDisbursement?.disbursedAmount != null
          ? formatCurrency(record.loanDisbursement.disbursedAmount)
          : '-',
    },
    {
      title: 'Loan Balance',
      dataIndex: 'loanBalance',
      key: 'loanBalance',
      render: (_: unknown, record: LoanApplicationList) =>
        (record as any).loanBalance != null
          ? formatCurrency((record as any).loanBalance)
          : '-',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: LoanApplicationList) => (
        <div>
          {/* Approve Loan */}
          <Tooltip title={record.loanStatus === LoanStatus.Pending ? "Approve Loan" : "Loan Past Approval Stage"}>
            <Button
              type="primary"
              icon={<CheckCircleOutlined />}
              onClick={() => {
                // derive applied/requested amount defensively: prefer record.amount, then record.appliedAmount
                const applied = record.amount ?? (record as any).appliedAmount ?? 0;
                handleApproveLoan(record.loanId, record.memberId, record.loanTypeId, applied);
              }}
              disabled={record.loanStatus !== LoanStatus.Pending}
              style={{ marginRight: 8 }}
            />
          </Tooltip>

          {/* Decline Loan */}
          <Popconfirm
            title="Are you sure you want to decline this loan?"
            onConfirm={() => handleDeclineLoan(record.loanId)}
            okText="Yes"
            cancelText="No"
            disabled={record.loanStatus !== LoanStatus.Applied && record.loanStatus !== LoanStatus.Pending}
          >
            <Tooltip title="Decline Loan">
              <Button
                danger
                icon={<CloseCircleOutlined />}
                disabled={record.loanStatus !== LoanStatus.Applied && record.loanStatus !== LoanStatus.Pending}
                style={{ marginRight: 8 }}
              />
            </Tooltip>
          </Popconfirm>

          {/* Stage Loan (only if Approved) */}
          {record.loanStatus === LoanStatus.Approved && (
            <Tooltip title="Stage Loan for Disbursement">
              <Button
                type="default"
                icon={<HourglassOutlined />}
                onClick={() => handleStageLoan(record)}
                style={{ marginRight: 8 }}
              />
            </Tooltip>
          )}

          {/* Disburse Loan (only if already staged) */}
          {record.loanStatus === LoanStatus.Staged && (
            <Tooltip title="Disburse Loan">
              <Button
                type="primary"
                icon={<DollarCircleOutlined />}
                onClick={() => handleDisburseLoan(record.loanId)}
                style={{ marginRight: 8 }}
              />
            </Tooltip>
          )}

          {/* Check Member Info */}
          <Tooltip title="Check Member Info">
            <Button
              icon={<InfoCircleOutlined />}
              onClick={() =>
                handleCheckMemberInfo(record.memberId, record.loanTypeId, record.loanId)
              }
              style={{ marginRight: 8 }}
            />
          </Tooltip>

          {/* View Application */}
          <Tooltip title="View Application">
            <Button
              icon={<EyeOutlined />}
              onClick={() => handleViewDetails(record.loanId)}
            />
          </Tooltip>
        </div>
      ),
    },

  ];

  // Guarantor columns
  const guarantorColumns: ColumnsType<GuarantorList> = [
    {
      title: "Member Number",
      dataIndex: "memberNumber",
      key: "memberNumber",
    },
    {
      title: "Name",
      dataIndex: "guarantorMemberName",
      key: "guarantorMemberName",
    },
    {
      title: "Guaranteed Amount",
      dataIndex: "guaranteedAmount",
      key: "guaranteedAmount",
      render: (amount: number) => `KES ${amount.toLocaleString()}`,
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_: unknown, record: GuarantorList) => (
        <Space size="small">
          <Tooltip title="Edit Guarantor">
            <Button
              type="link"
              icon={<EditOutlined />}
              size="small"
              onClick={() => handleEditGuarantor(record)}
            />
          </Tooltip>

          <Popconfirm
            title="Remove Guarantor"
            description="Are you sure you want to remove this guarantor?"
            onConfirm={() => handleDeleteGuarantor(record?.guarantorMemberId, record?.loanId)}
            okText="Yes"
            cancelText="No"
            placement="topRight"
          >
            <Tooltip title="Remove Guarantor">
              <Button
                type="link"
                danger
                icon={<DeleteOutlined />}
                size="small"
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  async function handleStagingSubmit(data: LoanStagingRequestDTO) {
    setLoading(true);
    try {
      await StageLoanDisbursement(data);
      setIsStagingModalVisible(false);
      // Refresh the loan applications list
      const response = await fetchLoanApplications(paginationOptions);
      setLoanApplications(response.data.items);
    } catch (error) {
      message.error('Failed to stage loan for disbursement');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Input.Search
        placeholder="Search by member name"
        onSearch={(value) => setSearchTerm(value)}
        style={{ marginBottom: 16, width: 300 }}
        allowClear
      />

      <Table<LoanApplicationList>
        columns={loanColumns}
        dataSource={loanApplications}
        loading={loading}
        rowKey="loanNumber"
        pagination={{ pageSize: 10 }}
        expandable={{
          expandedRowRender: (record) => (
            <>
              <div style={{ marginBottom: 12 }}>
                <Space>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => showAddGuarantorModal(record)}
                  >
                    Add Guarantor
                  </Button>
                  <Text type="secondary">
                    Total Guarantors: {record?.memberLoanGuarantors?.length || 0}
                  </Text>
                </Space>
              </div>

              <Table
                columns={guarantorColumns}
                dataSource={record?.memberLoanGuarantors}
                rowKey="loanGuarantorId"
                pagination={false}
                size="small"
                locale={{
                  emptyText: "No guarantors added yet"
                }}
              />
            </>
          ),
          rowExpandable: () => true,
        }}
        scroll={{ x: 'max-content' }}
      />

      <Modal
        title={isEditMode ? "Edit Guarantor" : "Add Guarantor"}
        open={isGuarantorModalVisible}
        onCancel={handleModalCancel}
        onOk={handleGuarantorSubmit}
        okText={isEditMode ? "Update" : "Add"}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Guarantor ID"
            name="memberId"
            rules={[{ required: true, message: 'Please select a Guarantor' }]}
            style={{ flex: 1 }}
          >
            <Select
              placeholder="Select a Guarantor"
              value={selectedGuarantorMember?.memberId}
              onClick={() => setIsMemberModalVisible(true)}
              allowClear
              dropdownRender={() => <></>}
              style={{ width: '100%' }}
            >
              {selectedGuarantorMember && (
                <Option key={selectedGuarantorMember.memberId} value={selectedGuarantorMember.memberId}>
                  {`${selectedGuarantorMember.firstName} ${selectedGuarantorMember.otherName}`}
                </Option>
              )}
            </Select>
          </Form.Item>

          <Form.Item
            label="Guaranteed Amount"
            name="guaranteedAmount"
            rules={[{ required: true, message: "Enter amount" }]}
          >
            <InputNumber style={{ width: "100%" }} min={1000} />
          </Form.Item>

          <Form.Item
            label="Guarantee Date"
            name="guaranteeDate"
            rules={[{ required: true, message: "Select date" }]}
          >
            <DatePicker style={{ width: "100%" }} disabledDate={d => d > moment()} />
          </Form.Item>
        </Form>
      </Modal>

      <LoanEligibilityModal
        visible={isModalVisible}
        onClose={handleModalClose}
        continueApproval={handleContinueApproval}
        loanInfo={loanInfo}
        loading={loading}
        appliedAmount={requestedLoanAmount || (loanInfo as any)?.appliedAmount}
        eligibilityResponse={eligibilityResponseState}
      />

      <LoanApprovalConfirmationModal
        visible={isConfirmModalVisible}
        onConfirm={() => handleConfirmApproval(memLoanId)}
        onCancel={handleCancelApproval}
        requestedAmount={requestedLoanAmount}
        maxQualified={loanInfo?.maxLoanQualified || 0}
      />

      <Modal
        title="Search Member"
        open={isMemberModalVisible}
        onCancel={() => setIsMemberModalVisible(false)}
        footer={null}
        width="80%"
        bodyStyle={{ padding: 0 }}
      >
        <MemberSearch onMemberSelect={handleGuarantorMemberSelect} />
      </Modal>

      <Modal
        title="Stage Loan Disbursement"
        open={isStagingModalVisible}
        onCancel={() => setIsStagingModalVisible(false)}
        footer={null}
        destroyOnClose
      >
        {selectedLoan && (
          <StagingForm
            memberId={selectedLoan.memberId}
            loanAppId={selectedLoan.loanId}
            initialAmount={selectedLoan.loanApproval.approvedAmount}
            onSubmit={(data) => {
              handleStagingSubmit(data);
              setIsStagingModalVisible(false);
            }}
          />
        )}
      </Modal>

    </div>
  );
};

export default LoanApplicationsTable;

