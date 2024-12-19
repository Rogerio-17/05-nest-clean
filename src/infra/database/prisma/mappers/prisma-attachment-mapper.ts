import { Attachment } from '@/domain/forum/enterprise/entities/attachment'
import { Prisma } from '@prisma/client'

export class PrismaAttachmentMapper {

  static toPrisma(attachments: Attachment): Prisma.AttachmentUncheckedCreateInput {
    return {
        id: attachments.id.toValue(),
        title: attachments.title,
        url: attachments.url
    }
  }
}
