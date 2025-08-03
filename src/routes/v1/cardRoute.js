import express from 'express'
import { cardValidation } from '~/validations/cardValidation'
import { cardController } from '~/controllers/cardController'

const Route = express.Router()

Route.route('/')
  .post(cardValidation.createNew, cardController.createNew)
export const cardRoute = Route