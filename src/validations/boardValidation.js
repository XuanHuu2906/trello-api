/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */

import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

const createNew = async(req, res, next) => {

  // Validate dữ liệu
  const correctionCondition = Joi.object({
    title: Joi.string().required().min(3).max(50).trim().strict(),  // trim phải đi cùng strict
    description: Joi.string().required().min(3).max(256).trim().strict()
  })

  try {

    // set abortEarly: false để trả về tất cả lỗi
    await correctionCondition.validateAsync(req.body, { abortEarly: false })

    // khi dữ liệu validate xong xuôi hợp lệ thì cho request đi tiếp sang Controller
    next()


  } catch (error) {
    const errorMessage = new Error(error).message
    const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage)
    next(customError)
  }
}

export const boardValidation = {
  createNew
}