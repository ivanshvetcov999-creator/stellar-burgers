import { combineSlices } from '@reduxjs/toolkit';

import constructorSlice from './slices/constructor-slice';
import feedSlice from './slices/feed-slice';
import ingredientsSlice from './slices/ingredient-slice';
import orderSlice from './slices/order-slice';
import userReducer from './slices/user-slice';

export const rootReducer = combineSlices({
  ingredients: ingredientsSlice,
  user: userReducer,
  order: orderSlice,
  constructorBurger: constructorSlice,
  feed: feedSlice,
});
