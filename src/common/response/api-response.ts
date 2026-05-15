export type ApiStatus = 'SUCCESS' | 'FAIL';

export type ApiResponse<T> = {
  code: number;
  status: ApiStatus;
  message: string;
  data: T;
  ts: string;
};

export function successResponse<T>(data: T, message = '成功'): ApiResponse<T> {
  return {
    code: 0,
    status: 'SUCCESS',
    message,
    data,
    ts: new Date().toISOString(),
  };
}

export function failResponse(code: number, message: string): ApiResponse<null> {
  return {
    code,
    status: 'FAIL',
    message,
    data: null,
    ts: new Date().toISOString(),
  };
}
