import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  ValidationError,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { failResponse } from '../response/api-response';
import { resolveDefaultErrorMessage, resolveErrorCode } from './error-codes';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = this.resolveStatus(exception);
    const message = this.resolveMessage(exception, status);
    const code = resolveErrorCode(status);

    response.status(status).json(failResponse(code, message));

    if (status >= 500) {
      // 仅记录服务端异常摘要，避免将堆栈泄露给调用方。
      // eslint-disable-next-line no-console
      console.error(`[${request.method}] ${request.url} -> ${status}`, exception);
    }
  }

  private resolveStatus(exception: unknown): number {
    if (exception instanceof HttpException) {
      return exception.getStatus();
    }
    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  private resolveMessage(exception: unknown, status: number): string {
    if (exception instanceof BadRequestException) {
      return this.resolveBadRequestMessage(exception);
    }

    if (exception instanceof HttpException) {
      const res = exception.getResponse();

      if (typeof res === 'string') {
        return this.normalizeHttpMessage(res, status);
      }

      if (typeof res === 'object' && res !== null) {
        const obj = res as { message?: string | string[] };
        if (Array.isArray(obj.message) && obj.message.length > 0) {
          return this.normalizeHttpMessage(obj.message[0], status);
        }
        if (typeof obj.message === 'string' && obj.message.trim()) {
          return this.normalizeHttpMessage(obj.message, status);
        }
      }
    }

    return resolveDefaultErrorMessage(status);
  }

  private resolveBadRequestMessage(exception: BadRequestException): string {
    const res = exception.getResponse();
    if (typeof res !== 'object' || res === null) {
      return '请求参数不合法';
    }

    const obj = res as { message?: unknown; validationErrors?: ValidationError[] };
    if (Array.isArray(obj.validationErrors) && obj.validationErrors.length > 0) {
      return this.validationErrorToChinese(obj.validationErrors[0]);
    }

    if (Array.isArray(obj.message) && obj.message.length > 0) {
      const first = obj.message[0];
      if (typeof first === 'string') {
        return this.normalizeHttpMessage(first, HttpStatus.BAD_REQUEST);
      }
    }

    if (typeof obj.message === 'string' && obj.message.trim()) {
      return this.normalizeHttpMessage(obj.message, HttpStatus.BAD_REQUEST);
    }

    return '请求参数不合法';
  }

  private validationErrorToChinese(error: ValidationError): string {
    const field = error.property;
    const constraints = error.constraints ?? {};
    const types = Object.keys(constraints);

    if (types.includes('isUuid')) return `参数 ${field} 格式不正确，应为 UUID`;
    if (types.includes('isUrl')) return `参数 ${field} 格式不正确，应为合法 URL`;
    if (types.includes('isString')) return `参数 ${field} 必须是字符串`;
    if (types.includes('isNotEmpty')) return `参数 ${field} 不能为空`;
    if (types.includes('minLength')) return `参数 ${field} 长度不足`;
    if (types.includes('isInt')) return `参数 ${field} 必须是整数`;
    if (types.includes('isBoolean')) return `参数 ${field} 必须是布尔值`;

    return `参数 ${field} 不合法`;
  }

  private normalizeHttpMessage(raw: string, status: number): string {
    const message = raw.trim();

    if (/^invalid credentials$/i.test(message)) return '用户名或密码错误';
    if (/^site provider not found$/i.test(message)) return '站点提供方不存在';

    if (!message) return resolveDefaultErrorMessage(status);

    return /[\u4e00-\u9fa5]/.test(message) ? message : resolveDefaultErrorMessage(status);
  }
}
