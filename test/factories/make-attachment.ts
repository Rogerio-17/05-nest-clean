import { faker } from '@faker-js/faker'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PrismaAttachmentMapper } from '@/infra/database/prisma/mappers/prisma-attachment-mapper'
import { Attachment, AttachmentProps } from '@/domain/forum/enterprise/entities/attachment'

export function makeAttachment(
    overrides: Partial<AttachmentProps> = {},
    id?: UniqueEntityID,
) {
    const attachment = Attachment.create(
        {
            title: faker.lorem.slug(),
            url: faker.lorem.slug(),
            ...overrides,
        },
        id,
    )

    return attachment
}


@Injectable()
export class AttachmentFactory {
    constructor(private prisma: PrismaService) { }

    async makePrismaAttachment(data: Partial<AttachmentProps> = {}): Promise<Attachment> {
        const attachment = makeAttachment(data)

        await this.prisma.attachment.create({
            data: PrismaAttachmentMapper.toPrisma(attachment)
        })

        return attachment
    }
}