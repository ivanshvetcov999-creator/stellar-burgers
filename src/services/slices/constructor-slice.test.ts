import reducer, {
  addIngredient,
  moveIngredient,
  removeIngredient,
  removeIngredientAll,
} from './constructor-slice';

import type { TIngredient } from '@utils-types';

const bun: TIngredient = {
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
};

const main: TIngredient = {
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
};

const sauce: TIngredient = {
  _id: 'sauce-1',
  name: 'Соус',
  type: 'sauce',
  proteins: 5,
  fat: 5,
  carbohydrates: 10,
  calories: 50,
  price: 50,
  image: 'sauce.png',
  image_large: 'sauce-large.png',
  image_mobile: 'sauce-mobile.png',
};

describe('constructor-slice', () => {
  const initialState = {
    bun: null,
    ingredients: [],
  };

  test('возвращает начальное состояние', () => {
    expect(reducer(undefined, { type: 'UNKNOWN_ACTION' })).toEqual(initialState);
  });

  test('добавляет булку', () => {
    const state = reducer(initialState, addIngredient(bun));

    expect(state.bun).toMatchObject(bun);
    expect(state.bun?.id).toEqual(expect.any(String));
    expect(state.ingredients).toHaveLength(0);
  });

  test('заменяет предыдущую булку новой', () => {
    const stateWithBun = reducer(initialState, addIngredient(bun));
    const state = reducer(
      stateWithBun,
      addIngredient({
        ...bun,
        _id: 'bun-2',
        name: 'Другая булка',
      })
    );

    expect(state.bun?._id).toBe('bun-2');
    expect(state.bun?.name).toBe('Другая булка');
  });

  test('добавляет начинку в список ингредиентов', () => {
    const state = reducer(initialState, addIngredient(main));

    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]).toMatchObject(main);
    expect(state.ingredients[0].id).toEqual(expect.any(String));
    expect(state.bun).toBeNull();
  });

  test('удаляет ингредиент по id', () => {
    const stateWithIngredients = reducer(
      reducer(initialState, addIngredient(main)),
      addIngredient(sauce)
    );

    const id = stateWithIngredients.ingredients[0].id;
    const state = reducer(stateWithIngredients, removeIngredient(id));

    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]._id).toBe('sauce-1');
  });

  test('очищает конструктор', () => {
    const stateWithIngredients = reducer(
      reducer(initialState, addIngredient(bun)),
      addIngredient(main)
    );

    const state = reducer(stateWithIngredients, removeIngredientAll());

    expect(state).toEqual(initialState);
  });

  test('перемещает ингредиент вверх', () => {
    let state = reducer(initialState, addIngredient(main));
    state = reducer(state, addIngredient(sauce));

    const secondId = state.ingredients[1].id;
    state = reducer(
      state,
      moveIngredient({
        id: secondId,
        direction: 'up',
      })
    );

    expect(state.ingredients.map((item) => item._id)).toEqual(['sauce-1', 'main-1']);
  });

  test('перемещает ингредиент вниз', () => {
    let state = reducer(initialState, addIngredient(main));
    state = reducer(state, addIngredient(sauce));

    const firstId = state.ingredients[0].id;
    state = reducer(
      state,
      moveIngredient({
        id: firstId,
        direction: 'down',
      })
    );

    expect(state.ingredients.map((item) => item._id)).toEqual(['sauce-1', 'main-1']);
  });

  test('не перемещает первый ингредиент выше начала списка', () => {
    const stateWithIngredient = reducer(initialState, addIngredient(main));
    const id = stateWithIngredient.ingredients[0].id;

    const state = reducer(
      stateWithIngredient,
      moveIngredient({
        id,
        direction: 'up',
      })
    );

    expect(state.ingredients.map((item) => item._id)).toEqual(['main-1']);
  });

  test('не перемещает последний ингредиент ниже конца списка', () => {
    const stateWithIngredient = reducer(initialState, addIngredient(main));
    const id = stateWithIngredient.ingredients[0].id;

    const state = reducer(
      stateWithIngredient,
      moveIngredient({
        id,
        direction: 'down',
      })
    );

    expect(state.ingredients.map((item) => item._id)).toEqual(['main-1']);
  });

  test('не изменяет список при перемещении несуществующего ингредиента', () => {
    const stateWithIngredient = reducer(initialState, addIngredient(main));

    const state = reducer(
      stateWithIngredient,
      moveIngredient({
        id: 'unknown-id',
        direction: 'up',
      })
    );

    expect(state.ingredients).toEqual(stateWithIngredient.ingredients);
  });
});
