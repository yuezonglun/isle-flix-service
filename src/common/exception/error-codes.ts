import { HttpStatus } from '@nestjs/common';

export const ErrorCode = {
  BAD_REQUEST: 1001,
  UNAUTHORIZED: 1002,
  FORBIDDEN: 1003,
  NOT_FOUND: 1004,
  CONFLICT: 1005,
  UNPROCESSABLE_ENTITY: 1006,
  TOO_MANY_REQUESTS: 1007,
  INTERNAL_ERROR: 1500,
} as const;

const DEFAULT_MESSAGE_BY_STATUS: Record<number, string> = {
  [HttpStatus.BAD_REQUEST]: '请求参数不合法',
  [HttpStatus.UNAUTHORIZED]: '未登录或登录已过期',
  [HttpStatus.FORBIDDEN]: '无权限访问该资源',
  [HttpStatus.NOT_FOUND]: '请求的资源不存在',
  [HttpStatus.CONFLICT]: '请求冲突，请检查后重试',
  [HttpStatus.UNPROCESSABLE_ENTITY]: '请求参数语义错误',
  [HttpStatus.TOO_MANY_REQUESTS]: '请求过于频繁，请稍后重试',
  [HttpStatus.INTERNAL_SERVER_ERROR]: '服务内部异常，请稍后重试',
};

const CODE_BY_STATUS: Record<number, number> = {
  [HttpStatus.BAD_REQUEST]: ErrorCode.BAD_REQUEST,
  [HttpStatus.UNAUTHORIZED]: ErrorCode.UNAUTHORIZED,
  [HttpStatus.FORBIDDEN]: ErrorCode.FORBIDDEN,
  [HttpStatus.NOT_FOUND]: ErrorCode.NOT_FOUND,
  [HttpStatus.CONFLICT]: ErrorCode.CONFLICT,
  [HttpStatus.UNPROCESSABLE_ENTITY]: ErrorCode.UNPROCESSABLE_ENTITY,
  [HttpStatus.TOO_MANY_REQUESTS]: ErrorCode.TOO_MANY_REQUESTS,
  [HttpStatus.INTERNAL_SERVER_ERROR]: ErrorCode.INTERNAL_ERROR,
};

export function resolveErrorCode(status: number): number {
  return CODE_BY_STATUS[status] ?? ErrorCode.INTERNAL_ERROR;
}

export function resolveDefaultErrorMessage(status: number): string {
  return DEFAULT_MESSAGE_BY_STATUS[status] ?? DEFAULT_MESSAGE_BY_STATUS[HttpStatus.INTERNAL_SERVER_ERROR];
}
