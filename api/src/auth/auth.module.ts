import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';

@Global()
@Module({
  providers: [
    {
      provide: AuthService,
      useFactory: () => {
        const secretKey = process.env.CLERK_SECRET_KEY;
        if (!secretKey) {
          throw new Error('CLERK_SECRET_KEY environment variable is required');
        }
        return AuthService.create(secretKey);
      },
    },
    AuthGuard,
  ],
  exports: [AuthService, AuthGuard],
})
export class AuthModule {}
