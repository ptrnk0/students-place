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

const studentsRouter = Router();

studentsRouter.get("/", ctrlWrapper(getAllStudentsController));
studentsRouter.get(
  "/:studentId",
  isValidId,
  ctrlWrapper(getStudentByIdController)
);
studentsRouter.post(
  "/",
  validateBody(createStudentSchema),
  ctrlWrapper(createStudentController)
);
studentsRouter.delete(
  "/:studentId",
  isValidId,
  ctrlWrapper(deleteStudentController)
);
studentsRouter.put(
  "/:studentId",
  validateBody(updateStudentSchema),
  ctrlWrapper(upsertStudentController)
);

export default studentsRouter;
