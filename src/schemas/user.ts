import zod from 'zod'
import * as zodExpress from 'zod-express-middleware'

const passwordRegex = new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)

export const createUser = {
    body: zod.object({
        id: zod.string().min(1, 'id cannot be empty').trim().toLowerCase(),

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
                and one special character'
        ),

        name: zod.string().min(1, 'name cannot be empty').trim(),
    }),
}

export const deleteUser = {}

export const loginUser = {
    body: zod.object({
        id: zod.string().min(1, 'id cannot be empty'),

        password: zod.string().min(1, 'password cannot be empty'),
    }),
}

export const getUser = {}
export const getUsers = {}

export const validateCreateUserRequest = zodExpress.validateRequest(createUser)
export const validateDeleteUserRequest = zodExpress.validateRequest(deleteUser)
export const validateLoginUserRequest = zodExpress.validateRequest(loginUser)
export const validateGetUserRequest = zodExpress.validateRequest(getUser)
export const validateGetUsersRequest = zodExpress.validateRequest(getUsers)

export default {
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
