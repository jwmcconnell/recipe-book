import { describe, it, expect } from 'vitest';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  it('createNull returns an AuthService instance', () => {
    const service = AuthService.createNull();

    expect(service).toBeInstanceOf(AuthService);
  });

  it('null service verifyToken returns configured user for any token', async () => {
    const service = AuthService.createNull({ userId: 'user-123' });

    const result = await service.verifyToken('any-token');

    expect(result).toEqual({ userId: 'user-123' });
  });

  it('null service verifyToken returns null when configured as unauthenticated', async () => {
    const service = AuthService.createNull({ authenticated: false });

    const result = await service.verifyToken('any-token');

    expect(result).toBeNull();
  });
});
