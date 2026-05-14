import { Controller, Post, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { FileValidationPipe } from 'src/file-validation.pipe';
import { User } from 'src/generated/prisma/client';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {

    constructor(
        private uploadService: UploadService
    ){}
    
    @Post('avatar')
@UseInterceptors(FileInterceptor('avatar'))
    async uploadAvatar(
        @UploadedFile(new FileValidationPipe()) file: Express.Multer.File | undefined,
        @Req() req,
    ) {
        return this.uploadService.uploadAvatar(file, req.user.id);
}
}


