import { useState } from "react";
import { MemberSelectFieldProps } from "../types/Member/memberTypes";
import { Form, Select } from "antd";
import MemberSelectionModal from "./MemberSelectionModal";

const MemberSelectField: React.FC<MemberSelectFieldProps> = ({ selectedMember, onMemberSelect }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
  
    const handleOpenModal = () => {
      setIsModalVisible(true);
    };
  
    const handleCloseModal = () => {
      setIsModalVisible(false);
    };
  
    return (
      <>
        <Form.Item
          label="Member ID"
          name="memberId"
          rules={[{ required: true, message: 'Please select a member' }]}
          style={{ flex: 1 }}
        >
          <Select
            placeholder="Select a member"
            value={selectedMember ? selectedMember.memberId : undefined}
            onClick={handleOpenModal}
            allowClear
            dropdownRender={() => <></>} 
            popupMatchSelectWidth={false}
            style={{ width: '100%' }}
            loading={!selectedMember}
          >
            {selectedMember && (
              <Select.Option key={selectedMember.memberId} value={selectedMember.memberId}>
                {`${selectedMember.firstName} ${selectedMember.otherName}`}
              </Select.Option>
            )}
          </Select>
        </Form.Item>
  
        <MemberSelectionModal
          isVisible={isModalVisible}
          onClose={handleCloseModal}
          onMemberSelect={(member) => {
            onMemberSelect(member);
            handleCloseModal();
          }}
        />
      </>
    );
  };
  
  export default MemberSelectField;