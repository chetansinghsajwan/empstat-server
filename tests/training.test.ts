import request from 'supertest'
import app from '@app'
import { StatusCodes } from 'http-status-codes'

describe('Training API', () => {
    const validTraining = {
        id: 'training1',
        name: 'JavaScript Fundamentals',
        mode: 'online',
        subject: 'subject1', // Assuming subject1 exists
        startedAt: new Date(Date.now() + 1000 * 60 * 60), // 1 hour from now
        endedAt: new Date(Date.now() + 1000 * 60 * 120), // 2 hours from now
    }

    describe('POST /training', () => {
        test('creating training with valid inputs', async () => {
            const res = await request(app)
                .post('/training')
                .send(validTraining)
                .set('Authorization', `Bearer your_access_token`) // Set the correct token

            expect(res.status).toBe(StatusCodes.CREATED)
            expect(res.body).toHaveProperty('id', validTraining.id)
            expect(res.body.name).toBe(validTraining.name)
        })

        test('creating training with invalid startedAt time', async () => {
            const res = await request(app)
                .post('/training')
                .send({
                    ...validTraining,
                    startedAt: new Date(Date.now() - 1000 * 60 * 60),
                }) // 1 hour in the past
                .set('Authorization', `Bearer your_access_token`) // Set the correct token

            expect(res.status).toBe(StatusCodes.BAD_REQUEST)
            expect(res.body.message).toMatch(/time should be greater than now/i)
        })
    })

    describe('DELETE /training/:id', () => {
        test('deleting existing training', async () => {
            const res = await request(app)
                .delete(`/training/${validTraining.id}`)
                .set('Authorization', `Bearer your_access_token`) // Set the correct token

            expect(res.status).toBe(StatusCodes.NO_CONTENT)
        })

        test('deleting non-existent training', async () => {
            const res = await request(app)
                .delete(`/training/nonexistent-id`)
                .set('Authorization', `Bearer your_access_token`) // Set the correct token

            expect(res.status).toBe(StatusCodes.NOT_FOUND)
        })
    })

    describe('PUT /training/:id', () => {
        test('updating training with valid inputs', async () => {
            const res = await request(app)
                .put(`/training/${validTraining.id}`)
                .send({ name: 'Advanced JavaScript' })
                .set('Authorization', `Bearer your_access_token`) // Set the correct token

            expect(res.status).toBe(StatusCodes.OK)
            expect(res.body.name).toBe('Advanced JavaScript')
        })

        test('updating training with invalid mode', async () => {
            const res = await request(app)
                .put(`/training/${validTraining.id}`)
                .send({ mode: 'invalid_mode' })
                .set('Authorization', `Bearer your_access_token`) // Set the correct token

            expect(res.status).toBe(StatusCodes.BAD_REQUEST)
            expect(res.body.message).toMatch(/invalid enum value/i)
        })
    })

    describe('GET /training/:id', () => {
        test('retrieving existing training', async () => {
            const res = await request(app)
                .get(`/training/${validTraining.id}`)
                .set('Authorization', `Bearer your_access_token`) // Set the correct token

            expect(res.status).toBe(StatusCodes.OK)
            expect(res.body).toHaveProperty('id', validTraining.id)
        })

        test('retrieving non-existent training', async () => {
            const res = await request(app)
                .get(`/training/nonexistent-id`)
                .set('Authorization', `Bearer your_access_token`) // Set the correct token

            expect(res.status).toBe(StatusCodes.NOT_FOUND)
        })
    })

    describe('GET /training/all', () => {
        test('retrieving all trainings', async () => {
            const res = await request(app)
                .get('/training/all')
                .set('Authorization', `Bearer your_access_token`) // Set the correct token

            expect(res.status).toBe(StatusCodes.OK)
            expect(Array.isArray(res.body)).toBe(true)
        })
    })
})
