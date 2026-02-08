import { createRouter, readBody } from "h3";
import { validate } from "../../utils/validate.js";
import {
  createCompanySchema,
  updateCompanySchema,
} from "../validators/company.schema.js";

import {
  createCompany,
  getCompaniesHandler,
  getCompanyHandler,
  updateCompanyHandler,
  deleteCompanyHandler,
  addUserToCompany,
} from "../handlers/companies.handlers.js";

const router = createRouter();

// CREATE COMPANY
router.post("/companies", async (event) => {
  const body = await readBody(event);
  const data = validate(createCompanySchema, body);
  return createCompany(data);
});

// UPDATE COMPANY
router.put("/companies/:id", async (event) => {
  const { id } = event.context.params;
  const body = await readBody(event);
  const data = validate(updateCompanySchema, body);
  return updateCompanyHandler(id, data);
});

router.get("/companies", () => getCompaniesHandler());
router.get("/companies/:id", (event) =>
  getCompanyHandler(event.context.params.id),
);
router.delete("/companies/:id", (event) =>
  deleteCompanyHandler(event.context.params.id,event),
);
router.post("/companies/:id/users", (event) =>
  addUserToCompany(event.context.params.id, event),
);
export default router;
