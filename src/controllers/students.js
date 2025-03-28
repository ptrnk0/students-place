import createHttpError from "http-errors";
import {
  createStudent,
  deleteStudent,
  getAllStudents,
  getStudentById,
  upsertStudent,
} from "../services/students.js";
import { parsePaginationParams } from "../utils/parsePaginationParams.js";
import { parseSortParams } from "../utils/parseSortParams.js";
import { parseFilterParams } from "../utils/parseFilterParams.js";
import { saveFileToUploadDir } from "../utils/saveFileToUploadDir.js";
import { getEnvVar } from "../utils/getEnvVar.js";
import { saveFileToCloudinary } from "../utils/saveFileToCloudinary.js";

export async function getAllStudentsController(req, res) {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);

  const students = await getAllStudents({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
  });

  res.status(200).json({ data: students });
}

export async function getStudentByIdController(req, res, next) {
  const { studentId } = req.params;
  const student = await getStudentById(studentId);

  if (!student) {
    next(createHttpError(404, "Student not found"));
    return;
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found student with id ${studentId}!`,
    data: student,
  });
}

export async function createStudentController(req, res) {
  const student = await createStudent(req.body);
  res.status(201).json({
    status: 201,
    message: "Successfully created a student!",
    data: student,
  });
}

export async function deleteStudentController(req, res, next) {
  const { studentId } = req.params;
  const student = await deleteStudent(studentId);

  if (!student) {
    next(createHttpError(404, "Student not found"));
    return;
  }

  res.status(204).send();
}

export async function upsertStudentController(req, res, next) {
  const { studentId } = req.params;
  const photo = req.file;

  let photoUrl;

  if (photo) {
    if (getEnvVar("ENABLE_CLOUDINARY") === "true") {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }

  const result = await upsertStudent(
    studentId,
    { ...req.body, photo: photoUrl },
    { upsert: true }
  );

  if (!result) {
    next(createHttpError(404, "Student not found"));
  }

  const status = result.isNew ? 201 : 200;
  res.status(status).json({
    status,
    message: `Successfully upserted a student!`,
    data: result.student,
  });
}
