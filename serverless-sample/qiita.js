import axios from 'axios'
import AWS from 'aws-sdk'

const documentClient = new AWS.DynamoDB.DocumentClient()

export const hello = async (event, context, callback) => {
  const res = await axios({
    method: 'get',
    url: process.env.endpoint,
    params: {
      page: 1,
      per_page: 100,
    }
  })

  if(res.data) {
    Promise.all(res.data.map(async element => {
      const params = {
        TableName: process.env.tableName,
        Item:{
          'id': element.id,
          'title': element.title,
          'url': element.url,
          'likes_count': element.likes_count,
          'created_at': element.created_at,
          'updated_at': element.updated_at,
          'tags': element.tags,
        }
      }

      await putItem(params)
    }))
  }

  callback(null, {
    message: 'write qiita article data to dynamoDB success.',
    event,
  })
}

const putItem = (params) => {
  return new Promise((resolve, reject) => {
    documentClient.put(params, (err, data) => {
      if (err) reject(err)
      else resolve(data)
    })
  })
}
