// tests/integration.spec.ts
import { test, expect } from "../fixtures/api-fixtures";
import { companySchema } from "../schemas/company";
import { UserRole } from "../utils/user_roles";
import {
  assertResponseJson,
  assertResponseStatus,
  assertSchema,
} from "../utils/api-assertions";

test.describe("Organizational API Flow", () => {
  test("should link a new user to a new company", async ({
    userService,
    companyService,
    authService,
  }) => {
    // Authorize the service instances as Admin
    await authService.authorizeInstances(UserRole.Admin, [
      userService,
      companyService,
    ]);

    // 1. Create a Company
    const compRes = await companyService.createCompany({
      name: "TechCorp",
      industry: "SaaS",
    });
    await companyService.assertResponseStatus(compRes, 201);

    // 2. Validate Company Schema
    await companyService.assertSchema(compRes, companySchema);
    const company = await compRes.json();

    // 3. Create a User using the new Company's ID
    const userRes = await userService.createUser({
      name: "Alice",
      job: "Dev",
      companyId: company.id,
    });

    await userService.assertResponseStatus(userRes, 201);
    expect(await userRes.json()).toMatchObject({ name: "Alice" });

    // 4. Update Company
    const compUp = await companyService.updateCompany(company.id, {
      name: "New Name",
      industry: "New Industry",
    });

    // If this fails, the 'logOnFailure' inside ApiManager
    // automatically attaches the error details to the report.
    await companyService.assertResponseStatus(compUp, 200);
  });

  test("Company Service Example", async ({ authService, companyService }) => {
    // Authorize the service instances as Admin
    await authService.authorizeInstances(UserRole.Admin, [companyService]);

    // 1. Create a Company
    const comp1 = await companyService.post("/api/companies", {
      name: "TechCorp",
      industry: "SaaS",
    });

    await companyService.assertResponseStatus(comp1, 201);

    // 2. Validate Company Schema
    await companyService.assertSchema(comp1, companySchema);
  });

  test("standard API test example", async ({ authService }) => {
    // Get an authorized request context (no need for service classes)
    const authorizedRequest = await authService.getAuthorizedRequest(
      UserRole.Admin,
    );

    // Perform standard API calls
    const postResponse = await authorizedRequest.post("/api/companies", {
      data: { name: "Test Company", industry: "Tech" },
    });
    await assertResponseStatus(postResponse, 201);

    const getResponse = await authorizedRequest.get("/api/companies/1");
    await assertResponseStatus(getResponse, 200);

    await assertResponseJson(getResponse, { name: "Test" });
    await assertSchema(getResponse, companySchema);

    // Clean up the context if needed (optional, Playwright handles it)
    await authorizedRequest.dispose();
  });
});
