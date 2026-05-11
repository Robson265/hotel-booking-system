import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterUserDto } from 'src/dto/register-user.dto';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from 'src/config/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
import { LoginUserDto } from 'src/dto/login-user.dto';


@Injectable()
export class AuthService {

        constructor(
            private prisma: PrismaService,
            private jwt: JwtService,
            private config: ConfigService,
            private userService: UsersService,

    ){}


        //register user
    async register(registeruserdto: RegisterUserDto){
        const existingUser = await this.prisma.user.findUnique({where:{email:registeruserdto.email}})

        if(existingUser){
            throw new BadRequestException("User Already Exist")
        }

        // const salt = await bcrypt.gensalt(12)
        const hash = await bcrypt.hash(registeruserdto.password, 12);

        // const userName: string = `${registeruserdto.firstName.trim()} ${registeruserdto.lastName.trim()}`;

        const user =  await this.userService.create({
            firstName: registeruserdto.firstName,
            lastName: registeruserdto.lastName,
            password: hash,
            confirmPassword: registeruserdto.confirmPassword,
            email: registeruserdto.email,
            phoneNumber: registeruserdto.phoneNumber,
        });

        // await this.sendVerificationEmail(user.id, user.email);

        return{ message: 'Registration Succefully, Please verify your email'};

    }

    //User Login
    async login(loginUserDto: LoginUserDto){
        const user = await this.prisma.user.findUnique({
            where:{email: loginUserDto.email}
        })

        if(!user){
            throw new BadRequestException("User Not Found")
        }

        const isPasswordValid = await bcrypt.compare(loginUserDto.password, user.password)

        if(!isPasswordValid){
            throw new UnauthorizedException("Invalid Password")
        }

        return this.issueTokens(user.id, user.email, user.role);
    }


    //Token Issurance

    async issueTokens(userId: string, email: string, role: string) {
        const accessSecret = this.config.getOrThrow<string>('JWT_ACCESS_SECRET');
        const refreshSecret = this.config.getOrThrow<string>('JWT_REFRESH_SECRET');
        const accessExpiresIn = this.config.getOrThrow<number>('JWT_ACCESS_TOKEN_EXPIRES_IN');
        const refreshExpiresIn = this.config.getOrThrow<number>('JWT_REFRESH_TOKEN_EXPIRES_IN');

        const accessToken = this.jwt.sign(
            { sub: userId, email, role },
            { secret: accessSecret, expiresIn: `${accessExpiresIn}m` },
        );

        const rawRefresh = uuidv4();
        const expiresAt = new Date(Date.now() + refreshExpiresIn * 86400 * 1000);

        await this.prisma.refreshToken.create({
        data: { token: rawRefresh, userId },
    });

    return { accessToken, refreshToken: rawRefresh };
}

    async refreshTokens(rawToken: string){
        const stored = await this.prisma.refreshToken.findUnique({
            where: {token: rawToken},
            include: {user: true},
        });

        if(!stored || stored.user.expiresAt< new Date()){
            throw new UnauthorizedException('Invalid or expired refresh token');
        }

        //delete old and issue new
        await this.prisma.refreshToken.delete({
            where:{token: rawToken}
        });

        return this.issueTokens(stored.userId, stored.user.email, stored.user.role);
    }

    //Email verification
    async sendVerificationEmail(userId: string, email: string){
        const verifySecret = this.config.get<string>('JWT_VERIFY_SECRET');
        if (!verifySecret) throw new UnauthorizedException('Missing JWT_VERIFY_SECRET');

        const token = this.jwt.sign(
            { sub: userId },
            {
                secret: verifySecret,
                expiresIn: '24h',
            },
        )
    }


    async verifyEmail(token: string){
        let payload: any;
        try{
            payload = this.jwt.verify(token,{
                secret:this.config.get('JWT_VERIFY_SECRET'),
            });
        }catch{
            throw new BadRequestException("Verification Link is Invalid or Expired");
        }

        await this.prisma.user.update({
            where: {id: payload.sub},
            data: {isEmailVerified: true}
        });

        return {message: "Email Verified Successfully"};
    }

}
