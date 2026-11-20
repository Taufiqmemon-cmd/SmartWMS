import { Injectable, UnauthorizedException, HttpException, BadRequestException, ConflictException, ServiceUnavailableException } from '@nestjs/common';
import { createHash, randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { PrismaService } from '../prisma/prisma.service.js';
const scrypt = promisify(scryptCallback);

@Injectable()
export class AuthService {
  private readonly failures = new Map<string, { count: number; since: number }>();
  constructor(private readonly prisma: PrismaService) {}
  async login(identifier: string, password: string, ip: string) {
    const now = Date.now(); const key = `${ip}:${identifier.toLowerCase()}`; const failed = this.failures.get(key);
    if (failed && now - failed.since < 900_000 && failed.count >= 5) throw new HttpException('Too many login attempts. Try again in 15 minutes.', 429);
    const user = await this.prisma.user.findFirst({ where: { OR: [{ email: identifier.toLowerCase() }, { username: identifier.toLowerCase() }] } });
    if (!user || !user.isActive || !(await this.verifyPassword(password, user.passwordHash))) {
      if (!failed || now - failed.since >= 900_000) this.failures.set(key, { count: 1, since: now }); else this.failures.set(key, { count: failed.count + 1, since: failed.since });
      throw new UnauthorizedException('Email or password is incorrect');
    }
    this.failures.delete(key);
    const token = randomBytes(32).toString('base64url'); const expiresAt = new Date(now + 8 * 60 * 60 * 1000);
    await this.prisma.authSession.create({ data: { userId: user.id, tokenHash: createHash('sha256').update(token).digest('hex'), expiresAt } });
    return { token, expiresAt, user: { id: user.id, name: user.name, username: user.username, email: user.email, role: user.role } };
  }
  async bootstrap(token: string | undefined, name: string, username: string, email: string, password: string) {
    const expected = process.env.ADMIN_BOOTSTRAP_TOKEN;
    if (!expected || expected.length < 32) throw new ServiceUnavailableException('Administrator setup is not configured. Set ADMIN_BOOTSTRAP_TOKEN to a random value of at least 32 characters, then restart the API.');
    if (!token || !this.equal(token, expected)) throw new UnauthorizedException('Bootstrap token is invalid');
    if (password.length < 12) throw new BadRequestException('Password must be at least 12 characters');
    if (!/^[a-zA-Z0-9._-]{3,32}$/.test(username)) throw new BadRequestException('Username must be 3-32 characters and use letters, numbers, dot, underscore, or hyphen');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new BadRequestException('A valid email address is required');
    if (await this.prisma.user.count({ where: { role: 'ADMIN' } })) throw new ConflictException('An administrator already exists');
    const salt = randomBytes(16).toString('base64url'); const hash = await scrypt(password, salt, 64) as Buffer;
    try { const user = await this.prisma.user.create({ data: { name: name.trim(), username: username.toLowerCase(), email: email.toLowerCase(), passwordHash: `$scrypt$${salt}$${hash.toString('base64url')}`, role: 'ADMIN' } }); return { id: user.id, name: user.name, username: user.username, email: user.email, role: user.role }; }
    catch (error) { if ((error as { code?: string }).code === 'P2002') throw new ConflictException('An account with this email or username already exists'); throw error; }
  }
  async logout(sessionId: string) { await this.prisma.authSession.update({ where: { id: sessionId }, data: { revokedAt: new Date() } }); }
  private async verifyPassword(password: string, stored: string) {
    const parts = stored.split('$'); if (parts.length !== 4 || parts[1] !== 'scrypt') return false;
    try { const expected = Buffer.from(parts[3], 'base64url'); const actual = await scrypt(password, parts[2], expected.length) as Buffer; return expected.length === actual.length && timingSafeEqual(expected, actual); } catch { return false; }
  }
  private equal(a: string, b: string) { const x = Buffer.from(a); const y = Buffer.from(b); return x.length === y.length && timingSafeEqual(x, y); }
}
