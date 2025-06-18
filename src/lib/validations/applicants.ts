import { z } from 'zod';
import { DCMemberApplyFormSchema } from './dcmember-apply';
import { statusSchema } from './apply';

/**
 * For list of applicants in admin page
 */
export const ApplicantsSchema = z.array(
  z.object({
    id: z.string().cuid2(),
    fullName: z.string(),
    email: z.string().email(),
    submittedAt: z.date(),
    status: statusSchema,
  }),
);

/**
 * For applicant detail page
 */
export const ApplicantSchema = DCMemberApplyFormSchema.and(
  z.object({
    submittedAt: z.date(),
    status: statusSchema,
    location: z.string().nullable(),
  }),
);