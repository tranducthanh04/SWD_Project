import { z } from 'zod';

const passwordSchema = z
  .string()
  .min(8)
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/, 'Password must include uppercase, lowercase, number, and special character');

export const loginSchema = z.object({
  identifier: z.string().min(1, 'Username or email is required'),
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z
  .object({
    username: z.string().min(3),
    email: z.string().email(),
    fullName: z.string().min(2),
    password: passwordSchema,
    confirmPassword: z.string(),
    gender: z.enum(['male', 'female', 'other']),
    role: z.enum(['jobseeker', 'enterprise']),
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const forgotPasswordSchema = z.object({
  username: z.string().min(1),
  email: z.string().email(),
});

export const resetPasswordSchema = z
  .object({
    username: z.string().min(1),
    email: z.string().email(),
    code: z.string().length(6),
    newPassword: passwordSchema,
    confirmNewPassword: z.string(),
  })
  .refine((value) => value.newPassword === value.confirmNewPassword, {
    message: 'Passwords do not match',
    path: ['confirmNewPassword'],
  });

export const reportSchema = z.object({
  title: z.string().min(3),
  content: z.string().min(10),
});

export const profileSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().optional(),
  address: z.string().optional(),
  dateOfBirth: z.string().optional(),
  experienceYears: z.coerce.number().min(0),
  education: z.string().min(2),
  summary: z.string().min(10),
  skills: z.string().min(2),
  favouriteTags: z.string().optional(),
});

export const enterpriseProfileSchema = z.object({
  companyName: z.string().min(2),
  companyEmail: z.string().email(),
  companyPhone: z.string().min(5),
  companyAddress: z.string().min(4),
  taxCode: z.string().min(3),
  website: z.string().url(),
  description: z.string().min(10),
});

export const jobSchema = z.object({
  title: z.string().min(3),
  overview: z.string().min(10),
  description: z.string().min(20),
  requirements: z.string().min(5),
  benefits: z.string().optional(),
  location: z.string().min(2),
  salaryMin: z.coerce.number().min(0),
  salaryMax: z.coerce.number().min(0),
  currency: z.string().min(3),
  experienceLevel: z.string().min(1),
  jobType: z.string().min(1),
  tags: z.string().min(1),
  applicationDeadline: z.string().min(1),
});

export const tagSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
});
