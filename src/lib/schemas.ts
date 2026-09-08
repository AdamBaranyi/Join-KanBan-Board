import { z } from "zod";

/* ── Enums (wie im Original) ─────────────────────────────────────────── */

export const taskStatusSchema = z.enum([
  "todo",
  "inProgress",
  "awaitingFeedback",
  "done",
]);
export type TaskStatus = z.infer<typeof taskStatusSchema>;

export const taskPrioritySchema = z.enum(["Urgent", "Medium", "Low"]);
export type TaskPriority = z.infer<typeof taskPrioritySchema>;

export const taskCategorySchema = z.enum(["Technical Task", "User Story"]);
export type TaskCategory = z.infer<typeof taskCategorySchema>;

/* ── Subtask ─────────────────────────────────────────────────────────── */

export const subtaskSchema = z.object({
  title: z.string(),
  completed: z.boolean(),
});
export type Subtask = z.infer<typeof subtaskSchema>;

/* ── Task ────────────────────────────────────────────────────────────── */

export const taskSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().default(""),
  dueDate: z.string(), // ISO-Datum "YYYY-MM-DD"
  category: taskCategorySchema,
  priority: taskPrioritySchema,
  status: taskStatusSchema,
  assignedTo: z.array(z.string()).default([]),
  subtasks: z.array(subtaskSchema).default([]),
  createdAt: z.number().optional(),
});
export type Task = z.infer<typeof taskSchema>;

/* ── Contact ─────────────────────────────────────────────────────────── */

export const contactSchema = z.object({
  id: z.string(),
  firstname: z.string(),
  lastname: z.string(),
  email: z.string(),
  phonenumber: z.string().default(""),
});
export type Contact = z.infer<typeof contactSchema>;

/* ── User (so wie er in /users liegt) ────────────────────────────────── */

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  password: z.string(),
});
export type User = z.infer<typeof userSchema>;

/* ── Auth-Formulare ──────────────────────────────────────────────────── */

/** E-Mail-Regex wie im Original (register.js). */
export const EMAIL_REGEX =
  /^[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)*@[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)*\.[a-zA-Z]{2,}$/;

/**
 * Login: das Original prüft nur, ob die Felder ausgefüllt sind (kein
 * E-Mail-Format). Die kombinierte „beides leer"-Meldung erzeugt die
 * Login-Seite selbst.
 */
export const loginSchema = z.object({
  email: z.string().trim().min(1, "Please enter your email."),
  password: z.string().min(1, "Please enter your password."),
});
export type LoginInput = z.infer<typeof loginSchema>;

/** Registrierung: alle Regeln aus register.js, nun über Zod. */
export const registerSchema = z
  .object({
    name: z.string().trim().min(1, "* Please enter your name."),
    email: z
      .string()
      .trim()
      .min(1, "* please enter your email.")
      .regex(EMAIL_REGEX, " * Invalid email address."),
    password: z
      .string()
      .min(1, "* please enter your password.")
      .min(6, "* at least 6 characters."),
    confirmPassword: z.string().min(1, "* please confirm your password."),
    privacy: z.boolean(),
  })
  .refine((d) => d.privacy === true, {
    path: ["privacy"],
    message: "* Please accept the privacy policy.",
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "* password do not match, please try again!",
  });
export type RegisterInput = z.infer<typeof registerSchema>;

/**
 * Reduziert einen ZodError auf die erste Meldung pro Feld – entspricht dem
 * „eine Meldung pro Feld"-Verhalten des Originals.
 */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !(key in out)) {
      out[key] = issue.message;
    }
  }
  return out;
}
