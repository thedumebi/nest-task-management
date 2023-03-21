import { Injectable, UnauthorizedException } from '@nestjs/common'
import {
  AuthCredentialsDto,
  LoginCredentialsDto
} from './dto/auth-credentials.dto'
import { UsersRepository } from './users.repository'
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'
import { JwtPayload } from './jwt-payload.interface'

@Injectable()
export class AuthService {
  constructor(
    private usersRepository: UsersRepository,
    private jwtService: JwtService
  ) {}

  async signUp(authCredentials: AuthCredentialsDto): Promise<void> {
    return this.usersRepository.createUser(authCredentials)
  }

  async signIn(
    authCredentials: LoginCredentialsDto
  ): Promise<{ accessToken: string }> {
    const { username, password } = authCredentials
    const user = await this.usersRepository.findOneBy({ username })

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { username }
      const accessToken: string = this.jwtService.sign(payload)
      return { accessToken }
    } else {
      throw new UnauthorizedException('Please check your login credentials')
    }
  }
}
