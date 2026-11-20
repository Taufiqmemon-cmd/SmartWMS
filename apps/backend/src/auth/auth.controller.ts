import { BadRequestException, Body, Controller, Get, Headers, HttpCode, Post, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service.js';
import { Public } from './public.decorator.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}
  @Public() @Post('login') @HttpCode(200)
  async login(@Body() body: unknown, @Req() request: Request, @Res({ passthrough: true }) response: Response) {
    const d = this.object(body); const identifier = typeof d.identifier === 'string' ? d.identifier : d.email;
    if (typeof identifier !== 'string' || typeof d.password !== 'string' || identifier.length > 254 || d.password.length > 1024) throw new BadRequestException('Username or email and password are required');
    const result = await this.auth.login(identifier, d.password, request.ip ?? 'unknown'); response.setHeader('Set-Cookie', this.cookie(result.token, result.expiresAt)); return { user: result.user, expiresAt: result.expiresAt };
  }
  @Public() @Post('bootstrap')
  async bootstrap(@Headers('x-admin-bootstrap-token') token: string | undefined, @Body() body: unknown) {
    const d = this.object(body); if (typeof d.name !== 'string' || !d.name.trim() || typeof d.username !== 'string' || typeof d.email !== 'string' || typeof d.password !== 'string') throw new BadRequestException('Name, username, email, and password are required');
    return { user: await this.auth.bootstrap(token, d.name, d.username, d.email, d.password) };
  }
  @Get('me') me(@Req() request: Request & { user: { id: string; name: string; email: string; role: string } }) { return request.user; }
  @Post('logout') @HttpCode(200)
  async logout(@Req() request: Request & { user: { sessionId: string } }, @Res({ passthrough: true }) response: Response) {
    await this.auth.logout(request.user.sessionId); response.setHeader('Set-Cookie', 'smartwms_session=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0' + (process.env.NODE_ENV === 'production' ? '; Secure' : '')); return { success: true };
  }
  private object(body: unknown) { if (!body || typeof body !== 'object' || Array.isArray(body)) throw new BadRequestException('Request body must be an object'); return body as Record<string, unknown>; }
  private cookie(token: string, expiresAt: Date) { const maxAge = Math.floor((expiresAt.getTime() - Date.now()) / 1000); return `smartwms_session=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${maxAge}` + (process.env.NODE_ENV === 'production' ? '; Secure' : ''); }
}
