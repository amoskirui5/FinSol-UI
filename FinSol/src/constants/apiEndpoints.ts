
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

//member loan - Updated to new LoanManagement endpoints
export const CREATE_MEMBER_LOAN_APPLICATION = `${import.meta.env.VITE_API_BASE_URL}api/LoanManagement/applications`
export const FETCH_MEMBER_LOAN_APPLICATION = `${import.meta.env.VITE_API_BASE_URL}api/LoanManagement/applications`
export const FETCH_LOAN_ELIGIBILITY = `${import.meta.env.VITE_API_BASE_URL}api/LoanManagement/eligibility`
export const FETCH_LOAN_APPLICATION_BY_ID = `${import.meta.env.VITE_API_BASE_URL}api/LoanManagement/applications`
export const CREATE_MEMBER_LOAN_APPROVAL = `${import.meta.env.VITE_API_BASE_URL}api/LoanManagement/approvals`
export const CREATE_MEMBER_LOAN_DISBURSEMENT1 = `${import.meta.env.VITE_API_BASE_URL}api/MemberPayment/add-payment`
export const FETCH_LOAN_APPROVAL_BY_ID = `${import.meta.env.VITE_API_BASE_URL}api/LoanManagement/approvals`
export const CREATE_MEMBER_LOAN_STAGE = `${import.meta.env.VITE_API_BASE_URL}api/LoanManagement/disbursements/stage`
export const CREATE_MEMBER_LOAN_DISBURSEMENT = `${import.meta.env.VITE_API_BASE_URL}api/LoanManagement/disbursements`

// Additional new loan management endpoints
export const GET_MEMBER_LOAN_BALANCE = `${import.meta.env.VITE_API_BASE_URL}api/LoanManagement/member`
export const GET_MEMBER_LOAN_BALANCE_BY_NUMBER = `${import.meta.env.VITE_API_BASE_URL}api/LoanManagement/member/balance/by-number`
export const GET_LOAN_BALANCE_BY_ID = `${import.meta.env.VITE_API_BASE_URL}api/LoanManagement/balance/by-loan`
export const GET_MEMBER_LOAN_BALANCE_AS_AT = `${import.meta.env.VITE_API_BASE_URL}api/LoanManagement/member`

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

//Settings
export const GET_FINANCIAL_YEARS = `${import.meta.env.VITE_API_BASE_URL}api/FinancialYear`;
export const CREATE_FINANCIAL_YEAR = `${import.meta.env.VITE_API_BASE_URL}api/FinancialYear/create`;
export const UPDATE_FINANCIAL_YEAR = `${import.meta.env.VITE_API_BASE_URL}api/FinancialYear/update`;
export const DELETE_FINANCIAL_YEAR = `${import.meta.env.VITE_API_BASE_URL}api/FinancialYear/delete`;

//Organizations
export const CREATE_ORGANIZATION = `${import.meta.env.VITE_API_BASE_URL}api/Organizations`;
export const GET_ORGANIZATIONS = `${import.meta.env.VITE_API_BASE_URL}api/Organizations`;
export const GET_ORGANIZATION_BY_ID = `${import.meta.env.VITE_API_BASE_URL}api/Organizations`;
export const UPDATE_ORGANIZATION = `${import.meta.env.VITE_API_BASE_URL}api/Organizations`;
export const DELETE_ORGANIZATION = `${import.meta.env.VITE_API_BASE_URL}api/Organizations`;
export const REACTIVATE_ORGANIZATION = `${import.meta.env.VITE_API_BASE_URL}api/Organizations`;

// Administration - User Management
export const GET_SYSTEM_USERS = `${import.meta.env.VITE_API_BASE_URL}api/Administration/users`;
export const CREATE_SYSTEM_USER = `${import.meta.env.VITE_API_BASE_URL}api/Administration/users`;
export const UPDATE_SYSTEM_USER = `${import.meta.env.VITE_API_BASE_URL}api/Administration/users`;
export const DELETE_SYSTEM_USER = `${import.meta.env.VITE_API_BASE_URL}api/Administration/users`;
export const GET_USER_BY_ID = `${import.meta.env.VITE_API_BASE_URL}api/Administration/users`;
export const RESET_USER_PASSWORD = `${import.meta.env.VITE_API_BASE_URL}api/Administration/users/reset-password`;
export const DEACTIVATE_USER = `${import.meta.env.VITE_API_BASE_URL}api/Administration/users/deactivate`;
export const ACTIVATE_USER = `${import.meta.env.VITE_API_BASE_URL}api/Administration/users/activate`;

