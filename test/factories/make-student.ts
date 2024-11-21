import { faker } from '@faker-js/faker'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Student, StudentProps } from '@/domain/forum/enterprise/entities/student'

export function makeStudent(
  overrides: Partial<StudentProps> = {},
  id?: UniqueEntityID,
) {
  const student = Student.create(
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      ...overrides,
    },
    id,
  )

  return student
}
