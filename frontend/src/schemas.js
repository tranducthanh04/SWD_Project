import { z } from 'zod';

const passwordSchema = z
  .string()
  .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/, 'Mật khẩu phải gồm chữ hoa, chữ thường, số và ký tự đặc biệt');

export const loginSchema = z.object({
  identifier: z.string().min(1, 'Vui lòng nhập tên đăng nhập hoặc email'),
  password: z.string().min(1, 'Vui lòng nhập mật khẩu'),
});

export const registerSchema = z
  .object({
    username: z.string().min(3, 'Tên đăng nhập phải có ít nhất 3 ký tự'),
    email: z.string().email('Email không hợp lệ'),
    fullName: z.string().min(2, 'Họ và tên phải có ít nhất 2 ký tự'),
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu'),
    gender: z.enum(['male', 'female', 'other'], { message: 'Vui lòng chọn giới tính' }),
    role: z.enum(['jobseeker', 'enterprise'], { message: 'Vui lòng chọn vai trò' }),
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  });

export const forgotPasswordSchema = z.object({
  username: z.string().min(1, 'Vui lòng nhập tên đăng nhập'),
  email: z.string().email('Email không hợp lệ'),
});

export const resetPasswordSchema = z
  .object({
    username: z.string().min(1, 'Vui lòng nhập tên đăng nhập'),
    email: z.string().email('Email không hợp lệ'),
    code: z.string().length(6, 'Mã xác thực phải gồm 6 ký tự'),
    newPassword: passwordSchema,
    confirmNewPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu mới'),
  })
  .refine((value) => value.newPassword === value.confirmNewPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmNewPassword'],
  });

export const reportSchema = z.object({
  title: z.string().min(3, 'Tiêu đề phải có ít nhất 3 ký tự'),
  content: z.string().min(10, 'Nội dung phải có ít nhất 10 ký tự'),
});

export const profileSchema = z.object({
  fullName: z.string().min(2, 'Họ và tên phải có ít nhất 2 ký tự'),
  phone: z.string().optional(),
  address: z.string().optional(),
  dateOfBirth: z.string().optional(),
  experienceYears: z.coerce.number().min(0, 'Số năm kinh nghiệm không hợp lệ'),
  education: z.string().min(2, 'Vui lòng nhập học vấn'),
  summary: z.string().min(10, 'Tóm tắt chuyên môn phải có ít nhất 10 ký tự'),
  skills: z.string().min(2, 'Vui lòng nhập kỹ năng'),
  favouriteTags: z.string().optional(),
});

export const enterpriseProfileSchema = z.object({
  companyName: z.string().min(2, 'Tên doanh nghiệp phải có ít nhất 2 ký tự'),
  companyEmail: z.string().email('Email doanh nghiệp không hợp lệ'),
  companyPhone: z.string().min(5, 'Số điện thoại doanh nghiệp không hợp lệ'),
  companyAddress: z.string().min(4, 'Địa chỉ doanh nghiệp phải có ít nhất 4 ký tự'),
  taxCode: z.string().min(3, 'Mã số thuế phải có ít nhất 3 ký tự'),
  website: z.string().url('Website không hợp lệ'),
  description: z.string().min(10, 'Mô tả phải có ít nhất 10 ký tự'),
});

export const jobSchema = z.object({
  title: z.string().min(3, 'Tiêu đề phải có ít nhất 3 ký tự'),
  overview: z.string().min(10, 'Tổng quan phải có ít nhất 10 ký tự'),
  description: z.string().min(20, 'Mô tả phải có ít nhất 20 ký tự'),
  requirements: z.string().min(5, 'Vui lòng nhập yêu cầu tuyển dụng'),
  benefits: z.string().optional(),
  location: z.string().min(2, 'Vui lòng nhập địa điểm làm việc'),
  salaryMin: z.coerce.number().min(0, 'Mức lương tối thiểu không hợp lệ'),
  salaryMax: z.coerce.number().min(0, 'Mức lương tối đa không hợp lệ'),
  currency: z.string().min(3, 'Vui lòng nhập đơn vị tiền tệ'),
  experienceLevel: z.string().min(1, 'Vui lòng chọn cấp độ kinh nghiệm'),
  jobType: z.string().min(1, 'Vui lòng chọn hình thức làm việc'),
  tags: z.string().min(1, 'Vui lòng nhập thẻ'),
  applicationDeadline: z.string().min(1, 'Vui lòng chọn hạn nộp hồ sơ'),
});

export const tagSchema = z.object({
  name: z.string().min(2, 'Tên thẻ phải có ít nhất 2 ký tự'),
  description: z.string().optional(),
});