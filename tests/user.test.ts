import request from 'supertest'
import app from '@app'
import { StatusCodes } from 'http-status-codes'

describe('User API', () => {
    const validUser = {
        id: 'testuser1',
        email: 'testuser1@example.com',
        password: 'StrongP@ssword1',
        first_name: 'Test',
        last_name: 'User',
        role: 'Admin', // or 'Employee'
    }

    describe('POST /user', () => {
        test('creating user with valid inputs', async () => {
            const res = await request(app).post('/user').send(validUser)

            expect(res.status).toBe(StatusCodes.CREATED)
            expect(res.body).toHaveProperty('id')
            expect(res.body.email).toBe(validUser.email)
        })

        test('creating user with invalid email', async () => {
            const res = await request(app)
                .post('/user')
                .send({ ...validUser, email: 'invalid-email' })

            expect(res.status).toBe(StatusCodes.BAD_REQUEST)
            expect(res.body.message).toMatch(/invalid email format/i)
        })

        test('creating user with missing required fields', async () => {
            const res = await request(app).post('/user').send({})

            expect(res.status).toBe(StatusCodes.BAD_REQUEST)
            expect(res.body.message).toMatch(/id cannot be empty/i)
        })
    })

    describe('DELETE /user/:id', () => {
        test('deleting existing user', async () => {
            const res = await request(app)
                .delete(`/user/${validUser.id}`)
                .set('Authorization', `Bearer your_access_token`) // Set the correct token

            expect(res.status).toBe(StatusCodes.NO_CONTENT)
        })

        test('deleting non-existent user', async () => {
            const res = await request(app)
                .delete(`/user/nonexistent-id`)
                .set('Authorization', `Bearer your_access_token`) // Set the correct token

            expect(res.status).toBe(StatusCodes.NOT_FOUND)
        })
    })

    describe('PUT /user/:id', () => {
        test('updating user with valid inputs', async () => {
            const res = await request(app)
                .put(`/user/${validUser.id}`)
                .send({ email: 'updateduser@example.com' })
                .set('Authorization', `Bearer your_access_token`) // Set the correct token

            expect(res.status).toBe(StatusCodes.OK)
            expect(res.body.email).toBe('updateduser@example.com')
        })

        test('updating user with invalid email', async () => {
            const res = await request(app)
                .put(`/user/${validUser.id}`)
                .send({ email: 'invalid-email' })
                .set('Authorization', `Bearer your_access_token`) // Set the correct token

            expect(res.status).toBe(StatusCodes.BAD_REQUEST)
            expect(res.body.message).toMatch(/invalid email format/i)
        })
    })

    describe('GET /user/:id', () => {
        test('retrieving existing user', async () => {
            const res = await request(app)
                .get(`/user/${validUser.id}`)
                .set('Authorization', `Bearer your_access_token`) // Set the correct token

            expect(res.status).toBe(StatusCodes.OK)
            expect(res.body).toHaveProperty('id', validUser.id)
        })

        test('retrieving non-existent user', async () => {
            const res = await request(app)
                .get(`/user/nonexistent-id`)
                .set('Authorization', `Bearer your_access_token`) // Set the correct token

            expect(res.status).toBe(StatusCodes.NOT_FOUND)
        })
    })

    describe('GET /user', () => {
        test('retrieving all users', async () => {
            const res = await request(app)
                .get('/user')
                .set('Authorization', `Bearer your_access_token`) // Set the correct token

            expect(res.status).toBe(StatusCodes.OK)
            expect(Array.isArray(res.body)).toBe(true)
        })
    })
})
