const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

router.get('/', (req, res) => {
    // find all products
    // be sure to include its associated Category and Tag response
    Product.findAll({
            attributes: ['id', 'product_name', 'price', 'stock'],
            include: [{
                    model: Category,
                    attributes: ['category_name']
                },
                {
                    model: Tag,
                    attributes: ['tag_name']
                }
            ]
        })
        .then(response => res.json(response))
        //.then(console.log(response))
        .catch(error => {
            console.log(error);
            res.status(500).json(error);
        });
});

router.get('/:id', (req, res) => {
    // find a single product by its `id`
    // be sure to include its associated Category and Tag response
    Product.findOne({
            where: {
                id: req.params.id
            },
            attributes: ['id', 'product_name', 'price', 'stock'],
            include: [{
                    model: Category,
                    attributes: ['category_name']
                },
                {
                    model: Tag,
                    attributes: ['tag_name']
                }
            ]
        })
        .then(response => {
            if (!response) {
                res.status(404).json({ message: 'Cannot find product with this ID!' });
                return;
            }
            res.json(response);
        })
        .catch(error => {
            console.log(error);
            res.status(500).json(error);
        });
});

router.post('/', (req, res) => {
    Product.create({
            product_name: req.body.product_name,
            price: req.body.price,
            stock: req.body.stock,
            category_id: req.body.category_id,
            tagIds: req.body.tagIds
        })
        .then((product) => {
            if (req.body.tagIds.length) {
                const productTagIdArr = req.body.tagIds.map((tag_id) => {
                    return {
                        product_id: product.id,
                        tag_id,
                    };
                });
                return ProductTag.bulkCreate(productTagIdArr);
            }
            res.status(200).json(product);
        })
        .then((productTagIds) => res.status(200).json(productTagIds))
        .catch((error) => {
            console.log(error);
            res.status(400).json(error);
        });
      /* req.body should look like this...
      {
        product_name: "Basketball",
        price: 200.00,
        stock: 3,
        tagIds: [1, 2, 3, 4]
      }
    */
});

router.put('/:id', (req, res) => {
    // update product response
    Product.update(req.body, {
            where: {
                id: req.params.id,
            },
        })
        .then((product) => {
            (console.log(product))
            return ProductTag.findAll({ where: { product_id: req.params.id } });
        })
        .then((productTags) => {
            (console.log(productTags))
            const productTagIds = productTags.map(({ tag_id }) => tag_id);
            (console.log(productTagIds))
            const newProductTags = req.body.tagIds
                .filter((tag_id) => !productTagIds.includes(tag_id))
                .map((tag_id) => {
                    return {
                        product_id: req.params.id,
                        tag_id,
                    };
                });
            console.log(newProductTags);
            const productTagsToRemove = productTags
                .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
                .map(({ id }) => id);

            return Promise.all([
                ProductTag.destroy({ where: { id: productTagsToRemove } }),
                ProductTag.bulkCreate(newProductTags),
            ]);
        })
        .then((updatedProductTags) => res.json(updatedProductTags))
        .catch((error) => {
            res.status(400).json(error);
        });
});

router.delete('/:id', (req, res) => {
    // delete one product by its `id` value
    Product.destroy({
            where: {
                id: req.params.id
            }
        })
        .then(response => {
            if (!response) {
                rs.status(404).json({ message: 'Cannot find product with this ID!' });
                return;
            }
            res.json(response);
        })
        .catch(error => {
            console.log(error);
            res.status(500).json(error);
        });
});

module.exports = router;
