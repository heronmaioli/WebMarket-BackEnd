const routes = require('express').Router()
const Product = require('./models/product')
const userCad = require('./models/users')
const buyed = require('./models/buyed')
const cart = require('./models/cart')
const wishlist = require('./models/wishlist')
const jwt = require('jsonwebtoken')
const TOKEN = require('./config/auth.json')

//RENDERIZAR LISTA DE DESEJOS

routes.post('/wishlist', async (req, res) => {
  const _id = req.body._id
  const list = await wishlist.findOne({ userId: _id })
  list && res.send(list)
})

// ADICIONAR A LISTA DE DESEJOS

routes.put('/wish', async (req, res) => {
  const _id = req.body.id // cliente
  const wish = req.body.wish // objeto para adicionar
  const list = await wishlist.findOne({ userId: _id }) //acha cliente

  const createList = async () => {
    await wishlist.create({
      userId: _id,
      products: wish
    })
  }

  const add = async () => {
    if (
      list.products.findIndex(
        produto => produto.productId === wish.productId
      ) === -1
    ) {
      await wishlist.updateOne(
        { userId: _id },
        { products: [...list.products, wish] }
      )

      return res.send('o Produto foi adicionado à sua Lista de Desejos')
    }
    return res.send('Este produto já está em sua Lista de Desejos!')
  }
  !list ? createList() : add()
  console.log(req.body)
})

// VERIFICAÇÃO DE AUTENTICAÇÃO

routes.get('/auth', async (req, res) => {
  const auth = req.headers.authorization

  if (auth == null) return res.send({ status: false })

  jwt.verify(auth, TOKEN.secret, async (err, decoded) => {
    if (err) return res.send({ status: false })
    const userData = await userCad.findOne({ _id: decoded.id })
    return (userData.password = undefined), res.send({ status: true, userData })
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
    { id: userData._id, email: userData.email, user: userData.password },
    TOKEN.secret,
    {
      expiresIn: 84600
    }
  )
  ;(userData.password = undefined), res.send({ token, userData })
})

module.exports = routes
