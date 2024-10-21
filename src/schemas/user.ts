import zod from 'zod'
import zodExpress from 'zod-express-middleware'
import { TypedRequest } from 'zod-express-middleware'

const passwordRegex = new RegExp(
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
)

const id = zod.string().min(1, 'id cannot be empty').trim().toLowerCase()

const role = zod.enum(['admin', 'employee'])

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

    firstName: zod.string().min(1, 'first name cannot be empty').trim(),

    middleName: zod.string().trim(),

    lastName: zod.string().trim(),

    role: role,
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

const getUsers = {
    query: zod.object({
        from: zod.coerce.number().min(0, 'from cannot be less than 0').optional(),
        count: zod.coerce.number().min(0, 'count cannot be less than 0').optional(),
        countOnly: zod.coerce.boolean().optional(),
    }),
}

const validateCreateUserRequest = zodExpress.validateRequest(createUser)
const validateDeleteUserRequest = zodExpress.validateRequest(deleteUser)
const validateLoginUserRequest = zodExpress.validateRequest(loginUser)
const validateGetUserRequest = zodExpress.validateRequest(getUser)
const validateGetUsersRequest = zodExpress.validateRequest(getUsers)

export type CreateUserRequest = TypedRequest<any, any, typeof createUser.body>
export type DeleteUserRequest = TypedRequest<any, any, any>
export type LoginUserRequest = TypedRequest<any, any, typeof loginUser.body>
export type GetUserRequest = TypedRequest<any, any, any>
export type GetUsersRequest = TypedRequest<any, typeof getUsers.query, any>

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
