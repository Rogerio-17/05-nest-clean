import { BadRequestException, Controller, Get, Param, Query } from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { CommentPresenter } from '../presenters/comment-presenter'
import { FetchAnswerCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-answer-comments'
import { CommentWithAuthorPresenter } from '../presenters/comment-with-author-presenter'

const pageQueryParamsSchema = z
    .string()
    .optional()
    .default('1')
    .transform(Number)
    .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamsSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamsSchema>

@Controller('/answers/:id/comments')
export class FetchAnswerCommentsController {
    constructor(private FetchAnswerComments: FetchAnswerCommentsUseCase) { }

    @Get()
    async handle(
        @Query('page', queryValidationPipe) page: PageQueryParamSchema,
        @Param('id') answerId: string
    ) {
        const result = await this.FetchAnswerComments.execute({
            answerId,
            page,
        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }

        const comments = result.value.comments

        return { comments: comments.map(CommentWithAuthorPresenter.toHTTP) }
    }
}
