// lib/api-manager.ts
import test, { APIRequestContext, APIResponse, expect } from "@playwright/test";
import {
  assertResponseStatus,
  assertResponseJson,
  assertSchema,
} from "../utils/api-assertions";

export class ApiManager {
  //   readonly request: APIRequestContext;

  constructor(public request: APIRequestContext) {
    this.request = request;
  }

  async post(url: string, data?: any, headers?: { [key: string]: string }) {
    return await test.step(`POST ${url}`, async () => {
      const response = await this.request.post(url, {
        data,
        headers: { "Content-Type": "application/json", ...headers },
      });
      await this.logOnFailure(response, data); // Explicit call
      return response;
    });
  }

  async get(
    url: string,
    params?: { [key: string]: string | number | boolean },
  ) {
    return await test.step(`GET ${url}`, async () => {
      const response = await this.request.get(url, { params });
      await this.logOnFailure(response, params); // Explicit call
      return response;
    });
  }

  async delete(url: string) {
    return await test.step(`DELETE ${url}`, async () => {
      const response = await this.request.delete(url);
      await this.logOnFailure(response, null); // Explicit call
      return response;
    });
  }

  async put(url: string, data?: any, headers?: { [key: string]: string }) {
    return await test.step(`PUT ${url}`, async () => {
      const response = await this.request.put(url, {
        data,
        headers: { "Content-Type": "application/json", ...headers },
      });
      await this.logOnFailure(response, data); // Explicit call
      return response;
    });
  }

  // Generic Assertion Helper
  async assertResponseStatus(
    response: APIResponse,
    expectedStatus: number = 200,
  ) {
    await assertResponseStatus(response, expectedStatus);
  }

  async assertResponseJson(
    response: APIResponse,
    expectedData: Record<string, unknown>,
  ) {
    await assertResponseJson(response, expectedData);
  }

  /**
   * Reusable Schema Validation
   * @param response The Playwright APIResponse
   * @param schema The JSON Schema object
   */

  async assertSchema(response: APIResponse, schema: object) {
    await assertSchema(response, schema);
  }

  // The helper method used by each standard method
  private async logOnFailure(response: APIResponse, sentData: any) {
    if (!response.ok()) {
      const reportEntity = {
        url: response.url(),
        status: response.status(),
        statusText: response.statusText(),
        requestData: sentData || "No data sent",
        responseBody: await response
          .json()
          .catch(() => "Response was not JSON"),
        headers: response.headers(),
      };

      await test.info().attach("Debug Payload", {
        body: JSON.stringify(reportEntity, null, 2),
        contentType: "application/json",
      });
    }
  }
}
