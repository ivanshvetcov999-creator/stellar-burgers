import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getFeedsApi, getOrderByNumberApi } from '@utils/burger-api';

import type { TFeedState, TOrder } from '@utils-types';

type FeedState = TFeedState & {
  selectedOrder: TOrder | null;
  isOrderLoading: boolean;
};

const initialState: FeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null,
  selectedOrder: null,
  isOrderLoading: false,
};

export const getFeeds = createAsyncThunk('feed/fetchAll', async () => {
  return await getFeedsApi();
});

export const fetchOrderByNumber = createAsyncThunk(
  'feed/fetchOrderByNumber',
  async (number: number) => {
    return await getOrderByNumberApi(number);
  }
);

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    clearSelectedOrder(state) {
      state.selectedOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFeeds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getFeeds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
        state.error = null;
      })
      .addCase(getFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Ошибка загрузки ленты';
      })
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.isOrderLoading = true;
        state.error = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.isOrderLoading = false;
        state.selectedOrder = action.payload.orders[0] ?? null;
        state.error = null;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.isOrderLoading = false;
        state.error = action.error.message ?? 'Ошибка загрузки заказа';
      });
  },
});

export const { clearSelectedOrder } = feedSlice.actions;

export const selectFeedOrders = (state: { feed: FeedState }): TOrder[] =>
  state.feed.orders;

export const selectFeedTotal = (state: { feed: FeedState }): number => state.feed.total;

export const selectFeedTotalToday = (state: { feed: FeedState }): number =>
  state.feed.totalToday;

export const selectFeedLoading = (state: { feed: FeedState }): boolean =>
  state.feed.isLoading;

export const selectFeedError = (state: { feed: FeedState }): string | null =>
  state.feed.error;

export const selectSelectedOrder = (state: { feed: FeedState }): TOrder | null =>
  state.feed.selectedOrder;

export const selectOrderByNumberLoading = (state: { feed: FeedState }): boolean =>
  state.feed.isOrderLoading;

export default feedSlice.reducer;
