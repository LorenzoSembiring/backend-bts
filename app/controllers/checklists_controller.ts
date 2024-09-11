import type { HttpContext } from '@adonisjs/core/http'
import Checklist from '#models/checklist'

export default class ChecklistsController {
  public async index({ response, auth }: HttpContext) {
    const user = await auth.authenticate()
    if (!user) {
      return response.status(401).json({
        code: '401',
        status: 'unauthorized'
      })
    }
    try {
      const data = await Checklist.all()
      if(!data[0]) {
        return response.status(404).json({
          code: '404',
          status: "not found",
          message: "data not found"
        })
      }
      return response.status(200).json({
        code: '200',
        status: "success",
        data: data
      })
    } catch (error) {
      return response.status(500).json({
        code: '500',
        message: error,
      })
    }
  }

  public async store({ request, response, auth }: HttpContext) {
    const { name } = request.body()
    const user = await auth.authenticate()
    try {
      if (!user) {
        return response.status(401).json({
          code: '401',
          status: 'unauthorized'
        })
      }
      const created = await Checklist.create({
        name: name
      })

      return response.status(201).json({
        code: '201',
        status: 'created',
        data: created
      })
    } catch (error) {
      return response.status(500).json({
        code: '500',
        message: error,
      })
    }
  }

  public async delete({ params, response, auth }: HttpContext) {
    const user = await auth.authenticate()
    if (!user) {
      return response.status(401).json({
        code: '401',
        status: 'unauthorized'
      })
    }
    try {
      const data = await Checklist.findOrFail(params.id)
      if (!data) {
        return response.status(404).json({
          code: '404',
          status: "not found",
          message: "data not found"
        })
      }
      await data.delete()

      return response.status(200).json({
        code: '200',
        message: "delete success",
      })
    } catch (error) {
      return response.status(500).json({
        code: '500',
        message: error,
      })
    }
  }
}
