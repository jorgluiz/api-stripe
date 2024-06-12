// Load environment variables from .env file
require('dotenv').config()

const keyPublic = process.env.KEY_PUBLIC
const keyAPI = process.env.KEY_API

module.exports = {
    keyPublic,
    keyAPI
}