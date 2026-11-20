import { describe, expect, it, vi } from 'vitest';
import { AuthService } from './auth.service.js';
import { UnauthorizedException } from '@nestjs/common';
import { randomBytes, scrypt as scryptCallback } from 'node:crypto';
import { promisify } from 'node:util';
const scrypt = promisify(scryptCallback);

describe('AuthService', () => {
  it('creates only a hashed session token after valid credentials', async () => {
    const salt = randomBytes(16).toString('base64url');
    const hash = await scrypt('correct horse battery staple', salt, 64) as Buffer;
    const user = { id: 'u1', name: 'Admin', username: 'admin', email: 'admin@example.test', role: 'ADMIN', isActive: true, passwordHash: `$scrypt$${salt}$${hash.toString('base64url')}` };
    const prisma = { user: { findFirst: vi.fn().mockResolvedValue(user) }, authSession: { create: vi.fn().mockResolvedValue({}) } } as never;
    const service = new AuthService(prisma);
    const result = await service.login(user.email, 'correct horse battery staple', '127.0.0.1');
    expect(result.user).toEqual({ id: user.id, name: user.name, username: user.username, email: user.email, role: user.role });
    expect(result.token).toHaveLength(43);
    const stored = vi.mocked((prisma as any).authSession.create).mock.calls[0][0].data;
    expect(stored.tokenHash).not.toBe(result.token);
    expect(stored.tokenHash).toMatch(/^[a-f0-9]{64}$/);
    expect(stored.userId).toBe(user.id);
  });

  it('does not reveal whether an account exists when login fails', async () => {
    const prisma = { user: { findFirst: vi.fn().mockResolvedValue(null) }, authSession: { create: vi.fn() } } as never;
    const service = new AuthService(prisma);
    await expect(service.login('missing@example.test', 'wrong-password', '127.0.0.1')).rejects.toBeInstanceOf(UnauthorizedException);
    expect((prisma as any).authSession.create).not.toHaveBeenCalled();
  });
});
