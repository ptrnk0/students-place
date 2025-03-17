import { StudentsCollection } from "../db/models/students.js";
import { calculatePaginationData } from "../utils/calculatePaginationData.js";

export async function getAllStudents({
  page,
  perPage,
  sortBy,
  sortOrder,
  filter = {},
}) {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const studentsQuery = StudentsCollection.find();

  if (filter.gender) {
    studentsQuery.where("gender").equals(filter.gender);
  }
  if (filter.maxAge) {
    studentsQuery.where("age").lte(filter.maxAge);
  }
  if (filter.minAge) {
    studentsQuery.where("age").gte(filter.minAge);
  }
  if (filter.maxAvgMark) {
    studentsQuery.where("avgMark").lte(filter.maxAvgMark);
  }
  if (filter.minAvgMark) {
    studentsQuery.where("avgMark").gte(filter.minAvgMark);
  }

  const [studentsCount, students] = await Promise.all([
    StudentsCollection.find().merge(studentsQuery).countDocuments(),
    studentsQuery
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder })
      .exec(),
  ]);

  const paginationData = calculatePaginationData(studentsCount, perPage, page);
  return { data: students, ...paginationData };
}

export async function getStudentById(studentId) {
  const student = await StudentsCollection.findById(studentId);
  return student;
}

export async function createStudent(payload) {
  const student = await StudentsCollection.create(payload);
  return student;
}

export async function deleteStudent(studentId) {
  const student = await StudentsCollection.findByIdAndDelete({
    _id: studentId,
  });
  return student;
}

export async function upsertStudent(studentId, payload, options = {}) {
  const rawResult = await StudentsCollection.findOneAndUpdate(
    {
      _id: studentId,
    },
    payload,
    {
      new: true,
      includeResultMetadata: true,
      ...options,
    }
  );

  if (!rawResult || !rawResult.value) {
    return null;
  }

  return {
    student: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
}
