import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showToast, hideToast } from "../store/slices/uiSlice";

export const useToast = () => {
  const dispatch = useDispatch();
  const { toastMessage, toastType } = useSelector((s) => s.ui);

  const toast = {
    success: (message) => dispatch(showToast({ message, type: "success" })),
    error: (message) => dispatch(showToast({ message, type: "error" })),
    info: (message) => dispatch(showToast({ message, type: "info" })),
  };

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => dispatch(hideToast()), 3500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage, dispatch]);

  return { toastMessage, toastType, toast };
};
