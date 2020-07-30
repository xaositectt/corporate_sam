import {
  APIGatewayProxyResult,
  APIGatewayEvent,
  Context,
  Callback
} from 'aws-lambda'

import dynamodb from 'aws-sdk/clients/dynamodb'
const docClient = new dynamodb.DocumentClient()

export const handler = async (
  event: APIGatewayEvent,
  _context: Context,
  _callback: Callback
): Promise<APIGatewayProxyResult> => {
  const params = {
    TableName: process.env.TABLE_NAME
  }

  const data = await docClient.scan(params).promise()

  return {
    body: JSON.stringify({
      items: data.Items,
      message: 'items successfully retrieved'
    }),
    statusCode: 200
  }
}
