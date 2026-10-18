import { selectUserName } from '@/services/slices/user-slice';
import { useSelector } from '@/services/store';
import { AppHeaderUI } from '@ui';

export const AppHeader = (): React.JSX.Element => {
  const userName = useSelector(selectUserName);

  return <AppHeaderUI userName={userName} />;
};
