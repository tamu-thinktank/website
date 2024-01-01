import { faker } from "@faker-js/faker";
import { ApplicationStatus } from "@prisma/client";

export function fakeApplicant() {
  return {
    id: faker.string.uuid(),
    fullName: faker.person.fullName(),
    email: faker.internet.email(),
    submittedAt: faker.date.past(),
    status: faker.helpers.arrayElement(Object.values(ApplicationStatus)),
  };
}

export function fakeApplicants(count = 10) {
  return faker.helpers.multiple(fakeApplicant, {
    count,
  });
}
