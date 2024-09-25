type MaskType = 'email' | 'phone' | 'nationalID' | 'dob';

export function maskData(data: string, type: MaskType): string {
  switch (type) {
    case 'email': {
      const [username, domain] = data.split('@');
      const maskedUsername = username[0] + '*****'; 
      return `${maskedUsername}@${domain}`;
    }
    case 'phone': {
      return data.replace(/.(?=.{4})/g, '*'); 
    }
    case 'nationalID': {
      return data.replace(/.(?=.{4})/g, '*'); 
    }
    case 'dob': {
      const date = new Date(data);
      return `**/**/${date.getFullYear()}`; 
    }
    default:
      return data;
  }
}
