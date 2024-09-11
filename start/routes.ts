/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import AuthController from '#controllers/auth_controller'
import ChecklistsController from '#controllers/checklists_controller'
import ItemsController from '#controllers/items_controller'

router.get('/', async () => {
  return {
    hello: 'world',
  }
})
router.post('/register',[AuthController, 'register'])
router.post('/login',[AuthController, 'login'])

router.get('/checklist',[ChecklistsController, 'index'])
router.post('/checklist',[ChecklistsController, 'store'])
router.delete('/checklist/:id',[ChecklistsController, 'delete'])

router.get('/checklist/:checklistId/item', [ItemsController, 'index'])
router.post('/checklist/:checklistId/item', [ItemsController, 'store'])
router.get('/checklist/:checklistId/item/:checklistItemId', [ItemsController, 'get'])
router.put('/checklist/:checklistId/item/:checklistItemId', [ItemsController, 'updateStatus'])
router.delete('/checklist/:checklistId/item/:checklistItemId', [ItemsController, 'delete'])
router.put('/checklist/:checklistId/item/rename/:checklistItemId', [ItemsController, 'rename'])
