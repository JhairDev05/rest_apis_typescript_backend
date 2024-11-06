import request from 'supertest';
import server from '../../server';

describe('POST /api/products', () => {
    it('should display validation errors', async () => {
        const res = await request(server).post('/api/products').send({})
        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('errors')
        expect(res.body.errors).toHaveLength(4)

        expect(res.status).not.toBe(402)
        expect(res.body.errors).not.toHaveLength(2)
    })

    it('should validate that the price is grater than 0', async () => {
        const res = await request(server).post('/api/products').send({
            name: "Mouse - Testing",
            price: 0
        })
        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('errors')
        expect(res.body.errors).toHaveLength(1)

        expect(res.status).not.toBe(404)
        expect(res.body.errors).not.toHaveLength(2)
    })

    it('should validate that the price is a number and grater than 0', async () => {
        const res = await request(server).post('/api/products').send({
            name: "Mouse - Testing",
            price: "Hola"
        })
        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('errors')
        expect(res.body.errors).toHaveLength(2)

        expect(res.status).not.toBe(404)
        expect(res.body.errors).not.toHaveLength(4)
    })

    it('should create a new product', async () => {
        const res = await request(server).post('/api/products').send({
            name: "Mouse - Testing",
            price: 30
        })

        expect(res.status).toBe(201)
        expect(res.body).toHaveProperty('data')

        expect(res.status).not.toBe(400)
        expect(res.status).not.toBe(200)
        expect(res.body).not.toHaveProperty('error')
    })
})

describe('GET /api/products', () => {
    it('GET a JSON response with products', async () => {
        const res = await request(server).get('/api/products')
        expect(res.status).toBe(200)
        expect(res.headers['content-type']).toMatch(/json/)
        expect(res.body).toHaveProperty('data')
        expect(res.body.data).toHaveLength(1)
        expect(res.body).not.toHaveProperty('errors')
        expect(res.status).not.toBe(404)
    })
})

describe('GET /api/products/:id', () => {
    it('Should return a 404 response for a non-existent product', async () => {
        const productId = 20000
        const res = await request(server).get(`/api/products/${productId}`)
        expect(res.status).toBe(404)
        expect(res.body).toHaveProperty('error')
        expect(res.body.error).toBe('Producto no encontrado')
    })

    it('should check a valid ID in the URL', async () => {
        const res = await request(server).get('/api/products/not-valid-url')
        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('errors')
        expect(res.body.errors).toHaveLength(1)
        expect(res.body.errors[0].msg).toBe('ID no válido')
    })

    it('get a JSON response for a single product', async () => {
        const res = await request(server).get('/api/products/1')
        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty('data')
    })
})

describe('PUT /api/product/:id', () => {
    it('should check a valid ID in the URL', async () => {
        const res = await request(server).put('/api/products/not-valid-url').send({
            name: 'Monitro curvo',
            price: 300,
            status: true
        })

        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('errors')
        expect(res.body.errors).toHaveLength(1)
        expect(res.body.errors[0].msg).toBe('ID no válido')
    })

    it('should display validation error messages when updating a product', async () => {
        const res = await request(server).put('/api/products/1').send({})

        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('errors')
        expect(res.body.errors).toBeTruthy()
        expect(res.body.errors).toHaveLength(5)

        expect(res.status).not.toBe(200)
        expect(res.body).not.toHaveProperty('data')

    })

    it('should validate that the price is greater than 0', async () => {
        const res = await request(server).put('/api/products/1').send({
            name: 'Monitro curvo',
            price: -300,
            status: true
        })

        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('errors')
        expect(res.body.errors).toBeTruthy()
        expect(res.body.errors).toHaveLength(1)
        expect(res.body.errors[0].msg).toBe('Precio no válido')

        expect(res.status).not.toBe(200)
        expect(res.body).not.toHaveProperty('data')

    })

    it('should return a 404 response for a non-exist product', async () => {
        const productId = 2000
        const res = await request(server).put(`/api/products/${productId}`).send({
            name: 'Monitro curvo',
            price: 300,
            status: true
        })

        expect(res.status).toBe(404)
        expect(res.body.error).toBe('Producto no encontrado')

        expect(res.status).not.toBe(200)
        expect(res.body).not.toHaveProperty('data')

    })

    it('should update an existing product with valid data', async () => {
        const res = await request(server).put(`/api/products/1`).send({
            name: 'Monitro curvo',
            price: 300,
            status: true
        })

        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty('data')

        expect(res.status).not.toBe(400)
        expect(res.body).not.toHaveProperty('errors')

    })
})

describe('PATCH /api/products/:id', () => {
    it('should return a 404 response for a non-existing product', async () => {
        const productId = 2000
        const res = await request(server).patch(`/api/products/${productId}`)
        expect(res.status).toBe(404)
        expect(res.body.error).toBe('Producto no encontrado')
        expect(res.status).not.toBe(200)
        expect(res.body).not.toHaveProperty('data')
    })

    it('should update the product status', async () => {
        const res = await request(server).patch('/api/products/1')
        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty('data')
        expect(res.body.data.status).toBe(false)

        expect(res.status).not.toBe(404)
        expect(res.status).not.toBe(400)
        expect(res.body).not.toHaveProperty('error')
    })
})

describe('DELETE /api/product/:id', () => {
    it('should check a valid ID', async () => {
        const res = await request(server).delete('/api/products/not-valid')
        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('errors')
        expect(res.body.errors[0].msg).toBe('ID no válido')
    })

    it('should return a 404 response for a non-existent product', async () => {
        const productId = 4000
        const res = await request(server).delete(`/api/products/${productId}`)
        expect(res.status).toBe(404)
        expect(res.body.error).toBe('Producto no encontrado')
        expect(res.status).not.toBe(200)
    })

    it('should return a 404 response for a non-existent product', async () => {
        const res = await request(server).delete(`/api/products/1`)
        expect(res.status).toBe(200)
        expect(res.body.data).toBe('Producto eliminado')

        expect(res.status).not.toBe(400)
        expect(res.status).not.toBe(404)

    })
})