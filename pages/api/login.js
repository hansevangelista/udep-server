import NextCors from 'nextjs-cors'
import { MongoClient } from 'mongodb'
import jwt from 'jsonwebtoken'

const url = 'mongodb+srv://admin:udeprace2024@udeprace.3hp1muh.mongodb.net/?retryWrites=true&w=majority&appName=udeprace'
const client = new MongoClient(url)

const dbName = 'udeprace'


export default async function handler(req, res) {
  console.log('login ...')

  await NextCors(req, res, {
     methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
     origin: '*',
     optionsSuccessStatus: 200,
  })

  if (req.method == 'POST') {
    console.log('POST ...')

    await client.connect()
    const db = client.db(dbName)
    const User = db.collection('users')

    const {
      email,
      password
    } = req.body
    console.log({ email, password })

    const user = await User.findOne({ email, password })
    if(!user) return res.json({ error: true, msg: 'Email o password incorrecto' })

    const token = jwt.sign({ id: user.id }, 'shhhhh')
    console.log({ token })


    client.close()

    res.json({
      error: false,
      token,
    })
  }
}
