import request from 'supertest'
import app from '@app'
import { StatusCodes } from 'http-status-codes'

describe('Subject API', () => {
    const validSubject = {
        id: 'subject1',
        name: 'Mathematics',
        minMarks: 0,
        maxMarks: 100,
        totalTime: 120, // in minutes
    }

    describe('POST /subject', () => {
        test('creating subject with valid inputs', async () => {
            const res = await request(app)
                .post('/subject')
                .send(validSubject)
                .set('Authorization', `Bearer your_access_token`) // Set the correct token

            expect(res.status).toBe(StatusCodes.CREATED)
            expect(res.body).toHaveProperty('id', validSubject.id)
            expect(res.body.name).toBe(validSubject.name)
        })

        test('creating subject with missing name', async () => {
            const res = await request(app)
                .post('/subject')
                .send({ ...validSubject, name: '' })
                .set('Authorization', `Bearer your_access_token`) // Set the correct token

            expect(res.status).toBe(StatusCodes.BAD_REQUEST)
            expect(res.body.message).toMatch(/name cannot be empty/i)
        })

        test('creating subject with invalid minMarks', async () => {
            const res = await request(app)
                .post('/subject')
                .send({ ...validSubject, minMarks: -1 })
                .set('Authorization', `Bearer your_access_token`) // Set the correct token

            expect(res.status).toBe(StatusCodes.BAD_REQUEST)
            expect(res.body.message).toMatch(
                /minimum marks cannot be less than 0/i,
            )
        })
    })

    describe('DELETE /subject/:id', () => {
        test('deleting existing subject', async () => {
            const res = await request(app)
                .delete(`/subject/${validSubject.id}`)
                .set('Authorization', `Bearer your_access_token`) // Set the correct token

            expect(res.status).toBe(StatusCodes.NO_CONTENT)
        })

        test('deleting non-existent subject', async () => {
            const res = await request(app)
                .delete(`/subject/nonexistent-id`)
                .set('Authorization', `Bearer your_access_token`) // Set the correct token

            expect(res.status).toBe(StatusCodes.NOT_FOUND)
        })
    })

    describe('PUT /subject/:id', () => {
        test('updating subject with valid inputs', async () => {
            const res = await request(app)
                .put(`/subject/${validSubject.id}`)
                .send({ name: 'Advanced Mathematics' })
                .set('Authorization', `Bearer your_access_token`) // Set the correct token

            expect(res.status).toBe(StatusCodes.OK)
            expect(res.body.name).toBe('Advanced Mathematics')
        })

        test('updating subject with invalid maxMarks', async () => {
            const res = await request(app)
                .put(`/subject/${validSubject.id}`)
                .send({ maxMarks: -10 })
                .set('Authorization', `Bearer your_access_token`) // Set the correct token

            expect(res.status).toBe(StatusCodes.BAD_REQUEST)
            expect(res.body.message).toMatch(
                /maximum marks cannot be less than 0/i,
            )
        })
    })

    describe('GET /subject/:id', () => {
        test('retrieving existing subject', async () => {
            const res = await request(app)
                .get(`/subject/${validSubject.id}`)
                .set('Authorization', `Bearer your_access_token`) // Set the correct token

            expect(res.status).toBe(StatusCodes.OK)
            expect(res.body).toHaveProperty('id', validSubject.id)
        })

        test('retrieving non-existent subject', async () => {
            const res = await request(app)
                .get(`/subject/nonexistent-id`)
                .set('Authorization', `Bearer your_access_token`) // Set the correct token

            expect(res.status).toBe(StatusCodes.NOT_FOUND)
        })
    })

    describe('GET /subject/all', () => {
        test('retrieving all subjects', async () => {
            const res = await request(app)
                .get('/subject/all')
                .set('Authorization', `Bearer your_access_token`) // Set the correct token

            expect(res.status).toBe(StatusCodes.OK)
            expect(Array.isArray(res.body)).toBe(true)
        })
    })
})
