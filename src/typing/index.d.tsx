declare type useDetailHook = (name: string) => UseDetailHook;
declare type useListHook = (name: string) => UseListHook;

export type useDetailFn = (options: UseDetailParams) => useDetailHook;

export type useListFn = (options: UseListParams) => useListHook;

export interface UseDetailHook {
  detail: any;
  isFetching: boolean;
}

export interface UseListHook {
  isFetching: boolean;
  data: Array<any>;
  meta: ListMeta;
  hasMore: boolean;
  loadMore: () => void;
}

export interface DetailResponse {
  data: any;
}

export interface ListMeta {
  page: number;
  pageSize: number;
  totalPage: number;
}

export interface ListResponse {
  meta: ListMeta;
  data: Array<any>
}

export interface ListRequest {
  page: number;
  pageSize: number;
  context: any;
}

export interface UseDetailParams {
  fetchData: (context: any) => Promise<DetailResponse>;
  initialState: any;
  defaultData: any;
  enableEmptyRequest: boolean;
}

export interface UseListParams {
  fetchData: (option: ListRequest) => Promise<ListResponse>;
  initialState: any;
  defaultData: any;
  pageSize: number;
}