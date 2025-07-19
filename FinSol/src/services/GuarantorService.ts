import { ADD_GUARANTOR, DELETE_GUARANTOR, UPDATE_GUARANTOR } from "../constants/apiEndpoints";
import axiosInstance from "../interceptors/globaInterceptor";
import { BaseResponseDTO } from "../types/BaseResponseDTO";
import { AddGuarantorRequest, UpdateGuarantorRequest } from "../types/MemberLoan/memberLoanTypes";

export const AddGuarantor = async (guarantor: AddGuarantorRequest): Promise<BaseResponseDTO> => {
   const response = await axiosInstance.post(ADD_GUARANTOR , guarantor);
    return response.data;
}

export const UpdateGuarantor = async (loanGuarantorId:string,guarantor: UpdateGuarantorRequest): Promise<BaseResponseDTO> => {
   const response = await axiosInstance.put(`${UPDATE_GUARANTOR}/${loanGuarantorId}` , guarantor);
    return response.data;
}

export const DeleteGuarantor = async (loanId: string, guarantorId: string): Promise<BaseResponseDTO> => {
   const response = await axiosInstance.delete(`${DELETE_GUARANTOR}/${loanId}/${guarantorId}`);
    return response.data;
}   