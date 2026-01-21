// fixtures/api-fixtures.ts
import { test as base } from "@playwright/test";
import { UserService } from "../services/user-service";
import { CompanyService } from "../services/company-service";
import { AuthService } from "../services/auth-service";

type MyFixtures = {
  userService: UserService;
  companyService: CompanyService;
  authService: AuthService;
};

export const test = base.extend<MyFixtures>({
  userService: async ({ request }, use) => {
    await use(new UserService(request));
  },
  companyService: async ({ request }, use) => {
    // Provide the service to the test
    await use(new CompanyService(request));
    // AFTER the test finishes, run cleanup
    await new CompanyService(request).cleanup();
  },
  authService: async ({ request, playwright }, use) => {
    await use(new AuthService(request, playwright));
  },
});

export { expect } from "@playwright/test";
