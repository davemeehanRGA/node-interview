import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import { db } from './db'

const host = process.env.HOST ?? 'localhost'
const port = process.env.PORT ? Number(process.env.PORT) : 6000

const taxRate = 0.05 // sales tax rate
function totalPrice(price, taxRate) {
  return price * taxRate
}

const app = express()
app.use(express.json())
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true }))
app.use(
  cors({
    origin: '*',
  })
)

// app.get('/', (req, res) => {
//   res.send({ message: 'Hello API' })
// })

app.get('/', async (req, res) => {
  const { id } = req.body
  // fetch the products by id
  const products = await db.query(`
    SELECT id, name, price, units
    FROM products
    WHERE id = ${id}
  `)
  return res.json({ products })
})

app.post('/:id', async (req, res) => {
  const { id } = req.params
  const { name, price, units } = req.body
  // update product name, price, units
  await db.query(`
    UPDATE products
    SET 
      name = '${name}',
      price = ${price},
      units = ${units},
      totalPrice = ${totalPrice(price, taxRate)}
    WHERE id = ${id}
  `)

  const newProduct = db.query(`
    SELECT id, name, price, units
    FROM products
    WHERE id = ${id}
  `)

  return res.json({ products: [newProduct] })
})

app.delete('/:id', async (req, res) => {
  const { id } = req.params
  await db.query(`
    DELETE FROM products
    WHERE id = ${id}
  `)
})

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`)
})
