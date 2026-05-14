import { PipeTransform, BadRequestException } from "@nestjs/common";


const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
// const MAX_SIZE_BYTES = process.env.MAX_SIZE_BYTES

export class FileValidationPipe implements PipeTransform {
    transform(file: Express.Multer.File) {

    if (!file) {
        throw new BadRequestException('No file uploaded');
    }

    if (!ALLOWED_TYPES.includes(file.mimetype)) {
        throw new BadRequestException('Only JPEG, PNG, and WebP allowed');
    }

    if (file.size > MAX_SIZE_BYTES) {
        throw new BadRequestException('File must be under 5 MB');
    }
    
    return file;
    }
}