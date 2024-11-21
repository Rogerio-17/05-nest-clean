import { InMemoryStudentsRepository } from 'test/repositories/in-memory-student-repository'
import { FakeHasher } from 'test/cryptography/fake-haser'
import { FakeEncrypter } from 'test/cryptography/fake-encrypter'
import { AuthenticateStudentUseCase } from './authenticate-student'
import { makeStudent } from 'test/factories/make-student'

let inMemoryStudentsRepository: InMemoryStudentsRepository
let fakeHasher: FakeHasher
let fakeEncrypter: FakeEncrypter

let sut: AuthenticateStudentUseCase

describe('Authenticate Student', () => {
    beforeEach(() => {
        inMemoryStudentsRepository = new InMemoryStudentsRepository()
        fakeHasher = new FakeHasher()
        fakeEncrypter = new FakeEncrypter()
        sut = new AuthenticateStudentUseCase(inMemoryStudentsRepository, fakeHasher, fakeEncrypter)
    })

    it('should be able to authenticate a student', async () => {
        const student = makeStudent({
            email: 'teste@teste.com',
            password: await fakeHasher.hash('456123')
        })

        await inMemoryStudentsRepository.create(student)

        const result = await sut.execute({
            email: 'teste@teste.com',
            password: '456123'
        })

        expect(result.isRight()).toBe(true)
        expect(result.value).toEqual({
            accessToken: expect.any(String)
        })
    })

})
