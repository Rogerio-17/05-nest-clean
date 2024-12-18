import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { InvalidAttachmentTypeError } from './errors/invalid-attachment-type'
import { Attachment } from '../../enterprise/entities/attachment'
import { Uploader } from '../storage/uploader'
import { AttachmentsRepository } from '../repositories/attachments-repository'

interface UploadCreateAndAttachmentUseCaseRequest {
    fileName: string
    fileType: string
    body: Buffer
}

type UploadCreateAndAttachmentUseCaseResponse = Either<
    InvalidAttachmentTypeError,
    {
        attachment: Attachment
    }
>

@Injectable()
export class UploadCreateAndAttachmentUseCase {
    constructor(
        private attachmentRepository: AttachmentsRepository,
        private uploader: Uploader,
    ) { }

    async execute({
        fileName,
        fileType,
        body,
    }: UploadCreateAndAttachmentUseCaseRequest): Promise<UploadCreateAndAttachmentUseCaseResponse> {
        if (!/^(image\/(jpeg|png))$|^application\/pdf$/.test(fileType)) {
            return left(new InvalidAttachmentTypeError(fileType))
        }

        const { url } = await this.uploader.upload({
            fileName,
            fileType,
            body,
        })

        const attachment = Attachment.create({
            title: fileName,
            url
        })

        await this.attachmentRepository.create(attachment)

        return right({
            attachment,
        })
    }
}
