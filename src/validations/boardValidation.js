import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { BOARD_TYPES } from '~/utils/constants'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

const createNew = async(req, res, next) => {

  // Validate dữ liệu
  const correctionCondition = Joi.object({
    title: Joi.string().required().min(3).max(50).trim().strict(), // trim phải đi cùng strict
    description: Joi.string().required().min(3).max(256).trim().strict(),
    type: Joi.string().valid(BOARD_TYPES.PUBLIC, BOARD_TYPES.PRIVATE).required()
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

const update = async(req, res, next) => {

  const correctionCondition = Joi.object({
    // Lưu ý không dùng required() trong tường hợp update
    title: Joi.string().min(3).max(50).trim().strict(),
    description: Joi.string().min(3).max(256).trim().strict(),
    type: Joi.string().valid(BOARD_TYPES.PUBLIC, BOARD_TYPES.PRIVATE),
    columnOrderIds: Joi.array().items(
      Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
    ).default([])
  })

  try {

    // set abortEarly: false để trả về tất cả lỗi
    await correctionCondition.validateAsync(req.body, {
      abortEarly: false,
      // Đối với trường hợp update, cho phép Unknow để không cần lấy 1 số field lên
      allowUnknown: true
    })

    // khi dữ liệu validate xong xuôi hợp lệ thì cho request đi tiếp sang Controller
    next()


  } catch (error) {
    const errorMessage = new Error(error).message
    const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage)
    next(customError)
  }
}

export const boardValidation = {
  createNew,
  update
}