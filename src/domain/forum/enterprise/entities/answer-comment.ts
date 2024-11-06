import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { CommentProps } from './comment'
import { AggregateRoot } from '@/core/entities/aggregate-root'
import { AnswerCommentCreatedEvent } from '../events/answer-comment-created-event'

export interface AnswerCommentProps extends CommentProps {
  answerId: UniqueEntityID
}

export class AnswerComment extends AggregateRoot<AnswerCommentProps> {
  get answerId() {
    return this.props.answerId
  }

  get content() {
    return this.props.content
  }

  get authorId() {
    return this.props.authorId
  }

  static create(
    props: Optional<AnswerCommentProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const answerComment = new AnswerComment(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    const isNewAnswerComment = !id

    if (isNewAnswerComment) {
      answerComment.addDomainEvent(new AnswerCommentCreatedEvent(answerComment))
    }

    return answerComment
  }
}
