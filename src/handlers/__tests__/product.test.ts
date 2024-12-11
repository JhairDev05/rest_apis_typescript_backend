import request from 'supertest';
import server from '../../server';

describe('POST /api/products', () => {
    it('debería mostrar errores de validación', async () => {
        const res = await request(server).post('/api/products').send({})
        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('errors')
        expect(res.body.errors).toHaveLength(4) // El número va a depender de cuantas campos tengamos para validar

        expect(res.status).not.toBe(402)
        expect(res.body.errors).not.toHaveLength(2) 
    })

    it('debe validar que el precio es mayor que 0', async () => {
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

    it('debe validar que el precio es un número y es mayor que 0', async () => {
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

    it('debería crear un nuevo producto', async () => {
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
    it('obtener una respuesta JSON con productos', async () => {
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
    it('Debería devolver una respuesta 404 para un producto inexistente', async () => {
        const productId = 20000
        const res = await request(server).get(`/api/products/${productId}`)
        expect(res.status).toBe(404)
        expect(res.body).toHaveProperty('error')
        expect(res.body.error).toBe('Producto no encontrado')
    })

    it('debe verificar un ID válida en la URL', async () => {
        const res = await request(server).get('/api/products/not-valid-url')
        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('errors')
        expect(res.body.errors).toHaveLength(1)
        expect(res.body.errors[0].msg).toBe('ID no válido')
    })

    it('obtener una respuesta JSON para un solo producto', async () => {
        const res = await request(server).get('/api/products/1')
        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty('data')
    })
})

describe('PUT /api/product/:id', () => {
    it('debe verificar un ID válida en la URL', async () => {
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

    it('debería mostrar mensajes de error de validación al actualizar un producto', async () => {
        const res = await request(server).put('/api/products/1').send({})

        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('errors')
        expect(res.body.errors).toBeTruthy()
        expect(res.body.errors).toHaveLength(5)

        expect(res.status).not.toBe(200)
        expect(res.body).not.toHaveProperty('data')

    })

    it('debe validar que el precio es mayor que 0', async () => {
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

    it('debería devolver una respuesta 404 para un producto que no existe', async () => {
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

    it('debe actualizar un producto existente con datos válidos', async () => {
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
    it('debería devolver una respuesta 404 para un producto no existente', async () => {
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
    it('debe verificar un ID válid', async () => {
        const res = await request(server).delete('/api/products/not-valid')
        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('errors')
        expect(res.body.errors[0].msg).toBe('ID no válido')
    })

    it('debería devolver una respuesta 404 para un producto inexistente', async () => {
        const productId = 4000
        const res = await request(server).delete(`/api/products/${productId}`)
        expect(res.status).toBe(404)
        expect(res.body.error).toBe('Producto no encontrado')
        expect(res.status).not.toBe(200)
    })

    it('debería eliminar un producto', async () => {
        const res = await request(server).delete(`/api/products/1`)
        expect(res.status).toBe(200)
        expect(res.body.data).toBe('Producto eliminado')

        expect(res.status).not.toBe(400)
        expect(res.status).not.toBe(404)

    })
})