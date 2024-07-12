import NextCors from 'nextjs-cors'
import { MongoClient } from 'mongodb'
import jwt from 'jsonwebtoken'

const url = 'mongodb+srv://admin:udeprace2024@udeprace.3hp1muh.mongodb.net/?retryWrites=true&w=majority&appName=udeprace'
const client = new MongoClient(url)

const dbName = 'udeprace'


export default async function handler(req, res) {
  console.log('play ...')

  await NextCors(req, res, {
     methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
     origin: '*',
     optionsSuccessStatus: 200,
  })

  if (req.method == 'GET') {
    console.log('GET ...')

    await client.connect()
    const db = client.db(dbName)
    const User = db.collection('users')

    const {
      token,
    } = req.query
    console.log({ token })

    const { id } = jwt.verify(token, 'shhhhh')
    console.log({ id })

    const user = await User.findOne({ id })
    console.log({ user })


    client.close()

    res.json({
      error: false,
      user,
    })
  }
}
