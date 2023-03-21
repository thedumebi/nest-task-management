import { Controller, Post, Body } from '@nestjs/common'
import { AuthService } from './auth.service'
import {
  AuthCredentialsDto,
  LoginCredentialsDto
} from './dto/auth-credentials.dto'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signUp(@Body() authCredentials: AuthCredentialsDto): Promise<void> {
    return this.authService.signUp(authCredentials)
  }

  @Post('signin')
  signIn(
    @Body() authCredentials: LoginCredentialsDto
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(authCredentials)
  }
}
