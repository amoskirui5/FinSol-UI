import { CREATE_MEMBER_PAYMENT, GET_ITEMS_TO_PAY } from "../constants/apiEndpoints";
import axiosInstance from "../interceptors/globaInterceptor";
import { BaseResponseDTO } from "../types/BaseResponseDTO";
import { CreateMemberPaymentRequestDTO, paymentItemsResponse } from "../types/MemberAccount/memberAccountTypes";


export const fetchMembersItemToPay = async (id: string): Promise<paymentItemsResponse> => {
    const response = await axiosInstance.get(GET_ITEMS_TO_PAY + `/${id}`);
    return response.data;
}

export const createMemberPayment = async (createReceiptRequest: CreateMemberPaymentRequestDTO): Promise<BaseResponseDTO> => {
    const response = await axiosInstance.post(`${CREATE_MEMBER_PAYMENT}`, createReceiptRequest);
    return response.data;
}