import { useCallback, useMemo, useState, useEffect } from 'react';

interface UseListHook<T> {
  isFetching: boolean;
  data: T[];
  meta: ListMeta;
  hasMore: boolean;
  loadMore: () => void;
}

interface ListItem<T> {
  isFetching: boolean;
  meta: ListMeta;
  data: T[]
}

interface ListState<T> {
  [key: string]: ListItem<T>
}

export interface ListMeta {
  page: number;
  pageSize: number;
  totalPage: number;
}

export interface ListResponse<T> {
  meta: ListMeta;
  data: T[]
}

export interface ListRequest<S> {
  page: number;
  pageSize: number;
  context: S;
}

interface UseListParams<T, S> {
  fetchData: (option: ListRequest<S>) => Promise<ListResponse<T>>;
  defaultData?: T[];
  initialState?: ListState<T>;
  pageSize?: number;
}

type useListHook<T, S> = (name: S) => UseListHook<T>;

export default function useList<T, S>({
  fetchData,
  defaultData = [],
  initialState = {},
  pageSize = 8
}: UseListParams<T, S>): useListHook<T, S> {
  const DEFAULT_META: ListMeta = Object.freeze({
    page: -1,
    pageSize,
    totalPage: null,
  });

  const DEFAULT_DATA_ITEM: ListItem<T> = Object.freeze({
    isFetching: false,
    meta: DEFAULT_META,
    data: Object.freeze(defaultData) as T[]
  });

  const DATA: ListState<T> = initialState;

  return context => {
    const uuid: string = JSON.stringify(context);
    const item: ListItem<T> = DATA[uuid] || DEFAULT_DATA_ITEM;
    const [meta, setMeta] = useState<ListMeta>(item.meta);
    const [data, setData] = useState<T[]>(item.data);
    const [isFetching, setFetching] = useState<boolean>(item.isFetching);

    const hasMore = useMemo(() => {
      const { page, totalPage } = meta;
      const nextPage = page + 1;

      return !totalPage || nextPage < totalPage;
    }, [meta]);

    const fetchPage = useCallback((page) => {
      const { pageSize } = meta;

      setFetching(true);

      fetchData({
        page,
        pageSize,
        context
      }).then((result: ListResponse<T>) => {
        const { meta, data: previousData } = result;
        const item = DATA[uuid];
        const data: T[] = [
          ...(item ? item.data : []),
          ...previousData
        ];

        DATA[uuid] = {
          isFetching: false,
          meta,
          data
        };

        setFetching(false);
        setMeta(meta);
        setData(data);
      });
    }, [uuid]);

    const loadMore = useCallback(() => {
      if (hasMore) {
        const { page } = meta;

        fetchPage(page + 1);
      }
    }, [meta, hasMore]);

    useEffect(() => {
      const item = DATA[uuid] || DEFAULT_DATA_ITEM;

      if (item.data !== data) {
        setMeta(item.meta);
        setData(item.data);
        setFetching(item.isFetching);
      }
    }, [uuid]);

    return {
      isFetching,
      data,
      meta,
      hasMore,
      loadMore
    };
  };
};;
