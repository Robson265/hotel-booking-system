import { Body, Controller, Get, Patch, Post, Query  } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from 'src/dto/register-user.dto';
import { LoginUserDto } from 'src/dto/login-user.dto';

@Controller('auth')
export class AuthController {
    
    constructor(
        private authService: AuthService
    ){}

    @Post("/register")
    register(@Body() registerUserDto: RegisterUserDto){
        return this.authService.register(registerUserDto)
    }

    @Post("/login")
    login(@Body() loginUserDto: LoginUserDto){
        return this.authService.login(loginUserDto)
    }

    @Post("/refresh")
    refresh(@Body('refreshToken')token: string){
        return this.authService.refreshTokens(token)
    }
  
    @Post("/logout")
    logout(){}

    @Post("auth/verify-email/:token")
    verifyEmail(@Query("token") token: string){
        return this.authService.verifyEmail(token)
    }

    @Post("/forgot-password")
    forgotPassword(){}


    @Post("/reset-password")
    resetPassword(){}

    @Get("/users/me")
    findUser(){}

    @Patch("/users/me")
    updateProfile(){}

    @Patch("/users/me/password")
    changePassword(){}
}
