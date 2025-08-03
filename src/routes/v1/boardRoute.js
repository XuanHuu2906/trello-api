import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardValidation } from '~/validations/boardValidation'
import { boardController } from '~/controllers/boardController'

const Route = express.Router()

Route.route('/')
  .get((req, res) => {
    res.status(StatusCodes.OK).json({ message: 'Note: API get list board.' })
  })
  .post(boardValidation.createNew, boardController.createNew)

Route.route('/:id')
  .get(boardController.getDetails)
  .put(boardValidation.update, boardController.update)
export const boardRoute = Route