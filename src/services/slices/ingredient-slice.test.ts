import reducer, { fetchIngredients } from './ingredient-slice';

import type { TIngredient } from '@utils-types';

const ingredients: TIngredient[] = [
  {
    _id: 'bun-1',
    name: 'Булка',
    type: 'bun',
    proteins: 10,
    fat: 5,
    carbohydrates: 20,
    calories: 200,
    price: 100,
    image: 'bun.png',
    image_large: 'bun-large.png',
    image_mobile: 'bun-mobile.png',
  },
  {
    _id: 'main-1',
    name: 'Начинка',
    type: 'main',
    proteins: 20,
    fat: 10,
    carbohydrates: 5,
    calories: 150,
    price: 200,
    image: 'main.png',
    image_large: 'main-large.png',
    image_mobile: 'main-mobile.png',
  },
];

describe('ingredient-slice', () => {
  const initialState = {
    ingredients: [],
    isIngredientsLoading: false,
    ingredientsError: null,
  };

  test('возвращает начальное состояние', () => {
    expect(reducer(undefined, { type: 'UNKNOWN_ACTION' })).toEqual(initialState);
  });

  test('обрабатывает начало загрузки ингредиентов', () => {
    const state = reducer(initialState, fetchIngredients.pending('request-id'));

    expect(state.isIngredientsLoading).toBe(true);
    expect(state.ingredientsError).toBeNull();
  });

  test('сохраняет ингредиенты после успешной загрузки', () => {
    const state = reducer(
      initialState,
      fetchIngredients.fulfilled(ingredients, 'request-id')
    );

    expect(state.ingredients).toEqual(ingredients);
    expect(state.isIngredientsLoading).toBe(false);
    expect(state.ingredientsError).toBeNull();
  });

  test('сохраняет ошибку при неудачной загрузке', () => {
    const state = reducer(
      initialState,
      fetchIngredients.rejected(new Error('Ошибка загрузки'), 'request-id')
    );

    expect(state.ingredients).toEqual([]);
    expect(state.isIngredientsLoading).toBe(false);
    expect(state.ingredientsError).toBe('Ошибка загрузки');
  });

  test('сбрасывает предыдущую ошибку при начале новой загрузки', () => {
    const errorState = {
      ...initialState,
      ingredientsError: 'Старая ошибка',
    };

    const state = reducer(errorState, fetchIngredients.pending('request-id'));

    expect(state.isIngredientsLoading).toBe(true);
    expect(state.ingredientsError).toBeNull();
  });
});
