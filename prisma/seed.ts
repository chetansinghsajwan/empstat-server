import { PrismaClient, UserRole, TrainingMode } from '@prisma/client'
import { faker } from '@faker-js/faker'

const prisma = new PrismaClient()

// configure seed generation
const options = {
    user_count: 100,
    subject_count: 100,
    training_count: 500,
    assessment_count: 2000,
}

async function main() {

    await prisma.user.create({
        data: {
            id: 'chetansinghsajwan',
            email: 'chetansinghsajwan@gmail.com',
            firstName: 'chetan',
            middleName: 'singh',
            lastName: 'sajwan',
            role: 'admin'
        }
    })

    await prisma.secret.create({
        data: {
            user: {
                connect: {
                    id: 'chetansinghsajwan'
                }
            },
            // password: empstatchetan
            password: '$2a$10$gE3Dx1.W..4SKzmvZSlpAOZL.jSVQTizKAhL2xVrNrmSDWu/OA8ju'
        }
    })

    // generate users
    const users = []
    for (let i = 0; i < options.user_count; i++) {
        users.push({
            id: faker.string.uuid(),
            email: faker.internet.email(),
            firstName: faker.person.firstName(),
            middleName: faker.person.middleName(),
            lastName: faker.person.lastName(),
            role: faker.helpers.arrayElement(Object.values(UserRole)),
            createdAt: new Date(),
            updatedAt: new Date(),
        })
    }
    await prisma.user.createMany({ data: users })

    // generate secrets
    const secrets = users.map(user => ({
        userId: user.id,
        password: faker.internet.password(),
    }))
    await prisma.secret.createMany({ data: secrets })

    // generate subjects
    const subjects = []
    for (let i = 0; i < options.subject_count; i++) {
        subjects.push({
            id: faker.string.uuid(),
            name: faker.word.noun(),
            minMarks: faker.number.int({ min: 0, max: 50 }),
            maxMarks: faker.number.int({ min: 51, max: 100 }),
            totalTime: faker.number.int({ min: 60, max: 180 }),
            createdAt: new Date(),
            updatedAt: new Date(),
        })
    }
    await prisma.subject.createMany({ data: subjects })

    // generate trainings
    const trainings = []
    const subjectIds = subjects.map(subject => subject.id)
    for (let i = 0; i < options.training_count; i++) {
        const subjectId = faker.helpers.arrayElement(subjectIds)
        trainings.push({
            id: faker.string.uuid(),
            name: faker.word.noun(),
            mode: faker.helpers.arrayElement(Object.values(TrainingMode)),
            subjectId,
            startedAt: faker.date.past(),
            endedAt: faker.date.future(),
            createdAt: new Date(),
            updatedAt: new Date(),
        })
    }
    await prisma.training.createMany({ data: trainings })

    // generate assessments
    const assessments = []
    const trainingIds = trainings.map(training => training.id)
    const uniqueAssessments = new Set()

    while (assessments.length < options.assessment_count) {
        const userId = faker.helpers.arrayElement(users).id
        const trainingId = faker.helpers.arrayElement(trainingIds)
        const uniqueKey = `${userId}-${trainingId}`

        // check if the combination is unique
        if (!uniqueAssessments.has(uniqueKey)) {
            uniqueAssessments.add(uniqueKey)
            assessments.push({
                userId,
                trainingId,
                marks: faker.number.int({ min: 0, max: 100 }),
                internetAllowed: faker.datatype.boolean(),
            })
        }
    }

    await prisma.assessment.createMany({ data: assessments })
    console.log(
        `Seeded ${options.user_count} users, ${options.user_count} secrets, ${options.subject_count} subjects, ${options.training_count} trainings, and ${options.assessment_count} assessments.`,
    )
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
