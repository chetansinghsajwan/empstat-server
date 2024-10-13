import request from 'supertest'
import app from '@app'
import { StatusCodes } from 'http-status-codes'

describe('Assessment API', () => {
    const validAssessment = {
        userId: 'user1', // Assuming user1 exists
        trainingId: 'training1', // Assuming training1 exists
        marks: 85,
        internetAllowed: true,
    }

    describe('POST /assessment', () => {
        test('creating assessment with valid inputs', async () => {
            const res = await request(app)
                .post('/assessment')
                .send(validAssessment)
                .set('Authorization', `Bearer your_access_token`) // Set the correct token

            expect(res.status).toBe(StatusCodes.CREATED)
            expect(res.body).toHaveProperty('userId', validAssessment.userId)
            expect(res.body).toHaveProperty(
                'trainingId',
                validAssessment.trainingId,
            )
        })

        test('creating assessment with negative marks', async () => {
            const res = await request(app)
                .post('/assessment')
                .send({ ...validAssessment, marks: -10 })
                .set('Authorization', `Bearer your_access_token`) // Set the correct token

            expect(res.status).toBe(StatusCodes.BAD_REQUEST)
            expect(res.body.message).toMatch(
                /minimum marks cannot be less than 0/i,
            )
        })
    })

    describe('DELETE /assessment/:userId/:trainingId', () => {
        test('deleting existing assessment', async () => {
            const res = await request(app)
                .delete(
                    `/assessment/${validAssessment.userId}/${validAssessment.trainingId}`,
                )
                .set('Authorization', `Bearer your_access_token`) // Set the correct token

            expect(res.status).toBe(StatusCodes.NO_CONTENT)
        })

        test('deleting non-existent assessment', async () => {
            const res = await request(app)
                .delete(`/assessment/nonexistent-user/nonexistent-training`)
                .set('Authorization', `Bearer your_access_token`) // Set the correct token

            expect(res.status).toBe(StatusCodes.NOT_FOUND)
        })
    })

    describe('PUT /assessment/:userId/:trainingId', () => {
        test('updating assessment with valid inputs', async () => {
            const res = await request(app)
                .put(
                    `/assessment/${validAssessment.userId}/${validAssessment.trainingId}`,
                )
                .send({ marks: 90 })
                .set('Authorization', `Bearer your_access_token`) // Set the correct token

            expect(res.status).toBe(StatusCodes.OK)
            expect(res.body.marks).toBe(90)
        })

        test('updating assessment with invalid marks', async () => {
            const res = await request(app)
                .put(
                    `/assessment/${validAssessment.userId}/${validAssessment.trainingId}`,
                )
                .send({ marks: -5 })
                .set('Authorization', `Bearer your_access_token`) // Set the correct token

            expect(res.status).toBe(StatusCodes.BAD_REQUEST)
            expect(res.body.message).toMatch(
                /minimum marks cannot be less than 0/i,
            )
        })
    })

    describe('GET /assessment/:userId/:trainingId', () => {
        test('retrieving existing assessment', async () => {
            const res = await request(app)
                .get(
                    `/assessment/${validAssessment.userId}/${validAssessment.trainingId}`,
                )
                .set('Authorization', `Bearer your_access_token`) // Set the correct token

            expect(res.status).toBe(StatusCodes.OK)
            expect(res.body).toHaveProperty('userId', validAssessment.userId)
            expect(res.body).toHaveProperty(
                'trainingId',
                validAssessment.trainingId,
            )
        })

        test('retrieving non-existent assessment', async () => {
            const res = await request(app)
                .get(`/assessment/nonexistent-user/nonexistent-training`)
                .set('Authorization', `Bearer your_access_token`) // Set the correct token

            expect(res.status).toBe(StatusCodes.NOT_FOUND)
        })
    })

    describe('GET /assessment/all', () => {
        test('retrieving all assessments', async () => {
            const res = await request(app)
                .get('/assessment/all')
                .set('Authorization', `Bearer your_access_token`) // Set the correct token

            expect(res.status).toBe(StatusCodes.OK)
            expect(Array.isArray(res.body)).toBe(true)
        })
    })
})
