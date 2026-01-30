import { z } from "zod"

export const envSchema = z.object({
  DB_CONN_STRING: z.string()
    .startsWith('mongodb://', { message: "Must be a valid connection string" }),
    // .includes('@', { message: "Connection string must include credentials" }),
  PORT: z.string()
    .default('27017')
    .transform(Number)
    .pipe(z.number().int().positive()),
  DB_NAME: z.string()
});