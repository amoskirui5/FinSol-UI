
export const LOGIN=`${import.meta.env.VITE_API_BASE_URL}api/user/userlogin`;
export const ALL_SYSTEM_USERS=`${import.meta.env.VITE_API_BASE_URL}api/User/allusers`
export const ALL_SYSTEM_ROLES=`${import.meta.env.VITE_API_BASE_URL}api/Roles/GetActiveRoles`
export const REGISTER_SYSTEM_USER=`${import.meta.env.VITE_API_BASE_URL}api/User/UserRegistration`
export const REGISTER_ACCOUNT_CLASS=`${import.meta.env.VITE_API_BASE_URL}api/ChartsOfAccounts/addaccountclass`
export const GET_ACCOUNT_CLASS=`${import.meta.env.VITE_API_BASE_URL}api/ChartsOfAccounts/listaccountclasses`
export const REGISTER_CHARTS_OF_ACCOUNT=`${import.meta.env.VITE_API_BASE_URL}api/ChartsOfAccounts/addchartsofaccount`
export const EDIT_CHARTS_OF_ACCOUNT=`${import.meta.env.VITE_API_BASE_URL}api/ChartsOfAccounts/editchartsofaccount`
export const EDIT_ACCOUNT_CLASS=`${import.meta.env.VITE_API_BASE_URL}api/ChartsOfAccounts/editaccountclass`
export const GET_CHART_OF_ACCOUNT=`${import.meta.env.VITE_API_BASE_URL}api/ChartsOfAccounts/listchartsofaccount`
export const GET_CHART_OF_ACCOUNT_BY_ID=`${import.meta.env.VITE_API_BASE_URL}api/ChartsOfAccounts/chartofaccount`
export const GET_ACCOUNT_CLASS_BY_ID=`${import.meta.env.VITE_API_BASE_URL}api/ChartsOfAccounts/accountclass`
export const DELETE_CHART_OF_ACCOUNT=`${import.meta.env.VITE_API_BASE_URL}api/ChartsOfAccounts/deletechartofaccount`
export const DELETE_ACCOUNT_ClASS=`${import.meta.env.VITE_API_BASE_URL}api/ChartsOfAccounts/deleteaccountclass`

//chart of account
export const GET_RECEIPTABLE_CHARTS_OF_ACCOUNT =`${import.meta.env.VITE_API_BASE_URL}api/ChartsOfAccounts/ReceiptableChartsOfAccount`
export const GET_PAYEABLE_CHARTS_OF_ACCOUNT =`${import.meta.env.VITE_API_BASE_URL}api/ChartsOfAccounts/GetPayeableChartsOfAccount`
export const GET_SUB_ACCOUNT_CLASS_BY_CLASS_ID =`${import.meta.env.VITE_API_BASE_URL}api/ChartsOfAccounts/list-subaccounts-by-class`;

//Loans
export const REGISTER_LOAN_TYPE=`${import.meta.env.VITE_API_BASE_URL}api/loantypes/createLoanType`
export const FETCH_LOAN_TYPES=`${import.meta.env.VITE_API_BASE_URL}api/loantypes`
export const FETCH_LOAN_TYPE_BY_ID=`${import.meta.env.VITE_API_BASE_URL}api/loantypes`
export const EDIT_LOAN_TYPE=`${import.meta.env.VITE_API_BASE_URL}api/loantypes/update`
export const DELETE_LOAN_TYPE=`${import.meta.env.VITE_API_BASE_URL}api/loantypes/delete`

//Member
export const REGISTER_MEMBER = `${import.meta.env.VITE_API_BASE_URL}api/members/REGISTER`;
export const GET_MEMBER_BY_ID = `${import.meta.env.VITE_API_BASE_URL}api/members`;
export const GET_ALL_MEMBERS= `${import.meta.env.VITE_API_BASE_URL}api/members`;
export const GET_ALL_MEMBERS_BY_JOIN_DATE= `${import.meta.env.VITE_API_BASE_URL}api/members/by-join-date`;
export const UPDATE_MEMBER_DETAILS= `${import.meta.env.VITE_API_BASE_URL}api/members/update`;

