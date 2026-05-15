import { BadRequestException, CallHandler, ExecutionContext, HttpStatus, UnauthorizedException, ValidationError } from '@nestjs/common';
import { of } from 'rxjs';
import { GlobalExceptionFilter } from '../src/common/exception/global-exception.filter';
import { ResponseInterceptor } from '../src/common/interceptors/response.interceptor';

describe('统一响应体与异常过滤契约', () => {
  it('成功响应应包装为统一结构', (done) => {
    const interceptor = new ResponseInterceptor();
    const context = {} as ExecutionContext;
    const next: CallHandler = { handle: () => of({ value: 1 }) };

    interceptor.intercept(context, next).subscribe((res: any) => {
      expect(res.code).toBe(0);
      expect(res.status).toBe('SUCCESS');
      expect(res.message).toBe('成功');
      expect(res.data).toEqual({ value: 1 });
      expect(typeof res.ts).toBe('string');
      done();
    });
  });

  it('DTO 校验失败应返回中文原因', () => {
    const filter = new GlobalExceptionFilter();
    const statusMock = jest.fn().mockReturnThis();
    const jsonMock = jest.fn();

    const host = {
      switchToHttp: () => ({
        getResponse: () => ({ status: statusMock, json: jsonMock }),
        getRequest: () => ({ method: 'GET', url: '/x' }),
      }),
    } as any;

    const validationError = { property: 'id', constraints: { isUuid: 'id must be a UUID' } } as ValidationError;
    const ex = new BadRequestException({ message: '请求参数不合法', validationErrors: [validationError] });

    filter.catch(ex, host);

    expect(statusMock).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    const payload = jsonMock.mock.calls[0][0];
    expect(payload.code).toBe(1001);
    expect(payload.status).toBe('FAIL');
    expect(payload.message).toContain('参数 id 格式不正确');
    expect(payload.data).toBeNull();
  });

  it('鉴权失败应返回中文消息', () => {
    const filter = new GlobalExceptionFilter();
    const statusMock = jest.fn().mockReturnThis();
    const jsonMock = jest.fn();

    const host = {
      switchToHttp: () => ({
        getResponse: () => ({ status: statusMock, json: jsonMock }),
        getRequest: () => ({ method: 'POST', url: '/x' }),
      }),
    } as any;

    filter.catch(new UnauthorizedException('未登录或登录已过期'), host);

    expect(statusMock).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
    const payload = jsonMock.mock.calls[0][0];
    expect(payload.code).toBe(1002);
    expect(payload.status).toBe('FAIL');
    expect(payload.message).toBe('未登录或登录已过期');
  });

  it('未知异常应使用统一兜底消息', () => {
    const filter = new GlobalExceptionFilter();
    const statusMock = jest.fn().mockReturnThis();
    const jsonMock = jest.fn();

    const host = {
      switchToHttp: () => ({
        getResponse: () => ({ status: statusMock, json: jsonMock }),
        getRequest: () => ({ method: 'GET', url: '/x' }),
      }),
    } as any;

    filter.catch(new Error('boom'), host);

    expect(statusMock).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    const payload = jsonMock.mock.calls[0][0];
    expect(payload.code).toBe(1500);
    expect(payload.status).toBe('FAIL');
    expect(payload.message).toBe('服务内部异常，请稍后重试');
  });
});
