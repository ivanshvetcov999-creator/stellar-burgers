import { useDispatch, useSelector } from '@/services/store';
import { RegisterUI } from '@ui-pages';
import { type SyntheticEvent, useState, useEffect } from 'react';

import { registerUser, selectUserError, clearError } from '@services/slices/user-slice';

export const Register = (): React.JSX.Element => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const error = useSelector(selectUserError);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();
    void dispatch(registerUser({ name: userName, email, password }));
  };

  return (
    <RegisterUI
      errorText={error?.message ?? ''}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
