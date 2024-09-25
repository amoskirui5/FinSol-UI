import { Gender } from "../../enums/enums";

export interface CreateMemberRegistrationRequestDTO {
    firstName: string;
    otherName: string;
    memberNumber: string;
    email: string;
    phoneNumber: string;
    bankAccount: string;
    bankName: string;
    workPlace?: string;
    workType?: string;
    dateOfBirth?: Date;
    dateJoined: Date;
    nationalID?: string;
    passportNumber?: string;
    taxPIN?: string;
}

export interface MemberFormProps {
    isUpdate?: boolean;
}

export interface MemberListDto {
    memberId: string; 
    memberName: string;
    memberNumber: string;
    email: string;
    phoneNumber: string;
    bankAccount: string;
    bankName: string;
    workPlace?: string; 
    workType?: string;
    dateOfBirth?: Date | null; 
    nationalID?: string;
    passportNumber?: string;
    taxPIN?: string;
    dateJoined: Date; 
    gender:Gender
  }
  
  export interface PaginatedMemberListResponse {
    data: {
        items: MemberListDto[]; 
        totalRecords: number;
        pageNumber: number;
        pageSize: number;
        totalPages: number;
    };
    success: boolean;
    message: string;
    errors: string[];
}

export interface MemberDetailsResponse {
    data: MemberListDto;
    success: boolean;
    message: string;
    errors: string[];
  }