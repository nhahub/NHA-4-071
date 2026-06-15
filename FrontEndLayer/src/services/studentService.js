// src/services/studentService.js
import { fetchService } from "./genericFetchService";
import { CourseResponseSchema } from "../Schemas/ResponseSchemas/courseResponseSchema";
import { EnrollmentRequestSchema } from "../Schemas/RequestSchemas/enrollmentSchemas";

export const getAvailableCourses = () => {
  // We pass the CourseResponseSchema to ensure the data matches what we expect!
  return fetchService(
    "/courses/available",
    { method: "GET" },
    CourseResponseSchema,
  );
};

export const enrollInCourse = (courseId) => {
  // Validate the request payload first
  const payload = EnrollmentRequestSchema.parse({ courseId });

  return fetchService("/enrollments", { method: "POST", data: payload });
};
