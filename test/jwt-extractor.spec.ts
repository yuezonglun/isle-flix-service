import { extractAccessToken } from '../src/auth/jwt.strategy';

describe('JWT extractor compatibility', () => {
  it('extracts token from standard bearer header', () => {
    const token = extractAccessToken({
      headers: { authorization: 'Bearer abc.def.ghi' },
    });
    expect(token).toBe('abc.def.ghi');
  });

  it('extracts token from plain authorization header', () => {
    const token = extractAccessToken({
      headers: { authorization: 'abc.def.ghi' },
    });
    expect(token).toBe('abc.def.ghi');
  });

  it('extracts token from x-access-token header', () => {
    const token = extractAccessToken({
      headers: { 'x-access-token': 'abc.def.ghi' },
    });
    expect(token).toBe('abc.def.ghi');
  });
});
