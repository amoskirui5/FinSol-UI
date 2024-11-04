import { EXPORT_MEMBER_STATEMENT, FETCH_MEMBER_GENERAL_STATEMENT } from "../constants/apiEndpoints";
import axiosInstance from "../interceptors/globaInterceptor";
import { MemberStatementData } from "../types/Member/memberTypes";

export const fetchMemberStatementByMemberId=async(id:string):Promise<MemberStatementData>=>{
    const response = await axiosInstance.get(FETCH_MEMBER_GENERAL_STATEMENT+`=${id}`);
    return response.data;
}

export const exportMemberStatementByMemberId = async (id: string): Promise<void> => {
  try {
      const response = await axiosInstance.get(EXPORT_MEMBER_STATEMENT + `/${id}`, {
          responseType: 'blob', 
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));

      // Create a temporary link element
      const link = document.createElement('a');
      link.href = url;

      // Set the download attribute to suggest a filename
      link.setAttribute('download', `member_statement_${id}.pdf`); // Specify the filename

      // Append to the body (not visible)
      document.body.appendChild(link);
      
      // Programmatically click the link to trigger the download dialog
      link.click();

      // Clean up by removing the link and revoking the object URL
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url); // Free up memory
  } catch (error) {
      console.error('Download failed', error);
      // Optionally, handle errors (e.g., show a notification)
  }
};
