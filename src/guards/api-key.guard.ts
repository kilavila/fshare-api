import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor() { }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const userApiKey = request.headers['x-api-key'];
    const envApiKey = process.env.API_KEY;

    if (userApiKey !== envApiKey) {
      return false;
    }

    return true;
  }
}

