import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository'
import { DomainEvents } from '@/core/events/domain-events'
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/values-objects/comment-with-author'
import { InMemoryStudentsRepository } from './in-memory-student-repository'

export class InMemoryAnswerCommentsRepository
  implements AnswerCommentsRepository {
  public items: AnswerComment[] = []

  constructor(
    private studentRepository: InMemoryStudentsRepository,
  ) {

  }

  async findById(id: string) {
    const answerComment = this.items.find((item) => item.id.toString() === id)

    if (!answerComment) {
      return null
    }

    return answerComment
  }

  async findManyByAnswerIdWithAuthor(answerId: string, { page }: PaginationParams) {
    const answerComments = this.items
      .filter((answer) => answer.answerId.toString() === answerId)
      .slice((page - 1) * 20, page * 20)
      .map(comment => {
        const author = this.studentRepository.items.find(student => student.id.equals(comment.authorId))

        if (!author) {
          throw new Error('Author not found')
        }

        return CommentWithAuthor.create({
          authorId: comment.authorId,
          commentId: comment.id,
          content: comment.content,
          createdAt: comment.createdAt,
          updatedAt: comment.updatedAt,
          author: author.name
        })
      })

    return answerComments
  }

  async findManyByAnswerId(answerId: string, { page }: PaginationParams) {
    const answerComments = this.items
      .filter((answer) => answer.answerId.toString() === answerId)
      .slice((page - 1) * 20, page * 20)

    return answerComments
  }

  async create(answerComment: AnswerComment) {
    this.items.push(answerComment)

    DomainEvents.dispatchEventsForAggregate(answerComment.id)
  }

  async delete(answerComment: AnswerComment) {
    const itemIndex = this.items.findIndex(
      (item) => item.id === answerComment.id,
    )

    this.items.splice(itemIndex, 1)
  }
}
