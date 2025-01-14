import { BadRequestException, Body, Controller, HttpCode, Param, Patch, Put } from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/curreent-user-decoration'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ChooseQuestionBestAnswerUseCase } from '@/domain/forum/application/use-cases/choose-question-best-answer'

@Controller('/answers/:answerId/choose-best-answer')
export class ChooseQuestionBestAnswerController {
  constructor(private chooseQuestionBestAnswer: ChooseQuestionBestAnswerUseCase) {}

  @Patch()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('answerId') answerId: string
  ) {
    const userId = user.sub

    const result = await this.chooseQuestionBestAnswer.execute({
        authorId: userId,
        answerId
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
