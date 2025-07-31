/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */

import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { GET_DB } from '~/config/mongodb'
import { BOARD_TYPES } from '~/utils/constants'
import { columnModel } from '~/models/columnModel'
import { cardModel } from '~/models/cardModel'


const BOARD_COLLECTION_NAME = 'Boards'
const BOARD_COLLECTION_SCHEMA = Joi.object({
  title: Joi.string().required().min(3).max(50).trim().strict(),
  slug: Joi.string().required().min(3).trim().strict(),
  description: Joi.string().required().min(3).max(256).trim().strict(),
  type: Joi.string().valid(BOARD_TYPES.PUBLIC, BOARD_TYPES.PRIVATE).required(),
  columnOrderIds: Joi.array().items(
    Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
  ).default([]),

  createdAT: Joi.date().timestamp('javascript').default(Date.now),
  updatedAT: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

const validateBeforeCreate = async (data) => {
  return await BOARD_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
  try {
    const validData = await validateBeforeCreate(data)

    const createBoard = await GET_DB().collection(BOARD_COLLECTION_NAME).insertOne(validData)
    return createBoard
  } catch (error) {
    throw new Error(error)
  }
}

const findOnebyId = async (id) => {
  if (!ObjectId.isValid(id)) {
    throw new Error(`Invalid ObjectId: "${id}"`)
  }
  try {
    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).findOne({
      _id: new ObjectId(id),
      _destroy: false
    })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

// Querry tổng hợp (aggregate) để lấy toàn bộ Columns và Card thuộc về Board
const getDetails = async (id) => {
  if (!ObjectId.isValid(id)) {
    throw new Error(`Invalid ObjectId: "${id}"`)
  }
  try {
    // const result = await GET_DB().collection(BOARD_COLLECTION_NAME).findOne({
    //   _id: new ObjectId(id.toString())
    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).aggregate([
      { $match: {
        _id: new ObjectId(id.toString())
      } },
      // nó sẽ từ Board đi vào các column để lấy tất cả những column nào có boardId trùng với _id của Board mà ta đang đứng
      { $lookup: {
        // tên collection mà muốn liên kết đến
        from: columnModel.COLUMN_COLLECTION_NAME,
        //  Đây là trường (field) ở Collection hiện tại mà bạn đang truy vấn ( ở đây là Board )
        localField: '_id',
        // Nó sẽ chứa giá trị để khớp với localField của Collection hiện tại (boardId của column)
        foreignField: 'boardId',
        // Đây là tên của trường mới sẽ được thêm vào kết quả trả về của bản ghi hiện tại
        as: 'columns'
      } },
      { $lookup: {
        // tên collection mà muốn liên kết đến
        from: cardModel.CARD_COLLECTION_NAME,
        //  Đây là trường (field) ở Collection hiện tại mà bạn đang truy vấn ( ở đây là Board )
        localField: '_id',
        // Nó sẽ chứa giá trị để khớp với localField của Collection hiện tại (boardId của column)
        foreignField: 'boardId',
        // Đây là tên của trường mới sẽ được thêm vào kết quả trả về của bản ghi hiện tại
        as: 'cards' }
      }
    ]).toArray()

    return result[0] || null
  } catch (error) {
    throw new Error(error)
  }
}

export const boardModel = {
  BOARD_COLLECTION_NAME,
  BOARD_COLLECTION_SCHEMA,
  createNew,
  findOnebyId,
  getDetails
}
