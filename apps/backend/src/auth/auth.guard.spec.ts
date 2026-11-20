import { describe, expect, it, vi } from 'vitest';
import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from './auth.guard.js';
import { Reflector } from '@nestjs/core';
import { createHash } from 'node:crypto';

function context(cookie?: string, method = 'GET') {
  const request = { method, headers: { cookie }, body: {} as Record<string, unknown> };
  return { getHandler: () => ({}), getClass: () => ({}), switchToHttp: () => ({ getRequest: () => request }) } as never;
}

describe('AuthGuard', () => {
  it('rejects anonymous requests', async () => {
    const reflector = { getAllAndOverride: vi.fn().mockReturnValue(false) } as unknown as Reflector;
    const guard = new AuthGuard(reflector, { authSession: { findUnique: vi.fn() } } as never);
    await expect(guard.canActivate(context())).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('accepts a valid session and binds audit actor fields to its user', async () => {
    const user = { id: 'user-1', name: 'Operator', email: 'operator@example.test', role: 'OPERATOR', isActive: true };
    const session = { id: 'session-1', userId: user.id, revokedAt: null, expiresAt: new Date(Date.now() + 60_000), user };
    const token = 'opaque-session-token';
    const findUnique = vi.fn().mockResolvedValue(session);
    const reflector = { getAllAndOverride: vi.fn().mockReturnValue(false) } as unknown as Reflector;
    const guard = new AuthGuard(reflector, { authSession: { findUnique } } as never);
    const ctx = context(`smartwms_session=${token}`, 'POST') as any;
    expect(await guard.canActivate(ctx)).toBe(true);
    expect(findUnique).toHaveBeenCalledWith({ where: { tokenHash: createHash('sha256').update(token).digest('hex') }, include: { user: true } });
    expect(ctx.switchToHttp().getRequest().user.id).toBe(user.id);
  });

  it('keeps viewer sessions read-only', async () => {
    const user = { id: 'viewer-1', name: 'Viewer', email: 'viewer@example.test', role: 'VIEWER', isActive: true };
    const reflector = { getAllAndOverride: vi.fn().mockReturnValue(false) } as unknown as Reflector;
    const guard = new AuthGuard(reflector, { authSession: { findUnique: vi.fn().mockResolvedValue({ id: 's1', revokedAt: null, expiresAt: new Date(Date.now() + 60_000), user }) } } as never);
    await expect(guard.canActivate(context('smartwms_session=valid', 'POST'))).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('rejects cross-origin cookie mutation attempts', async () => {
    const user = { id: 'operator-1', name: 'Operator', email: 'operator@example.test', role: 'OPERATOR', isActive: true };
    const reflector = { getAllAndOverride: vi.fn().mockReturnValue(false) } as unknown as Reflector;
    const guard = new AuthGuard(reflector, { authSession: { findUnique: vi.fn().mockResolvedValue({ id: 's1', revokedAt: null, expiresAt: new Date(Date.now() + 60_000), user }) } } as never);
    const ctx = context('smartwms_session=valid', 'POST') as any;
    ctx.switchToHttp().getRequest().headers.origin = 'https://untrusted.example';
    await expect(guard.canActivate(ctx)).rejects.toBeInstanceOf(ForbiddenException);
  });
});
