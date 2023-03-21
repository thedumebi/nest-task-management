import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength
} from 'class-validator'

export class AuthCredentialsDto {
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  username: string

  @IsString()
  @MinLength(6)
  @MaxLength(32)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password is too weak'
  })
  password: string
}

export class LoginCredentialsDto {
  @IsNotEmpty()
  username: string

  @IsNotEmpty()
  password: string
}
