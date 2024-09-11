import type { HttpContext } from '@adonisjs/core/http'
import Item from '#models/item'

export default class ItemsController {
  public async index({ params, response, auth }: HttpContext) {
    const user = await auth.authenticate()
    if (!user) {
      return response.status(401).json({
        code: '401',
        status: 'unauthorized'
      })
    }
    try {
      const data = await Item.query().where('checklist_id', params.checklistId)
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
  public async store({ params, request, response, auth}: HttpContext) {
    const {itemName} = request.body()
    const user = await auth.authenticate()
    if (!user) {
      return response.status(401).json({
        code: '401',
        status: 'unauthorized'
      })
    }
    try {
      const created = await Item.create({
        name: itemName,
        status: "created",
        checklist_id: params.checklistId
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
  public async get({ params, response, auth }: HttpContext) {
    const user = await auth.authenticate()
    if (!user) {
      return response.status(401).json({
        code: '401',
        status: 'unauthorized'
      })
    }
    try {
      const data = await Item.findManyBy({id: params.checklistItemId, checklist_id: params.checklistId})
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
  public async updateStatus({ params, response, auth }: HttpContext) {
    const user = await auth.authenticate()
    if (!user) {
      return response.status(401).json({
        code: '401',
        status: 'unauthorized'
      })
    }
    try {
      const data = await Item.findBy('id', params.checklistItemId)
      if(data?.checklist_id != params.checklistId) {
        return response.status(403).json({
          code: '403',
          status: 'forbidden'
        })
      }
      if(data) {
        data.status = "complete"
        await data.save()
      }
      return response.status(200).json({
        code: '200',
        status: "success",
        message: "update success"
      })
    } catch (error) {
      return response.status(500).json({
        code: '500',
        message: error.message,
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
      const data = await Item.findBy('id', params.checklistItemId)
      if(data?.checklist_id != params.checklistId) {
        return response.status(403).json({
          code: '403',
          status: 'forbidden'
        })
      }
      if(data) {
        await data.delete()
      }
      return response.status(200).json({
        code: '200',
        status: "success",
        message: "delete success"
      })
    } catch (error) {
      return response.status(500).json({
        code: '500',
        message: error.message,
      })
    }
  }
  public async rename({ params, request, response, auth }: HttpContext) {
    const user = await auth.authenticate()
    if (!user) {
      return response.status(401).json({
        code: '401',
        status: 'unauthorized'
      })
    }
    const itemName = request.body()
    try {
      const data = await Item.findBy('id', params.checklistItemId)
      if(data?.checklist_id != params.checklistId) {
        return response.status(403).json({
          code: '403',
          status: 'forbidden'
        })
      }
      if(data) {
        data.name = itemName.itemName
        await data.save()
      }
      return response.status(200).json({
        code: '200',
        status: "success",
        message: "update success"
      })
    } catch (error) {
      return response.status(500).json({
        code: '500',
        message: error.message,
      })
    }
  }
}
