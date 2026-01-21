// services/auth-service.ts
import test from "@playwright/test";
import { APIRequestContext } from "@playwright/test";
import { ApiManager } from "../lib/api-manager";
import { UserRole } from "../utils/user_roles";

export interface LoginResponse {
  token: string;
}

export class AuthService extends ApiManager {
  private readonly path = "/api/login";

  constructor(
    public request: APIRequestContext,
    private playwright: any,
  ) {
    super(request);
  }

  async getToken(role: UserRole): Promise<string> {
    return await test.step(`Get token for ${role}`, async () => {
      const creds = {
        admin: { email: "admin@test.com", password: "123" },
        viewer: { email: "guest@test.com", password: "123" },
        editor: { email: "edit@test.com", password: "123" },
      }[role];

      const response = await this.post(this.path, creds);

      await this.assertResponseStatus(response, 200);

      const body: LoginResponse = await response.json();
      return body.token;
    });
  }

  async authorizeInstances(
    role: UserRole,
    instances: ApiManager[],
  ): Promise<void> {
    return await test.step(`Authorize instances as ${role}`, async () => {
      const token = await this.getToken(role);
      const authorizedRequest = await this.playwright.request.newContext({
        extraHTTPHeaders: { Authorization: `Bearer ${token}` },
      });
      for (const instance of instances) {
        instance.request = authorizedRequest;
      }
    });
  }

  async getAuthorizedRequest(role: UserRole): Promise<APIRequestContext> {
    return await test.step(`Get authorized request context for ${role}`, async () => {
      const token = await this.getToken(role);
      return await this.playwright.request.newContext({
        extraHTTPHeaders: { Authorization: `Bearer ${token}` },
      });
    });
  }
}
