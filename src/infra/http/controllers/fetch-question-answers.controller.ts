import { BadRequestException, Controller, Get, Param, Query } from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { QuestionPresenter } from '../presenters/question-presenter'
import { FetchQuestionAnswersUseCase } from '@/domain/forum/application/use-cases/fetch-question-answer'
import { AnswerPresenter } from '../presenters/answers-presenter'

const pageQueryParamsSchema = z
    .string()
    .optional()
    .default('1')
    .transform(Number)
    .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamsSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamsSchema>

@Controller('/questions/:id/answers')
export class FetchQuestionAnswersController {
    constructor(private fetchQuestionAnswers: FetchQuestionAnswersUseCase) { }

    @Get()
    async handle(
        @Query('page', queryValidationPipe) page: PageQueryParamSchema,
        @Param('id') questionId: string
    ) {
        const result = await this.fetchQuestionAnswers.execute({
            questionId,
            page,
        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }

        const answers = result.value.answers

        return { answers: answers.map(AnswerPresenter.toHTTP) }
    }
}
