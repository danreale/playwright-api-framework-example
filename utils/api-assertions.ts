// utils/api-assertions.ts
import { APIResponse, expect } from "@playwright/test";
import test from "@playwright/test";
import Ajv from "ajv";

const ajv = new Ajv({ allErrors: true });

export async function assertResponseStatus(
  response: APIResponse,
  expectedStatus: number = 200,
): Promise<void> {
  await test.step(`Assert response status is ${expectedStatus}`, async () => {
    const status = response.status();
    expect(status, `Expected ${expectedStatus} but got ${status}`).toBe(
      expectedStatus,
    );
  });
}

export async function assertResponseJson(
  response: APIResponse,
  expectedData: Record<string, unknown>,
): Promise<void> {
  await test.step("Assert response JSON matches expected data", async () => {
    const body = await response.json();
    expect(body).toMatchObject(expectedData);
  });
}

export async function assertSchema(
  response: APIResponse,
  schema: object,
): Promise<void> {
  await test.step("Validate JSON Schema", async () => {
    const body = await response.json();
    const validate = ajv.compile(schema);
    const valid = validate(body);
    if (!valid) {
      const errors = ajv.errorsText(validate.errors);
      throw new Error(`Schema validation failed: ${errors}`);
    }
  });
}
