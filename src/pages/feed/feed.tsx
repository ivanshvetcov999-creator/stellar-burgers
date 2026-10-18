import { useDispatch, useSelector } from '@/services/store';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { useEffect } from 'react';

import {
  getFeeds,
  selectFeedOrders,
  selectFeedLoading,
} from '@services/slices/feed-slice';

import type { AppDispatch } from '@/services/store';

export const Feed = (): React.JSX.Element => {
  const dispatch = useDispatch<AppDispatch>();
  const orders = useSelector(selectFeedOrders);
  const isLoading = useSelector(selectFeedLoading);

  const handleGetFeeds = (): void => {
    void dispatch(getFeeds());
  };

  useEffect(() => {
    handleGetFeeds();
  }, [dispatch]);

  if (isLoading) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
