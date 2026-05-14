export type ApiResponse<T> = {
  code: number;
  message: string;
  data: T;
  ts: string;
};

export function ok<T>(data: T): ApiResponse<T> {
  return {
    code: 0,
    message: 'ok',
    data,
    ts: new Date().toISOString(),
  };
}
