require('dotenv').config()
const nodemailer = require('nodemailer')
const { OAuth2Client } = require('google-auth-library')

const GOOGLE_MAILER_CLIENT_ID = '346614162845-vo5ddett2hfuggdg9gef8kk96vev3pih.apps.googleusercontent.com'
const GOOGLE_MAILER_CLIENT_SECRET = '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'
const GOOGLE_MAILER_REFRESH_TOKEN = '1//043Tc4sNxdfr5CgYIARAAGAQSNwF-L9IrC3CTzk71RXk4o17KrmO8bsV_sBPlwyghBu65f5QfdXWySYuU0t_PW9_up1OVDDMU_mU'
const ADMIN_EMAIL_ADDRESS = 'gioimongtien@gmail.com'

const myOAuth2Client = new OAuth2Client(
  GOOGLE_MAILER_CLIENT_ID,
  GOOGLE_MAILER_CLIENT_SECRET
)

myOAuth2Client.setCredentials({
  refresh_token: GOOGLE_MAILER_REFRESH_TOKEN
})

const emailServices = async (email, subject, html ,random_code) => {
    try {
        const myAccessTokenObject = await myOAuth2Client.getAccessToken()
        const myAccessToken = myAccessTokenObject?.token
        const transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: ADMIN_EMAIL_ADDRESS,
            clientId: GOOGLE_MAILER_CLIENT_ID,
            clientSecret: GOOGLE_MAILER_CLIENT_SECRET,
            refresh_token: GOOGLE_MAILER_REFRESH_TOKEN,
            accessToken: myAccessToken
        }
        })

        const mailOptions = {
        to: email, // Gửi đến ai?
        subject: subject, // Tiêu đề email
        html: html // Nội dung email
        }
        // Gọi hành động gửi email
        await transport.sendMail(mailOptions)
        // Không có lỗi gì thì trả về success
        console.log("message", 'Email sent successfully.')
        
    } catch (error) {
        // Có lỗi thì các bạn log ở đây cũng như gửi message lỗi về phía client-        console.log(error)
        console.log(error.message)
        return false
    }
    return true
}

module.exports = emailServices