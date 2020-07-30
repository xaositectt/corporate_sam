import {
  APIGatewayProxyResult,
  APIGatewayEvent,
  Context,
  Callback
} from 'aws-lambda'
import AWS from 'aws-sdk'
const documentClient = new AWS.DynamoDB.DocumentClient()
// const emailService = new AWS.SES()
import uid from '../utils/uid'

export const handler = async (
  event: APIGatewayEvent,
  _context: Context,
  _callback: Callback
): Promise<APIGatewayProxyResult> => {
  let responseBody = ''
  let statusCode = 0

  const body = JSON.parse(event.body)

  const firstName = body?.first_name || ''
  const lastName = body?.last_name || ''
  const email = body?.email || ''
  const language = body?.language || ''
  const date = Date.now().toString()

  const params = {
    TableName: process.env.TABLE_NAME,
    Item: {
      id: uid(),
      first_name: firstName,
      last_name: lastName,
      email: email,
      language,
      updated_at: date
    }
  }

  try {
    const data = await documentClient.put(params).promise()
    responseBody = JSON.stringify({
      data: params.Item,
      message: 'application sent sucessfully'
    })
    statusCode = 201
  } catch (e) {
    console.log(e)
    responseBody = JSON.stringify({
      msg: 'unable to insert user data',
      error: e
    })
    statusCode = 403
  }

  return {
    statusCode: statusCode,
    body: responseBody,
    headers: {
      test_header: 'test header'
    }
  }
}
