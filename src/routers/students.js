import { Router } from "express";
import {
  createStudentController,
  deleteStudentController,
  getAllStudentsController,
  getStudentByIdController,
  upsertStudentController,
} from "../controllers/students.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { validateBody } from "../middlewares/validateBody.js";
import {
  createStudentSchema,
  updateStudentSchema,
} from "../validation/students.js";
import { isValidId } from "../middlewares/isValidId.js";
import { authenticate } from "../middlewares/authenticate.js";
import { checkRoles } from "../middlewares/checkRoles.js";
import { ROLES } from "../constants/index.js";

const studentsRouter = Router();

studentsRouter.use(authenticate);

studentsRouter.get(
  "/",
  checkRoles(ROLES.TEACHER),
  ctrlWrapper(getAllStudentsController)
);
studentsRouter.get(
  "/:studentId",
  checkRoles(ROLES.TEACHER, ROLES.PARENT),
  isValidId,
  ctrlWrapper(getStudentByIdController)
);
studentsRouter.post(
  "/",
  checkRoles(ROLES.TEACHER),
  validateBody(createStudentSchema),
  ctrlWrapper(createStudentController)
);
studentsRouter.delete(
  "/:studentId",
  checkRoles(ROLES.TEACHER),
  isValidId,
  ctrlWrapper(deleteStudentController)
);
studentsRouter.put(
  "/:studentId",
  checkRoles(ROLES.TEACHER, ROLES.PARENT),
  validateBody(updateStudentSchema),
  ctrlWrapper(upsertStudentController)
);

export default studentsRouter;
