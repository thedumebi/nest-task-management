import {
  ConflictException,
  Injectable,
  InternalServerErrorException
} from '@nestjs/common'
import { DataSource, Repository } from 'typeorm'
import { AuthCredentialsDto } from './dto/auth-credentials.dto'
import { User } from './user.entity'
import * as bcrypt from 'bcrypt'

@Injectable()
export class UsersRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager())
  }

  async createUser(authCredentials: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentials

    // hash
    const salt = await bcrypt.genSalt(12)
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = this.create({ username, password: hashedPassword })

    try {
      await this.save(user)
    } catch (err) {
      if (err.code === '23505') {
        // duplicate username
        throw new ConflictException('Username already exists')
      } else {
        throw new InternalServerErrorException()
      }
    }
  }
}
