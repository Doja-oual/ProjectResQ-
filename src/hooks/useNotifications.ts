import { useCallback } from 'react';
import { useAppDispatch } from '../store/hooks';
import { addNotification } from '../store/slices/uiSlice';

type NotificationType = 'success' | 'error' | 'warning' | 'info';

export function useNotifications() {
  const dispatch = useAppDispatch();

  const notify = useCallback(
    (message: string, type: NotificationType) => {
      dispatch(addNotification({ message, type }));
    },
    [dispatch]
  );

  return {
    notifySuccess: (message: string) => notify(message, 'success'),
    notifyError: (message: string) => notify(message, 'error'),
    notifyWarning: (message: string) => notify(message, 'warning'),
    notifyInfo: (message: string) => notify(message, 'info'),
  };
}
