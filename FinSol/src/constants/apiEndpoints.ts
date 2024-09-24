
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

//Loans
export const REGISTER_LOAN_TYPE=`${import.meta.env.VITE_API_BASE_URL}api/loantypes/createLoanType`
export const FETCH_LOAN_TYPES=`${import.meta.env.VITE_API_BASE_URL}api/loantypes`
export const FETCH_LOAN_TYPE_BY_ID=`${import.meta.env.VITE_API_BASE_URL}api/loantypes`
export const EDIT_LOAN_TYPE=`${import.meta.env.VITE_API_BASE_URL}api/loantypes/update`
export const DELETE_LOAN_TYPE=`${import.meta.env.VITE_API_BASE_URL}api/loantypes/delete`

//Member
export const REGISTER_MEMBER = `${import.meta.env.VITE_API_BASE_URL}api/members/REGISTER`;
export const GET_MEMBER_BY_ID = `${import.meta.env.VITE_API_BASE_URL}api/members`;
export const GET_ALL_MEMBERS= `${import.meta.env.VITE_API_BASE_URL}api/members/getallmembers`;
export const GET_ALL_MEMBERS_BY_JOIN_DATE= `${import.meta.env.VITE_API_BASE_URL}api/members/by-join-date`;
export const UPDATE_MEMBER_DETAILS= `${import.meta.env.VITE_API_BASE_URL}api/members/UPDATE`;
