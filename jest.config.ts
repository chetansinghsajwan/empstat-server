import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
    verbose: true,
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    setupFiles: ["dotenv/config"],
    moduleNameMapper: {
        "^@app$": "<rootDir>/src/app",
        "^@routes/(.*)$": "<rootDir>/src/routes/$1",
        "^@routes$": "<rootDir>/src/routes",
        "^@controllers/(.*)$": "<rootDir>/src/controllers/$1",
        "^@schemas/(.*)$": "<rootDir>/src/schemas/$1",
        "^@utils/(.*)$": "<rootDir>/src/utils/$1",
        "^@modals/(.*)$": "<rootDir>/src/modals/$1",
        "^@modals$": "<rootDir>/src/modals",
        "^@middlewares/(.*)$": "<rootDir>/src/middlewares/$1"
    }
}

export default config
