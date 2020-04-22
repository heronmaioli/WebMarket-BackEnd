const routes = require('express').Router()
const Product = require('./models/product')
const userCad = require('./models/users')
const jwt = require('jsonwebtoken')
const TOKEN = require('./config/auth.json')

routes.get('/auth', async (req, res) => {
  const auth = req.headers.authorization
  const _id = req.headers.userid
  const userData = await userCad.findOne(_id)

  if (auth == null) return res.send({ status: false })

  jwt.verify(auth, TOKEN.secret, (err, decoded) => {
    if (err) return res.send({ status: false })
    res.send({ status: true, userData })
  })
})

// LISTAR TODOS OS PRODUTOS

routes.get('/products', async (req, res) => {
  const products = await Product.find()
  return res.json(products)
})

// LISTAR TODOS OS PRODUTOS

routes.get('/productinfo', async (req, res) => {
  const id = req.body
  const product = await Product.findOne(id)
  return res.send(product)
})

// ROTA DE MAIS VENDIDOS

routes.get('/bestproducts', async (req, res) => {
  const products = await Product.find().sort({ buyed: -1 })
  return res.json(products)
})

// ROTA DE MAIS POPULARES

routes.get('/popularproducts', async (req, res) => {
  const products = await Product.find().sort({ clicks: -1 })
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

routes.post('/login', async (req, res) => {
  const { email, password } = req.body
  const userData = await userCad.findOne({ email })

  if (userData === null) return res.send(false)
  if (userData.password !== password) return res.send(false)

  const token = jwt.sign(
    { id: userData.email, user: userData.password },
    TOKEN.secret,
    {
      expiresIn: 84600
    }
  )
  ;(userData.password = undefined), res.send({ token, userData })
})

module.exports = routes
