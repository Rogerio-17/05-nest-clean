import { BadRequestException, Controller, Get, Param, Query } from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { FetchQuestionCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-question-comments'
import { CommentWithAuthorPresenter } from '../presenters/comment-with-author-presenter'

const pageQueryParamsSchema = z
    .string()
    .optional()
    .default('1')
    .transform(Number)
    .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamsSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamsSchema>

@Controller('/questions/:id/comments')
export class FetchQuestionCommentsController {
    constructor(private FetchQuestionComments: FetchQuestionCommentsUseCase) { }

    @Get()
    async handle(
        @Query('page', queryValidationPipe) page: PageQueryParamSchema,
        @Param('id') questionId: string
    ) {
        const result = await this.FetchQuestionComments.execute({
            questionId,
            page,
        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }

        const comments = result.value.comments

        return { comments: comments.map(CommentWithAuthorPresenter.toHTTP) }
    }
}
