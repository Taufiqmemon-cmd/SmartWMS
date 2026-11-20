import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { createHash } from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service.js';
import { IS_PUBLIC_KEY } from './public.decorator.js';
import { allowedWebOrigins } from './origins.js';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector, private readonly prisma: PrismaService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [context.getHandler(), context.getClass()])) return true;
    const request = context.switchToHttp().getRequest();
    const token = request.headers.cookie?.split(';').map((v: string) => v.trim()).find((v: string) => v.startsWith('smartwms_session='))?.slice('smartwms_session='.length);
    if (!token) throw new UnauthorizedException('Authentication required');
    const tokenHash = createHash('sha256').update(token).digest('hex');
    const session = await this.prisma.authSession.findUnique({ where: { tokenHash }, include: { user: true } });
    if (!session || session.revokedAt || session.expiresAt <= new Date() || !session.user.isActive) throw new UnauthorizedException('Session is invalid or expired');
    request.user = { id: session.user.id, name: session.user.name, email: session.user.email, role: session.user.role, sessionId: session.id };
    const writeRequest = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method);
    const origin = request.headers.origin;
    const allowedOrigins = allowedWebOrigins();
    if (writeRequest && origin && !allowedOrigins.includes(origin)) throw new ForbiddenException('Request origin is not allowed');
    if (request.body && typeof request.body === 'object' && !Array.isArray(request.body)) for (const key of ['createdById', 'actorId']) if (key in request.body) request.body[key] = session.user.id;
    if (writeRequest && session.user.role === 'VIEWER') throw new ForbiddenException('Viewer accounts have read-only access');
    return true;
  }
}
