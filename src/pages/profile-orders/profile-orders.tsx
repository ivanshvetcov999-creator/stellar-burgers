import { useDispatch, useSelector } from '@/services/store';
import { ProfileOrdersUI } from '@ui-pages';
import { useEffect } from 'react';

import { selectOrders, getOrders } from '@services/slices/order-slice';

import type { TOrder } from '@utils-types';

export const ProfileOrders = (): React.JSX.Element => {
  const dispatch = useDispatch();

  useEffect(() => {
    void dispatch(getOrders());
  }, [dispatch]);

  const orders: TOrder[] = useSelector(selectOrders);

  return <ProfileOrdersUI orders={orders} />;
};
