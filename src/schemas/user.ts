import zod from 'zod'
import * as zodExpress from 'zod-express-middleware'

const passwordRegex = new RegExp(
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
)

const id = zod.string().min(1, 'id cannot be empty').trim().toLowerCase()

const body = {
    id: id,

    email: zod.string().email('invalid email format').trim().toLowerCase(),

    password: zod.string().regex(
        passwordRegex,
        'pasword must \
            be greater than 7 characters \
            and shorter than 17 characters \
            and contain \
            one lower case letter, \
            one upper case letter, \
            one number \
            and one special character',
    ),

    name: zod.string().min(1, 'name cannot be empty').trim(),
}

const createUser = {
    body: zod.object(body),
}

const deleteUser = {}

const loginUser = {
    body: zod.object({
        id: zod.string().min(1, 'id cannot be empty'),

        password: zod.string().min(1, 'password cannot be empty'),
    }),
}

const getUser = {}

const getUsers = {}

const validateCreateUserRequest = zodExpress.validateRequest(createUser)
const validateDeleteUserRequest = zodExpress.validateRequest(deleteUser)
const validateLoginUserRequest = zodExpress.validateRequest(loginUser)
const validateGetUserRequest = zodExpress.validateRequest(getUser)
const validateGetUsersRequest = zodExpress.validateRequest(getUsers)

export default {
    id,

    createUser,
    deleteUser,
    getUser,
    getUsers,

    validateCreateUserRequest,
    validateDeleteUserRequest,
    validateLoginUserRequest,
    validateGetUserRequest,
    validateGetUsersRequest,
}
