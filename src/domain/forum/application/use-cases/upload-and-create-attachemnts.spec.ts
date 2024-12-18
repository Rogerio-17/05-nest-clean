import { UploadCreateAndAttachmentUseCase } from './upload-and-create-attachemnts'
import { FakeUploader } from 'test/storage/fake-uploader'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import exp from 'constants'
import { InvalidAttachmentTypeError } from './errors/invalid-attachment-type'

let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let fakeUploader: FakeUploader
let sut: UploadCreateAndAttachmentUseCase

describe('Upload and create attachment', () => {
    beforeEach(() => {
        inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
        fakeUploader = new FakeUploader()
        sut = new UploadCreateAndAttachmentUseCase(inMemoryAttachmentsRepository, fakeUploader)
    })

    it('should be able to upload and create an attachment', async () => {
        const result = await sut.execute({
            fileName: 'file.png',
            fileType: 'image/png',
            body: Buffer.from('')
        })

        expect(result.isRight()).toBe(true)
        expect(result.value).toEqual({
            attachment: inMemoryAttachmentsRepository.items[0]
        })
        expect(fakeUploader.uploads).toHaveLength(1)
        expect(fakeUploader.uploads[0]).toEqual(
            expect.objectContaining({
                fileName: 'file.png',
            })
        )
    })

     it('should not be able to upload an attachment with invalid file type', async () => {
         const result = await sut.execute({
            fileName: 'file.mp3',
            fileType: 'audio/mp3',
            body: Buffer.from('')
         })

         expect(result.isLeft()).toBe(true)
         expect(result.value).toBeInstanceOf(InvalidAttachmentTypeError)
     })

})
