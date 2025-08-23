
import { toast } from 'sonner';

export const useFeedbackToast = () => {
  const showSuccess = (message: string) => {
    toast.success(message);
  };

  const showError = (message: string) => {
    toast.error(message);
  };

  const showInfo = (message: string) => {
    toast.info(message);
  };

  return {
    showSuccess,
    showError,
    showInfo
  };
};
