import { verifyToken as clerkVerifyToken } from '@clerk/backend';

export interface AuthUser {
  userId: string;
}

interface NullOptions {
  userId?: string;
  authenticated?: boolean;
}

interface TokenVerifier {
  verifyToken(token: string): Promise<AuthUser | null>;
}

export class AuthService {
  private constructor(private verifier: TokenVerifier) {}

  static create(secretKey: string): AuthService {
    return new AuthService(new ClerkTokenVerifier(secretKey));
  }

  static createNull(options: NullOptions = {}): AuthService {
    const authenticated = options.authenticated ?? true;
    const userId = options.userId ?? 'test-user';
    return new AuthService(
      new StubTokenVerifier(authenticated ? userId : null),
    );
  }

  verifyToken(token: string): Promise<AuthUser | null> {
    return this.verifier.verifyToken(token);
  }
}

class ClerkTokenVerifier implements TokenVerifier {
  constructor(private secretKey: string) {}

  async verifyToken(token: string): Promise<AuthUser | null> {
    try {
      const result = await clerkVerifyToken(token, {
        secretKey: this.secretKey,
      });
      return { userId: result.sub };
    } catch {
      return null;
    }
  }
}

class StubTokenVerifier implements TokenVerifier {
  constructor(private userId: string | null) {}

  verifyToken(): Promise<AuthUser | null> {
    if (this.userId === null) {
      return Promise.resolve(null);
    }
    return Promise.resolve({ userId: this.userId });
  }
}
