import { GET_ALL_MEMBERS, GET_MEMBER_BY_ID, REGISTER_MEMBER, UPDATE_MEMBER_DETAILS } from '../constants/apiEndpoints';
import { ACCESS_TOKEN } from '../constants/applicationNames';
import axiosInstance from '../interceptors/globaInterceptor';

export interface Member {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  bankAccount: string;
  bankName: string;
  workplace: string;
  worktype: string;
}

class MemberService {
  // Fetch all members
  public static async getMembers(): Promise<Member[]> {
    try {
      const response = await axiosInstance.get<Member[]>(GET_ALL_MEMBERS);
      return response.data;
    } catch (error) {
      console.error('Error fetching members:', error);
      throw error;
    }
  }

  public static async getMemberById(id: string): Promise<Member> {
    try {
      const response = await axiosInstance.get<Member>(`${GET_MEMBER_BY_ID}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching member with ID ${id}:`, error);
      throw error;
    }
  }

  // Create a new member
  public static async createMember(member: Omit<Member, 'id'>): Promise<Member> {
    try {
      const response = await axiosInstance.post<Member>(`${REGISTER_MEMBER}`, member);
      return response.data;
    } catch (error) {
      console.error('Error creating member:', error);
      throw error;
    }
  }

  // Update an existing member
  public static async updateMember(id: string, member: Partial<Member>): Promise<Member> {
    try {
      const response = await axiosInstance.put<Member>(`${UPDATE_MEMBER_DETAILS}/${id}`, member);
      return response.data;
    } catch (error) {
      console.error(`Error updating member with ID ${id}:`, error);
      throw error;
    }
  }

}


export default MemberService;
