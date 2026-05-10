import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from 'src/dto/register-user.dto';

const DEVICE_COOKIE = 'device_id';
const REFRESH_COOKIE = 'refresh_token';

const refreshCookiesOptions = {
    httpOnly:true, //js cannot read it
    secure: true, //HTTPS only
    sameSite: 'strict' as const,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
    path: '/auth', //only sent to /auth/* routes
};


const deviceCookieOptions = {
    httpOnly: false,
    secure: false,
    sameSite: 'lax' as const,
    maxAge: 365 * 24 * 60 * 60 * 1000,
};

@Controller('auth')
@UseGuards(JwtAuthGuard, RolesGuard)// apply both guards
export class AuthController {

    constructor(
        private authservice: AuthService
    ){}


    @Post("register")
    async register(
        @Body() registeruserdto: RegisterUserDto,
        @Res({ passthrough: true }) res: express.Response,
    
    )
    {
        const {refresh_tokens, device_id, ...data } =
            await this.authservice.register(registeruser);

        res.cookie(DEVICE_COOKIE, device_id, deviceCookieOptions);
        res.cookie(REFRESH_COOKIE, refresh_tokens, refreshCookiesOptions);

        return { success: true, data };
    }
}
