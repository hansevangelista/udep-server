import NextCors from 'nextjs-cors'
import { MongoClient } from 'mongodb'
import jwt from 'jsonwebtoken'

const url = 'mongodb+srv://admin:udeprace2024@udeprace.3hp1muh.mongodb.net/?retryWrites=true&w=majority&appName=udeprace'
const client = new MongoClient(url)

const dbName = 'udeprace'


function rand () {
  return Math.random().toString(36).substr(2)
}


export default async function handler(req, res) {
  console.log('signup ...')

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
      name,
      phone,
      dni,
      school,
      city,
      year,
      password,
    } = req.body
    console.log({ email, name })

    const user = await User.findOne({ email })
    if(user) res.json({ error: true, msg: 'El email ya existe' })

    const id = rand()

    await User.insertOne({
      id,
      email,
      name,
      phone,
      dni,
      school,
      city,
      year,
      password,
    })

    const token = jwt.sign({ id }, 'shhhhh')
    console.log({ token })


    client.close()

    res.json({
      error: false,
      token,
    })
  }
}
