import { Router } from "express";
import { createProduct, getProducts, getProductById, updateProduct, aupdateStatus, deleteProduct } from "./handlers/product";
import { body, param } from "express-validator";
import { handleInputErrors } from "./middleware";

const router = Router();

/**
 * @swagger
 * components: 
 *      schemas:
 *          Product:
 *              type: object
 *              properties: 
 *                  id:
 *                      type: integer
 *                      description: The Product ID
 *                      example: 1
 *                  name: 
 *                      type: string
 *                      description: The Product name
 *                      example: Monito curvo de 49 pulgadas
 *                  price:
 *                      type: number
 *                      description: The Product price
 *                      example: 300
 *                  status:
 *                      type: boolean
 *                      description: The Product status
 *                      example: true
 */

/**
 * @swagger
 * /api/products:
 *      get:
 *          summary: Get a list of products
 *          tags:
 *              - Products
 *          description: Return a list of products
 *          responses:
 *              200: 
 *                  description: Succesful response
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: array
 *                              items:
 *                                  $ref: '#/components/schemas/Product'
 */

/**
 * 
 * @swagger
 * /api/products/{id}:
 *      get:
 *          summary: Get a product by ID
 *          tags:
 *              - Products
 *          description: Return a product based on its unique ID
 *          parameters:
 *            - in: path
 *              name: id
 *              description: The ID of the product to retrieve
 *              required: true
 *              schema:
 *                  type: integer
 *          responses:
 *              200:
 *                  description: Successful response
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Product'
 *              400:
 *                  description: Bad Request - Invalid ID
 *              404:
 *                  description: Not found
 * 
 * 
 * 
 */

// Rounting
router.get('/', getProducts);
router.get('/:id',

    param('id').isInt().withMessage('ID no válido'),
    handleInputErrors,
    getProductById
);

/**
 * @swagger
 * /api/products:
 *      post:
 *          summary: Create a new product
 *          tags:
 *              - Products
 *          description: Return a new record in the database
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              name:
 *                                  type: string
 *                                  example: "Monitor curvo de 49 pulgadas"
 *                              price:
 *                                  type: number
 *                                  example: 400
 *          responses:
 *              201:
 *                  description: Successful response
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Product' 
 *              400:
 *                  description: Bad Request - invalid input data
 */
router.post('/',
    // Validación para enviar campos SIEMPRE COMIENZA CON AWAIT (se usa express validator).
    body('name')
        .notEmpty().withMessage('El nombre de producto no puede ir vacío'),
    body('price')
        .notEmpty().withMessage('El precio no puede ir vacío')
        .isNumeric().withMessage('Valor no válido')
        .custom(value => value > 0).withMessage('Ingrese un precio válido mayor a 0'),

    handleInputErrors, // Middleware
    createProduct
)

/**
 * @swagger
 * /api/products/{id}:
 *      put:
 *          summary: Update a product with user input
 *          tags:
 *              - Products
 *          description: Returns the updated product
 *          parameters:
 *            - in: path
 *              name: id
 *              description: The ID of the product to retrieve
 *              required: true
 *              schema:
 *                  type: integer
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              name:
 *                                  type: string
 *                                  example: "Monitor curvo de 49 pulgadas"
 *                              price:
 *                                  type: number
 *                                  example: 400
 *                              status:
 *                                  type: boolean
 *                                  example: true
 *          responses:
 *              200:
 *                  description: Successful response
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Product'
 *              400:
 *                  description: Bad Request - Invalid ID or Invalid input data
 * 
 *              404:
 *                  description: Product Not Found
 */

router.put('/:id',
    param('id').isInt().withMessage('ID no válido'),
    body('name')
        .notEmpty().withMessage('El nombre del producto no puede ir vacío'),
    body('price')
        .isNumeric().withMessage('Valor no válido')
        .notEmpty().withMessage('El precio del producto no puede ir vacío')
        .custom((value) => value > 0).withMessage('Precio no válido'),
    body('status').isBoolean().withMessage('Valor no válido para el estatus'),
    handleInputErrors,

    updateProduct
);

/**
 * @swagger
 * /api/products/{id}:
 *      patch:
 *          summary: Update product status
 *          tags:
 *              - Products
 *          description: Returns the updated status
 *          parameters:
 *            - in: path
 *              name: id
 *              description: The ID of the product to retrieve
 *              required: true
 *              schema:
 *                  type: integer
 *          responses:
 *              200:
 *                  description: Successful response
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Product'
 *              400:
 *                  description: Bad Request - Invalid ID
 * 
 *              404:
 *                  description: Product Not Found
 */

router.patch('/:id',
    param('id').isInt().withMessage('ID no válido'),
    handleInputErrors,
    aupdateStatus
);

/**
 * @swagger
 * /api/products/{id}:
 *      delete:
 *          summary: Delete a product by a given ID
 *          tags:
 *              - Products
 *          describe: Returns a confirmation message
 *          parameters:
 *            - in: path
 *              name: id
 *              description: The ID of the product to delete
 *              required: true
 *              schema:
 *                  type: integer
 *          responses:
 *              200:
 *                  description: Successful response
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: string
 *                              value: 'Producto eliminado'
 *              400:
 *                  description: Bad Request - Invalid ID
 * 
 *              404:
 *                  description: Product Not Found
 * 
 */

router.delete('/:id',
    param('id').isInt().withMessage('ID no válido'),
    handleInputErrors,

    deleteProduct
);

export default router;