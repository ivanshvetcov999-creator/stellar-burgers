import { useDispatch, useSelector } from '@/services/store';
import { BurgerConstructorUI } from '@ui';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  selectConstructor,
  removeIngredientAll,
} from '@services/slices/constructor-slice';
import {
  clearOrder,
  selectOrderRequest,
  selectOrder,
  createOrder,
} from '@services/slices/order-slice';
import { selectUser } from '@services/slices/user-slice';

import type { TConstructorIngredient, TConstructorState, TOrder } from '@utils-types';

export const BurgerConstructor = (): React.JSX.Element | null => {
  const constructorItems: TConstructorState = useSelector(selectConstructor);
  const orderRequest = useSelector(selectOrderRequest);
  const orderModalData: TOrder | null = useSelector(selectOrder);
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const navigate = useNavigate();
  const onOrderClick = (): void => {
    if (!constructorItems.bun || orderRequest) return;
    if (!user) {
      void navigate('/login');
      return;
    }

    const ids = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((item) => item._id),
      constructorItems.bun._id,
    ];

    dispatch(createOrder(ids))
      .unwrap()
      .then(() => {
        dispatch(removeIngredientAll());
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const closeOrderModal = (): void => {
    dispatch(clearOrder());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients?.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
