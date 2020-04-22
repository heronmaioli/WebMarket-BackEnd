const routes = require('express').Router()
const Product = require('./models/product')
const userCad = require('./models/users')
const jwt = require('jsonwebtoken')
const TOKEN = require('./config/auth.json')

routes.get('/auth/products', async (req, res) => {
  const auth = req.headers.authorization

  if (auth == null) return res.send({ error: 'Não há um token' })

  jwt.verify(auth, TOKEN.secret, (err, decoded) => {
    if (err) return res.send({ error: 'Token inválido' })
    return res.send(true)
  })
})

// LISTAR TODOS OS PRODUTOS

routes.get('/products', async (req, res) => {
  const products = await Product.find()
  return res.json(products)
})

// CRIAR UM NOVO PRODUTO

routes.post('/createProduct', async (req, res) => {
  const {
    userId,
    photo,
    title,
    description,
    value,
    clicks,
    countStorage,
    buyed
  } = req.body
  const product = await Product.create({
    userId,
    photo,
    title,
    description,
    value,
    clicks,
    countStorage,
    buyed
  })
  return res.json(product)
})

// CADASTRO DE USUARIO

routes.post('/createUser', async (req, res) => {
  const {
    name,
    lastname,
    profilePic,
    email,
    cellphone,
    password,
    type,
    card,
    buyed,
    whishlist
  } = req.body
  const newUser = await userCad.create({
    name,
    lastname,
    profilePic,
    email,
    cellphone,
    password,
    type,
    card,
    buyed,
    whishlist
  })
  return res.json(newUser)
})

routes.post('/auth', async (req, res) => {
  const { email, password } = req.body
  const find = await userCad.findOne({ email })

  if (find === null) return res.send(false)
  if (find.password !== password) return res.send(false)

  const token = jwt.sign(
    { id: find.email, user: find.password },
    TOKEN.secret,
    {
      expiresIn: 84600
    }
  )
  ;(find.password = undefined), res.send({ token })
})

module.exports = routes
