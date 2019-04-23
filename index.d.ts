export as namespace ReactUseData;

export function useDetail(option: useDetailParams): string;

export function useList(option: useListParams): number;

export interface DetailResponse {
  data: any
}

export interface ListMeta {
  page: number,
  pageSize: number,
  totalPage: number
}

export interface ListResponse {
  meta: ListMeta,
  data: Array<any>
}

export interface ListRequest {
  page: number,
  pageSize: number,
  context: string | null
}

export interface useDetailParams {
  fetchData: (context: string) => Promise<DetailResponse>,
  initalState: any,
  defaultData: any
}

export interface useListParams {
  fetchData: (option: ListRequest) => Promise<ListResponse>,
  initalState: any,
  defaultData: any,
  pageSize: number
}