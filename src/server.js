/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */

import express from 'express'
import exitHook from 'async-exit-hook'
import { CONNECT_DB, CLOSE_DB} from '~/config/mongodb'
import { env } from '~/config/environment'
import { APIs_V1 } from '~/routes/v1/index'
import { errorHandlingMiddleware } from '~/middlewares/errorHandlingMiddleware'

const START_SERVER = () => {
  const app = express()

  // để hiện json của dữ liệu sau khi validatevalidate
  app.use(express.json())

  // sử dụng route v1 
  app.use('/v1', APIs_V1)

  // middleware xử lý lỗi tập trung
  app.use(errorHandlingMiddleware)

  app.listen(env.APP_PORT, env.APP_HOST, () => {
    console.log(`3.Hello ${env.AUTHOR}, I am running at htpp://${ env.APP_HOST }:${ env.APP_PORT }/`)
  })

  // sử dụng exitHook để thoát khỏi database
  exitHook(() => {
    CLOSE_DB()
  })
}

(async() => {
  try {
    console.log('1.Connecting to MongoDB Atlas')
    CONNECT_DB()
    console.log('2.Connected to MongoDB Atlas!')
    START_SERVER()
  } catch (error) {
    console.log(error)
    process.exit(0)
  }
})()

// console.log('1.Connecting to MongoDB Atlas')
// CONNECT_DB()
//   .then(() => console.log('Connected to MongoDB Atlas!'))
//   .then(() => START_SERVER())
//   .catch(error => {
//     console.log(error)
//     process.exit(0)
//   })

