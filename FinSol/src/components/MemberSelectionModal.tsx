import { Modal } from "antd";
import MemberSearch from "./MemberSearch";
import { MemberSelectionModalProps } from "../types/Member/memberTypes";

const MemberSelectionModal: React.FC<MemberSelectionModalProps> = ({ isVisible, onClose, onMemberSelect }) => {
    return (
      <Modal
        title="Search Member"
        open={isVisible}
        onCancel={onClose}
        footer={null}
        width="80%"
        bodyStyle={{ padding: 0 }}
      >
        <MemberSearch onMemberSelect={onMemberSelect} />
      </Modal>
    );
  };
  
  export default MemberSelectionModal;