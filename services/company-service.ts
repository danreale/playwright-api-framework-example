// services/company-service.ts
import { APIResponse, test } from "@playwright/test"; // Import test to use test.step
import { ApiManager } from "../lib/api-manager";

export class CompanyService extends ApiManager {
  private readonly path = "/api/companies";
  // Array to track IDs created in the current test context
  private createdIds: number[] = [];

  async getCompany(id: number): Promise<APIResponse> {
    return await test.step(`Get company with ID: ${id}`, async () => {
      return await this.get(`${this.path}/${id}`);
    });
  }

  async createCompany(data: {
    name: string;
    industry: string;
  }): Promise<APIResponse> {
    return await test.step(`Create company: ${data.name}`, async () => {
      return await this.post(this.path, { data });
    });
  }

  async updateCompany(
    id: number,
    updateData: { name: string; industry: string },
  ): Promise<APIResponse> {
    return await test.step(`Update company: ${updateData.name}`, async () => {
      return await this.put(`${this.path}/${id}`, {
        data: updateData,
      });
    });
  }

  async cleanup(): Promise<void> {
    for (const id of this.createdIds) {
      await test.step(`CleanUp/Delete Test Company: ${id}`, async () => {
        await this.delete(`${this.path}/${id}`);
        console.log(`Cleanup: Deleted company ${id}`);
      });
    }
  }
}