// Administration - Roles & Permissions
export const GET_USER_ROLES = `${import.meta.env.VITE_API_BASE_URL}api/Administration/roles`;
export const CREATE_USER_ROLE = `${import.meta.env.VITE_API_BASE_URL}api/Administration/roles`;
export const UPDATE_USER_ROLE = `${import.meta.env.VITE_API_BASE_URL}api/Administration/roles`;
export const DELETE_USER_ROLE = `${import.meta.env.VITE_API_BASE_URL}api/Administration/roles`;
export const GET_PERMISSIONS = `${import.meta.env.VITE_API_BASE_URL}api/Administration/permissions`;

// Administration - Access Logs
export const GET_ACCESS_LOGS = `${import.meta.env.VITE_API_BASE_URL}api/Administration/access-logs`;
export const EXPORT_ACCESS_LOGS = `${import.meta.env.VITE_API_BASE_URL}api/Administration/access-logs/export`;

// Settings - General Settings
export const GET_GENERAL_SETTINGS = `${import.meta.env.VITE_API_BASE_URL}api/Settings/general`;
export const UPDATE_GENERAL_SETTINGS = `${import.meta.env.VITE_API_BASE_URL}api/Settings/general`;
export const GET_SYSTEM_CONFIGURATION = `${import.meta.env.VITE_API_BASE_URL}api/Settings/system-config`;
export const UPDATE_SYSTEM_CONFIGURATION = `${import.meta.env.VITE_API_BASE_URL}api/Settings/system-config`;

// Settings - Email Settings
export const GET_EMAIL_SETTINGS = `${import.meta.env.VITE_API_BASE_URL}api/Settings/email`;
export const UPDATE_EMAIL_SETTINGS = `${import.meta.env.VITE_API_BASE_URL}api/Settings/email`;
export const TEST_EMAIL_SETTINGS = `${import.meta.env.VITE_API_BASE_URL}api/Settings/email/test`;
export const GET_EMAIL_TEMPLATES = `${import.meta.env.VITE_API_BASE_URL}api/Settings/email/templates`;
export const UPDATE_EMAIL_TEMPLATE = `${import.meta.env.VITE_API_BASE_URL}api/Settings/email/templates`;

// Settings - Backup & Restore
export const GET_BACKUPS = `${import.meta.env.VITE_API_BASE_URL}api/Settings/backups`;
export const CREATE_BACKUP = `${import.meta.env.VITE_API_BASE_URL}api/Settings/backups`;
export const DELETE_BACKUP = `${import.meta.env.VITE_API_BASE_URL}api/Settings/backups`;
export const DOWNLOAD_BACKUP = `${import.meta.env.VITE_API_BASE_URL}api/Settings/backups/download`;
export const RESTORE_BACKUP = `${import.meta.env.VITE_API_BASE_URL}api/Settings/backups/restore`;

// Settings - Password Policy
export const GET_PASSWORD_POLICY = `${import.meta.env.VITE_API_BASE_URL}api/Settings/password-policy`;
export const UPDATE_PASSWORD_POLICY = `${import.meta.env.VITE_API_BASE_URL}api/Settings/password-policy`;

// Settings - Two-Factor Authentication
export const GET_TWO_FACTOR_SETTINGS = `${import.meta.env.VITE_API_BASE_URL}api/Settings/two-factor`;
export const UPDATE_TWO_FACTOR_SETTINGS = `${import.meta.env.VITE_API_BASE_URL}api/Settings/two-factor`;
export const ENABLE_TWO_FACTOR = `${import.meta.env.VITE_API_BASE_URL}api/Settings/two-factor/enable`;
export const VERIFY_TWO_FACTOR = `${import.meta.env.VITE_API_BASE_URL}api/Settings/two-factor/verify`;
export const GENERATE_BACKUP_CODES = `${import.meta.env.VITE_API_BASE_URL}api/Settings/two-factor/backup-codes`;

