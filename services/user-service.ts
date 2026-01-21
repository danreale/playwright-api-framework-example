// services/user-service.ts
import { ApiManager } from "../lib/api-manager";
import test from "@playwright/test";

export class UserService extends ApiManager {
  private readonly userPath = "/api/users";

  async createUser(userData: { name: string; job: string; companyId: number }) {
    return await test.step(`Create user: ${userData.name}`, async () => {
      return await this.post(this.userPath, userData);
    });
  }

  async getUser(id: number) {
    return await test.step(`Get user with ID: ${id}`, async () => {
      return await this.get(`${this.userPath}/${id}`);
    });
  }
}
