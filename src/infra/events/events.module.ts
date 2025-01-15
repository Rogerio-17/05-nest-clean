import { OnAnswerCommentCreated } from "@/domain/notification/application/subscribers/on-answer-comment-created";
import { OnQuestionBestAnswerChosen } from "@/domain/notification/application/subscribers/on-question-best-answer-chosen";
import { SendNotificationUseCase } from "@/domain/notification/application/use-cases/send-notification";
import { DatabaseModule } from "@faker-js/faker/.";
import { Module } from "@nestjs/common";


@Module({
    imports: [DatabaseModule],
    providers: [
        OnAnswerCommentCreated,
        OnQuestionBestAnswerChosen,
        SendNotificationUseCase,
    ],
})

export class EventsModule {}