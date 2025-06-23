import { z } from "zod";
import { ApplicationStatus, Year, Major } from "@prisma/client";

export const statusSchema = z.nativeEnum(ApplicationStatus);
export const yearSchema = z.nativeEnum(Year);
export const majorSchema = z.nativeEnum(Major);
export const PRESET_PRONOUNS = ["HE_HIM", "SHE_HER", "THEY_THEM"] as const;
export const PRESET_GENDERS = ["MALE", "FEMALE", "NON_BINARY"] as const;
export const wordCount = (text: string) => 
  text.trim().split(/\s+/).filter(Boolean).length;
export const validateSignature = (signature: string, fullName: string): boolean => {
  const [firstName = "", lastName = ""] = fullName.toLowerCase().split(' ');
  return signature.toLowerCase().includes(firstName) || 
         signature.toLowerCase().includes(lastName);
};
export const classSchema = z.object({
  value: z.string().refine(
    cls => /^(?:[A-Z]{4} \d{3}|[A-Z]{4}b\d{4}|NULL 101)$/.test(cls),
    "Invalid class format. Use 'XXXX 123' or 'XXXXb1234' (for Blinn) or 'NULL 101' if courses are withheld.",
  )
})

/**
 * Map of gridTimes from db to officers available at that time
 */
export const AvailabilityMapSchema = z.map(
  z.string(),
  z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      email: z.string(),
      selectedAt: z.string(),
    }),
  ),
);
export type AvailabilityMap = z.infer<typeof AvailabilityMapSchema>;