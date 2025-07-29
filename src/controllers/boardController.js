/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */

import { StatusCodes } from 'http-status-codes'
// import ApiError from '~/utils/ApiError'
import { boardService } from '~/services/boardService'

const createNew = async(req, res, next) => {
  try {
    // console.log('req.body', req.body)
    // console.log('req.params', req.params)
    // console.log('req.query', req.query)
    // res.status(StatusCodes.CREATED).json({ message: 'Note: API create new board.'})
    const createBoard = await boardService.createNew(req.body)

    res.status(StatusCodes.CREATED).json(createBoard)
  } catch (error) { next(error) }
}
const getDetails = async(req, res, next) => {
  try {
    // console.log('req.params', req.params)
    const boardId = req.params.id

    const board = await boardService.getDetails(boardId)

    res.status(StatusCodes.OK).json(board)
  } catch (error) { next(error) }
}

export const boardController = {
  createNew,
  getDetails
}