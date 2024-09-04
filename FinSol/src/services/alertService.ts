import { notification } from 'antd';

export const alertService = () => {
  const showAlert = (title: string, message: string, type: 'success' | 'error', duration = 4.5) => {
    notification[type]({
      message: title,
      description: message,
      duration,
    });
  };

  return { showAlert };
};