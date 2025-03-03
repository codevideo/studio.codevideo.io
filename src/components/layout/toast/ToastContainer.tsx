import * as React from 'react';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import * as Toast from '@radix-ui/react-toast';
import { removeToast } from '../../../store/toastSlice';
import "../../../styles/toast.css";

export function ToastContainer() {
  const { toasts } = useAppSelector(state => state.toast);
  const dispatch = useAppDispatch();
  
  // Set up the Toast provider only once
  return (
    <Toast.Provider swipeDirection="right">
      {toasts.map((toast) => (
        <Toast.Root 
          key={toast.id} 
          className="ToastRoot" 
          open={true}
          onOpenChange={(open) => {
            if (!open) dispatch(removeToast(toast.id));
          }}
          duration={3000} // Auto dismiss after 3 seconds
        >
          <Toast.Title className="ToastTitle">{toast.message}</Toast.Title>
        </Toast.Root>
      ))}
      <Toast.Viewport className="ToastViewport" />
    </Toast.Provider>
  );
}