// Settings - Audit Trail
export const GET_AUDIT_TRAIL = `${import.meta.env.VITE_API_BASE_URL}api/Settings/audit-trail`;
export const EXPORT_AUDIT_TRAIL = `${import.meta.env.VITE_API_BASE_URL}api/Settings/audit-trail/export`;

// Enhanced Financial Reporting
export const FETCH_PROFIT_LOSS = `${import.meta.env.VITE_API_BASE_URL}api/FinancialReports/profit-loss`;
export const FETCH_CASH_FLOW = `${import.meta.env.VITE_API_BASE_URL}api/FinancialReports/cash-flow`;
export const EXPORT_PROFIT_LOSS = `${import.meta.env.VITE_API_BASE_URL}api/FinancialReports/profit-loss/export`;
export const EXPORT_CASH_FLOW = `${import.meta.env.VITE_API_BASE_URL}api/FinancialReports/cash-flow/export`;
export const EXPORT_TRIAL_BALANCE = `${import.meta.env.VITE_API_BASE_URL}api/FinancialReports/trial-balance/export`;
export const EXPORT_BALANCE_SHEET = `${import.meta.env.VITE_API_BASE_URL}api/FinancialReports/balance-sheet/export`;

// Member Services - Deposits
export const GET_MEMBER_DEPOSITS = `${import.meta.env.VITE_API_BASE_URL}api/MemberServices/deposits`;
export const CREATE_MEMBER_DEPOSIT = `${import.meta.env.VITE_API_BASE_URL}api/MemberServices/deposits`;
export const UPDATE_MEMBER_DEPOSIT = `${import.meta.env.VITE_API_BASE_URL}api/MemberServices/deposits`;
export const DELETE_MEMBER_DEPOSIT = `${import.meta.env.VITE_API_BASE_URL}api/MemberServices/deposits`;
export const EXPORT_MEMBER_DEPOSITS = `${import.meta.env.VITE_API_BASE_URL}api/MemberServices/deposits/export`;

// Member Services - Share Capital
export const GET_MEMBER_SHARE_CAPITAL = `${import.meta.env.VITE_API_BASE_URL}api/MemberServices/share-capital`;
export const CREATE_SHARE_CAPITAL = `${import.meta.env.VITE_API_BASE_URL}api/MemberServices/share-capital`;
export const UPDATE_SHARE_CAPITAL = `${import.meta.env.VITE_API_BASE_URL}api/MemberServices/share-capital`;
export const DELETE_SHARE_CAPITAL = `${import.meta.env.VITE_API_BASE_URL}api/MemberServices/share-capital`;
export const TRANSFER_SHARES = `${import.meta.env.VITE_API_BASE_URL}api/MemberServices/share-capital/transfer`;
export const REDEEM_SHARES = `${import.meta.env.VITE_API_BASE_URL}api/MemberServices/share-capital/redeem`;

// Enhanced Loan Management
export const GET_LOAN_APPLICATIONS = `${import.meta.env.VITE_API_BASE_URL}api/LoanManagement/applications`;
export const GET_LOAN_APPLICATION_BY_ID = `${import.meta.env.VITE_API_BASE_URL}api/LoanManagement/applications`;
export const UPDATE_LOAN_APPLICATION = `${import.meta.env.VITE_API_BASE_URL}api/LoanManagement/applications`;
export const DELETE_LOAN_APPLICATION = `${import.meta.env.VITE_API_BASE_URL}api/LoanManagement/applications`;

// Loan Approvals
export const GET_LOAN_APPROVALS = `${import.meta.env.VITE_API_BASE_URL}api/LoanManagement/approvals`;
export const APPROVE_LOAN = `${import.meta.env.VITE_API_BASE_URL}api/LoanManagement/approvals`;
export const REJECT_LOAN = `${import.meta.env.VITE_API_BASE_URL}api/LoanManagement/approvals/reject`;

// Loan Disbursements
export const GET_LOAN_DISBURSEMENTS = `${import.meta.env.VITE_API_BASE_URL}api/LoanManagement/disbursements`;
export const DISBURSE_LOAN = `${import.meta.env.VITE_API_BASE_URL}api/LoanManagement/disbursements`;
export const CANCEL_DISBURSEMENT = `${import.meta.env.VITE_API_BASE_URL}api/LoanManagement/disbursements/cancel`;
