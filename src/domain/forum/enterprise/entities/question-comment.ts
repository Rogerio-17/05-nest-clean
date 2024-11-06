import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { CommentProps } from './comment'
import { AggregateRoot } from '@/core/entities/aggregate-root'
import { QuestionCommentCreatedEvent } from '../events/question-comment-created-event'

export interface QuestionCommentProps extends CommentProps {
  questionId: UniqueEntityID
}

export class QuestionComment extends AggregateRoot<QuestionCommentProps> {
  get questionId() {
    return this.props.questionId
  }

  get content() {
    return this.props.content
  }

  get authorId() {
    return this.props.authorId
  }

  static create(
    props: Optional<QuestionCommentProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const questionComment = new QuestionComment(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    const isNewQuestionComment = !id

    if (isNewQuestionComment) {
      questionComment.addDomainEvent(
        new QuestionCommentCreatedEvent(questionComment),
      )
    }

    return questionComment
  }
}
