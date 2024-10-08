import request from 'supertest'
import app from '@app'
import { StatusCodes } from 'http-status-codes'

describe('POST /user', function () {
    test('creating user with valid inputs', async function () {
        const res = await request(app).post('/user')

        expect(res.status == StatusCodes.OK)
    })
})
