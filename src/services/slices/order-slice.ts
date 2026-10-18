import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { orderBurgerApi, getOrdersApi } from '@utils/burger-api';

import type { TOrder } from '@utils-types';

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (ingredientIds: string[]) => {
    const data = await orderBurgerApi(ingredientIds);
    return data.order;
  }
);

export const getOrders = createAsyncThunk(
  'order/getOrders',
  async () => await getOrdersApi()
);

type OrderState = {
  order: TOrder | null;
  orders: TOrder[];
  isOrderRequest: boolean;
  isOrdersLoading: boolean;
  error: Error | null;
  orderSuccess: boolean;
};

const initialState: OrderState = {
  order: null,
  orders: [],
  isOrderRequest: false,
  isOrdersLoading: false,
  error: null,
  orderSuccess: false,
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder(state) {
      state.order = null;
      state.error = null;
      state.orderSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.isOrderRequest = true;
        state.error = null;
        state.orderSuccess = false;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isOrderRequest = false;
        state.order = action.payload;
        state.orderSuccess = true;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isOrderRequest = false;
        state.error = new Error(action.error.message ?? 'Ошибка');
        state.orderSuccess = false;
      })

      .addCase(getOrders.pending, (state) => {
        state.isOrdersLoading = true;
        state.error = null;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.isOrdersLoading = false;
        state.orders = action.payload;
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.isOrdersLoading = false;
        state.error = new Error(action.error.message ?? 'Ошибка загрузки заказов');
      });
  },
});

export const { clearOrder } = orderSlice.actions;
export const selectOrder = (state: { order: OrderState }): TOrder | null =>
  state.order.order;

export const selectOrderRequest = (state: { order: OrderState }): boolean =>
  state.order.isOrderRequest;

export const selectOrderError = (state: { order: OrderState }): Error | null =>
  state.order.error;

export const selectOrderSuccess = (state: { order: OrderState }): boolean =>
  state.order.orderSuccess;

export const selectOrders = (state: { order: OrderState }): TOrder[] =>
  state.order.orders;

export const selectOrdersLoading = (state: { order: OrderState }): boolean =>
  state.order.isOrdersLoading;

export default orderSlice.reducer;
