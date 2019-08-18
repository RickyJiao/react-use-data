import { useEffect, useState } from 'react';

interface UseDetailHook<T> {
  detail: T;
  isFetching: boolean;
}

interface DetailResponse<T> {
  data: T;
}

interface DetailItem<T> {
  isFetching: boolean;
  detail: Readonly<T>
}

interface DetailState<T> {
  [key: string]: DetailItem<T>
}

interface UseDetailParams<T, S> {
  fetchData: (context: S) => Promise<DetailResponse<T>>;
  defaultData?: T;
  initialState?: DetailState<T>;
  enableEmptyRequest?: boolean;
}

type useDetailHook<T, S> = (name: S) => UseDetailHook<T>;

export default function useDetail<T, S>({
  fetchData,
  defaultData,
  initialState = {},
  enableEmptyRequest = true
}: UseDetailParams<T, S>): useDetailHook<T, S> {
  const DEFAULT_ITEM: DetailItem<T> = Object.freeze({
    isFetching: false,
    detail: Object.freeze(defaultData)
  });

  const DATA: DetailState<T> = initialState;

  return context => {
    const uuid: string = JSON.stringify(context);
    const item: DetailItem<T> = DATA[uuid] || DEFAULT_ITEM;
    const [isFetching, setFetching] = useState<boolean>(item.isFetching);
    const [detail, setDetail] = useState<T>(item.detail);

    useEffect(() => {
      if (!enableEmptyRequest && !context) {
        return;
      }

      if (!DATA[uuid]) {
        setFetching(true);

        fetchData(context).then((result) => {
          const { data } = result;

          DATA[uuid] = {
            isFetching: false,
            detail: data
          };

          setDetail(data);
          setFetching(false);
        });
      }
    }, [uuid]);

    return {
      detail,
      isFetching
    };
  };
};
