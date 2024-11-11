import { UUID } from "crypto";
import { DELETE_LOAN_TYPE, EDIT_LOAN_TYPE, FETCH_LOAN_TYPE_BY_ID, FETCH_LOAN_TYPES, REGISTER_LOAN_TYPE } from "../constants/apiEndpoints";
import axiosInstance from "../interceptors/globaInterceptor";
import { LoanTypeCreationRequestDTO, LoanTypeDetailsResponse, PaginatedLoanTypeResponse } from "../types/loanTypeTypes";
import { PaginationOptions } from "../types/paginationTypes";

export const createLoanType = async (params: LoanTypeCreationRequestDTO): Promise<void> => {
    await axiosInstance.post(REGISTER_LOAN_TYPE, params);

}

export const fetchLoanTypes = async (options: PaginationOptions): Promise<PaginatedLoanTypeResponse> => {
    const response = await axiosInstance.get(FETCH_LOAN_TYPES, {
        params: {
            pageNumber: options.pageNumber,
            pageSize: options.pageSize,
            searchTerm: options.searchTerm,
            searchField: options.searchField,
        },
    });
    return response.data;
};

export const fetchLoanTypeById = async (id: string): Promise<LoanTypeDetailsResponse> => {
    const response = await axiosInstance.get(FETCH_LOAN_TYPE_BY_ID + `/${id}`);

    return response.data;
}

export const editLoanType = async (id: string, params: LoanTypeCreationRequestDTO): Promise<void> => {
    await axiosInstance.put(`${EDIT_LOAN_TYPE}/${id}`, params);

}

export const deleteLoanType = async (id: string): Promise<void> => {
    await axiosInstance.put(`${DELETE_LOAN_TYPE}/${id}`);

}