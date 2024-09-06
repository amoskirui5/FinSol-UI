import { UUID } from "crypto";

export interface AccountClass {
    id: UUID;
    className: string;
    description: string;
  }

  export interface RegisterAccountClassDTO {
    className: string,
    description: string,
  
  }

  export interface AccountClassResponse {
    data: AccountClass[];
    success: boolean;
    message: string;
    errors: string[];
  }
  