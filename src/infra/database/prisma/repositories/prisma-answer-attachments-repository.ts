import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository'
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment'
import { Injectable } from '@nestjs/common'
import { PrismaAnswerAttachmentsMapper } from '../mappers/prisma-answer-attachments-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaAnswerAttachmentsRepository
  implements AnswerAttachmentsRepository {
  constructor(
    private prisma: PrismaService
  ) { }

  async findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]> {
    const answerAttachments = await this.prisma.attachment.findMany({
      where: {
        answerId
      },
    })

    return answerAttachments.map(PrismaAnswerAttachmentsMapper.toDomain)
  }

    async createMany(attachments: AnswerAttachment[]): Promise<void> {
      if (attachments.length === 0) {
        return
      }
  
      const data = PrismaAnswerAttachmentsMapper.toPrismaUpdateMany(attachments)
  
      await this.prisma.attachment.updateMany(data)
    }
    
    async deleteMany(attachments: AnswerAttachment[]): Promise<void> {
      if (attachments.length === 0) {
        return
      }
  
      const attachmentIds = attachments.map(attachments => {
        return attachments.id.toString()
      })
  
      await this.prisma.attachment.deleteMany({
        where: {
          id: {
            in: attachmentIds
          }
        }
      })
    }
  

  async deleteManyByAnswerId(answerId: string): Promise<void> {
    await this.prisma.attachment.deleteMany({
      where: {
        answerId,
      },
    })
  }
}
