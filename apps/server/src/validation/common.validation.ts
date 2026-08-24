import { z } from "zod";

const OBJECT_ID_REGEX = /^[0-9a-fA-F]{24}$/;

export const objectIdSchema = (fieldName = "ID") =>
  z
    .string()
    .trim()
    .regex(OBJECT_ID_REGEX, { message: `${fieldName} must be a valid ObjectId` });
