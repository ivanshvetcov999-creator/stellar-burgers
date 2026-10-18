import { useDispatch, useSelector } from '@/services/store';
import { ResetPasswordUI } from '@ui-pages';
import { useState, useEffect, type SyntheticEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  resetPasswordUser,
  selectIsSuccessResetPassword,
  selectUserError,
  clearError,
  clearResetPasswordSuccess,
} from '@services/slices/user-slice';

export const ResetPassword = (): React.JSX.Element => {
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isSuccess = useSelector(selectIsSuccessResetPassword);
  const error = useSelector(selectUserError);

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();
    void dispatch(resetPasswordUser({ password, token }));
  };

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (!localStorage.getItem('resetPassword')) {
      void navigate('/forgot-password', { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    if (isSuccess) {
      localStorage.removeItem('resetPassword');
      void navigate('/login', { replace: true });
      dispatch(clearResetPasswordSuccess());
    }
  }, [isSuccess, navigate, dispatch]);

  return (
    <ResetPasswordUI
      errorText={error?.message}
      password={password}
      token={token}
      setPassword={setPassword}
      setToken={setToken}
      handleSubmit={handleSubmit}
    />
  );
};
