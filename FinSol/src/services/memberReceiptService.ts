import { UUID } from "crypto";
import { CreateMemberReceiptRequestDTO, ReceiptItemResponse } from "../types/MemberAccount/memberAccountTypes";
import axiosInstance from "../interceptors/globaInterceptor";
import { CREATE_MEMBER_RECEIPT, GET_ITEMS_TO_RECEIPT } from "../constants/apiEndpoints";
import { BaseResponseDTO } from "../types/BaseResponseDTO";


export const fetchMembersItemToReceipt=async(id:string):Promise<ReceiptItemResponse>=>{
    const response = await axiosInstance.get(GET_ITEMS_TO_RECEIPT+`/${id}`);
    return response.data;
  }

  export const createMemberReceipt = async(createReceiptRequest:CreateMemberReceiptRequestDTO):Promise<BaseResponseDTO>=>
  {
    const response= await axiosInstance.post(`${CREATE_MEMBER_RECEIPT}`,createReceiptRequest);
    return response.data;
  }
