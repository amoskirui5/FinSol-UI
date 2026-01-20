import { Dayjs } from "dayjs";

export interface FinancialYear {
    financialYearId: string;
    year: string;
    startDate: string;
    endDate: string;
    isActive: boolean;
}

export interface FinancialYearFormProps {
    initialValues?: FinancialYear | null;
    onSubmit: (values: FinancialYearFormInput) => void;
    onCancel: () => void;
    loading?: boolean;
}

export interface FinancialYearFormInput {
    year: string;
    startDate: Dayjs; // Using dayjs for date handling
    endDate: Dayjs;   // Using dayjs for date handling
    isActive: boolean;
    financialYearId?: string; // Optional for new financial years
}

// For sending to API - Create
export interface FinancialYearApiPayload {
  year: string;
  startDate: string; // ISO date string "YYYY-MM-DD"
  endDate: string;
  isActive: boolean;
}

// For sending to API - Update
export interface UpdateFinancialYearApiPayload {
  financialYearId: string;
  startDate: string; // ISO date string "YYYY-MM-DD"
  endDate: string;
  isActive: boolean;
}

 export interface FinancialYearListResponse {
    data: FinancialYear[];
    success: boolean;
    message: string;
    errors: string[];
}