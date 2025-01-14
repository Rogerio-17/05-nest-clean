import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AttachmentFactory } from 'test/factories/make-attachment'
import { QuestionFactory } from 'test/factories/make-question'
import { QuestionAttachmentFactory } from 'test/factories/make-question-attachment'
import { StudentFactory } from 'test/factories/make-student'

describe('Get Question By Slug (E2E)', () => {
    let app: INestApplication
    let studentFactory: StudentFactory
    let questionFactory: QuestionFactory
    let attachmentsFactory: AttachmentFactory
    let questionAttachmentFactory: QuestionAttachmentFactory
    let jwt: JwtService

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule, DatabaseModule],
            providers: [StudentFactory, QuestionFactory, AttachmentFactory, QuestionAttachmentFactory]
        }).compile()

        app = moduleRef.createNestApplication()
        studentFactory = moduleRef.get(StudentFactory)
        questionFactory = moduleRef.get(QuestionFactory)
        attachmentsFactory = moduleRef.get(AttachmentFactory)
        questionAttachmentFactory = moduleRef.get(QuestionAttachmentFactory)
        jwt = moduleRef.get(JwtService)

        await app.init()
    })

    test('[GET] /questions/:slug', async () => {
        const user = await studentFactory.makePrismaStudent({
            name: 'John Doe',
        })

        const accessToken = jwt.sign({ sub: user.id.toString() })

        const question = await questionFactory.makePrismaQuestion({
            authorId: user.id,
            title: 'Question 1'
        })

        const attachment = await attachmentsFactory.makePrismaAttachment({
            title: 'Some attachment'
        })

        await questionAttachmentFactory.makePrismaQuestionAttachment({
            questionId: question.id,
            attachmentId: attachment.id
        })

        const response = await request(app.getHttpServer())
            .get(`/questions/${question.slug.value}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send()

        expect(response.status).toBe(200)
        expect(response.body).toEqual({
            question: expect.objectContaining(
                {
                    title: 'Question 1',
                    author: 'John Doe',
                    attachments: [
                        expect.objectContaining({
                            title: 'Some attachment'
                        })
                    ]
                }
            )
        })
    })
})
