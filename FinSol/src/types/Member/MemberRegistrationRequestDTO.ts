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
