import { createSlice, nanoid } from '@reduxjs/toolkit';

import type { RootState } from '../store';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { TIngredient, TConstructorIngredient } from '@utils-types';

type ConstructorState = {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
};

const initialState: ConstructorState = {
  bun: null,
  ingredients: [],
};

const constructorSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.bun = action.payload;
        } else {
          state.ingredients.push(action.payload);
        }
      },
      prepare(ingredient: TIngredient) {
        return { payload: { ...ingredient, id: nanoid() } };
      },
    },
    removeIngredient(state, action: PayloadAction<string>) {
      state.ingredients = state.ingredients.filter((item) => item.id !== action.payload);
    },
    removeIngredientAll(state) {
      state.bun = null;
      state.ingredients = [];
    },
    moveIngredient(
      state,
      action: PayloadAction<{ id: string; direction: 'up' | 'down' }>
    ) {
      const { id, direction } = action.payload;
      const index = state.ingredients.findIndex((item) => item.id === id);
      if (index === -1) return;

      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= state.ingredients.length) return;

      [state.ingredients[index], state.ingredients[targetIndex]] = [
        state.ingredients[targetIndex],
        state.ingredients[index],
      ];
    },
  },
});

export const { addIngredient, removeIngredient, removeIngredientAll, moveIngredient } =
  constructorSlice.actions;

export const selectConstructor = (state: RootState): ConstructorState =>
  state.constructorBurger;

export default constructorSlice.reducer;
