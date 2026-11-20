import { networkInterfaces } from 'node:os';

export function allowedWebOrigins(): string[] {
  const configured = (process.env.WEB_ORIGINS ?? 'http://localhost:3000,http://localhost:3001').split(',').map((origin) => origin.trim()).filter(Boolean);
  for (const addresses of Object.values(networkInterfaces())) {
    for (const address of addresses ?? []) {
      if (!address.internal && address.family === 'IPv4') configured.push('http://' + address.address + ':3001');
    }
  }
  return [...new Set(configured)];
}
