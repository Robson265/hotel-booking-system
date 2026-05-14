import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

@Injectable()
export class UploadService {

        private s3: S3Client;  // 👈 declare it here

    constructor(private readonly prisma: PrismaService) {
            this.s3 = new S3Client({ region: process.env.AWS_REGION });
    }

    async uploadAvatar(file: Express.Multer.File | undefined, userId: string) {
    if (!file) {
        // No file sent — clear any existing avatar, frontend handles initials
        return this.prisma.profile.update({
            where: { userId },
            data: { avatarUrl: null, avatarKey: null },
        });
    }

    // File sent — upload to S3 and store URL
    const MIME_TO_EXT: Record<string, string> = {
        'image/jpeg': 'jpg',
        'image/png': 'png',
        'image/webp': 'webp',
    };
    const ext = MIME_TO_EXT[file.mimetype] ?? 'bin';
    const key = `avatars/${userId}/${uuidv4()}.${ext}`;

    await this.s3.send(new PutObjectCommand({
        Bucket: process.env.S3_BUCKET,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
    }));

    const url = `https://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    return this.prisma.profile.update({
        where: { userId },
        data: { avatarUrl: url, avatarKey: key },
    });
}

    }