//member next of kin
export const CREATE_MEMBER_NEXT_OF_KIN=`${import.meta.env.VITE_API_BASE_URL}api/MemberNextOfKin/add`
export const UPDATE_MEMBER_NEXT_OF_KIN=`${import.meta.env.VITE_API_BASE_URL}api/MemberNextOfKin`;
export const DELETE_MEMBER_NEXT_OF_KIN=`${import.meta.env.VITE_API_BASE_URL}api/MemberNextOfKin`;
export const GET_MEMBER_NEXT_OF_KIN_BY_ID=`${import.meta.env.VITE_API_BASE_URL}api/MemberNextOfKin`;
export const GET_MEMBER_NEXT_OF_KIN_BY_MEMBER_ID=`${import.meta.env.VITE_API_BASE_URL}api/MemberNextOfKin/by-member-id`;

// member account
export const GET_ALL_MEMBER_ACCOUNTS_SETTINGS=`${import.meta.env.VITE_API_BASE_URL}api/MemberAccount`

// Member Receipts
export const GET_ITEMS_TO_RECEIPT=`${import.meta.env.VITE_API_BASE_URL}api/MemberReceipts/get-member-items-to-receipt`
export const CREATE_MEMBER_RECEIPT = `${import.meta.env.VITE_API_BASE_URL}api/MemberReceipts/create`

//member loan
export const CREATE_MEMBER_LOAN_APPLICATION = `${import.meta.env.VITE_API_BASE_URL}api/MemberLoan/CreateApplication`
export const FETCH_MEMBER_LOAN_APPLICATION = `${import.meta.env.VITE_API_BASE_URL}api/MemberLoan/LoanApplications`
export const FETCH_LOAN_ELIGIBILITY = `${import.meta.env.VITE_API_BASE_URL}api/MemberLoan/eligibility`
export const FETCH_LOAN_APPLICATION_BY_ID = `${import.meta.env.VITE_API_BASE_URL}api/MemberLoan/LoanApplication`
export const CREATE_MEMBER_LOAN_APPROVAL = `${import.meta.env.VITE_API_BASE_URL}api/MemberLoan/CreateApproval`
export const CREATE_MEMBER_LOAN_DISBURSEMENT = `${import.meta.env.VITE_API_BASE_URL}api/MemberLoan/CreateDisbursement`
export const FETCH_LOAN_APPROVAL_BY_ID = `${import.meta.env.VITE_API_BASE_URL}api/MemberLoan/LoanApproval`
export const CREATE_MEMBER_LOAN_STAGE = `${import.meta.env.VITE_API_BASE_URL}api/MemberLoan/StageLoanDisbursement`

// member statement
export const FETCH_MEMBER_GENERAL_STATEMENT =`${import.meta.env.VITE_API_BASE_URL}api/MemberStatement/loans-deposits?memberId`
export const EXPORT_MEMBER_STATEMENT =`${import.meta.env.VITE_API_BASE_URL}api/MemberStatement/pdf-statement`

// financial statement
export const FETCH_TRIAL_BALANCE = `${import.meta.env.VITE_API_BASE_URL}api/FinancialStatements/trial-balance`
export const FETCH_BALANCE_SHEET = `${import.meta.env.VITE_API_BASE_URL}api/FinancialStatements/balance-sheet`
export const FETCH_CASH_BOOK = `${import.meta.env.VITE_API_BASE_URL}api/FinancialStatements/cash-book`

// Member Payments
export const GET_ITEMS_TO_PAY=`${import.meta.env.VITE_API_BASE_URL}api/MemberPayments/get-member-items-to-pay`
export const CREATE_MEMBER_PAYMENT = `${import.meta.env.VITE_API_BASE_URL}api/MemberPayments/create`

//Guarantor
export const ADD_GUARANTOR = `${import.meta.env.VITE_API_BASE_URL}api/MemberLoanGuarantor`
export const GET_GUARANTORS_BY_LOAN_ID = `${import.meta.env.VITE_API_BASE_URL}api/MemberLoan/GetGuarantorsByLoanId`
export const DELETE_GUARANTOR = `${import.meta.env.VITE_API_BASE_URL}api/MemberLoanGuarantor`
export const UPDATE_GUARANTOR = `${import.meta.env.VITE_API_BASE_URL}api/MemberLoanGuarantor`
