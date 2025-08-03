import express from 'express'
import { columnValidation } from '~/validations/columnValidation'
import { columnController } from '~/controllers/columnController'

const Route = express.Router()

Route.route('/')
  .post(columnValidation.createNew, columnController.createNew)
export const columnRoute = Route