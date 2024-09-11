import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'

export default class AuthController {

  public async register({ request, response }: HttpContext) {
    const { email, password, username } = request.body()

    const existedUser = await User.query().where({ email: email }).first()
    if (existedUser) {
      return response.status(409).json({
        message: 'Email already taken',
      })
    }

    const user = await User.create({
      email: email,
      password: password,
      username: username,
    })

    const token = await User.accessTokens.create(user, ['*'], {
      expiresIn: '30 days',
    })

    return response.status(200).json({
      code: '200',
      message: 'user successfully registered',
      data: {
        user,
        token,
      },
    })
  }
  public async login({ request, response }: HttpContext) {
    const { username , password } = request.body()

    const user = await User.findBy('username', username)
    try {
      if (!user) {
        return response.status(401).json({
          code: '401',
          message: 'Invalid username or password',
        })
      }

      if (!(await hash.verify(user.password, password))) {
        return response.status(401).json({
          code: '401',
          message: 'Invalid username or password',
        })
      }

      const token = await User.accessTokens.create(user, ['*'], {
        expiresIn: '30 days',
      })
      return response.status(200).json({
        code: '200',
        message: 'login success',
        data: {
          user,
          token,
        },
      })
    } catch (error) {
      return response.status(500).json({
        code: '500',
        message: error,
      })
    }
  }
}
