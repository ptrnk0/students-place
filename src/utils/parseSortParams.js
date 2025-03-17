import { SORT_ORDER } from "../constants/index.js";

function parseSortOrder(sortOrder) {
  const isKnownOrder = [SORT_ORDER.ASC, SORT_ORDER.DESC].includes(sortOrder);
  if (isKnownOrder) return sortOrder;
  return SORT_ORDER.ASC;
}

function parseSortBy(sortBy) {
  const keysOfStudents = [
    "_id",
    "name",
    "age",
    "gender",
    "avgMark",
    "onDuty",
    "createdAt",
    "updatedAt",
  ];

  if (keysOfStudents.includes(sortBy)) return sortBy;

  return "_id";
}

export function parseSortParams(query) {
  const { sortOrder, sortBy } = query;

  const parsedSortOrder = parseSortOrder(sortOrder);
  const parsedSortBy = parseSortBy(sortBy);

  return {
    sortOrder: parsedSortOrder,
    sortBy: parsedSortBy,
  };
}
