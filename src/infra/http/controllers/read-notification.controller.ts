import { BadRequestException, Controller, HttpCode, Param, Patch } from '@nestjs/common'
import { ReadNotificationUseCase } from '@/domain/notification/application/use-cases/read-notification'
import { CurrentUser } from '@/infra/auth/curreent-user-decoration'
import { UserPayload } from '@/infra/auth/jwt.strategy'


@Controller('/notifications/:notificationId/read')
export class ReadNotificationController {
    constructor(private readNotification: ReadNotificationUseCase) { }

    @Patch()
    @HttpCode(204)
    async handle(
        @CurrentUser() user: UserPayload,
        @Param("slug") slug: string
    ) {
        const result = await this.readNotification.execute({
            notificationId: slug,
            recipientId: user.sub
        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }

    }
}
