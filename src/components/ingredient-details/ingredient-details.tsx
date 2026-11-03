import { useSelector } from '@/services/store';
import { Preloader, IngredientDetailsUI } from '@ui';
import { useParams } from 'react-router-dom';

import type { RootState } from '@/services/store';

export const IngredientDetails = (): React.JSX.Element => {
  const { id } = useParams();

  const ingredientData = useSelector((state: RootState) =>
    state.ingredients.ingredients.find((item) => item._id === id)
  );

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
