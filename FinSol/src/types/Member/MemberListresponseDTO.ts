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
  }
  