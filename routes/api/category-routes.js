const router = require('express').Router();
const { response } = require('express');
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', (req, res) => {
    // find all categories
    // be sure to include its associated Products
    Category.findAll({
            include: {
                model: Product,
                attributes: ['id', 'product_name', 'price', 'stock', 'category_id']
            }
        })
        .then(response => {
            if (!response) {
                res.status(404).json({ message: 'Cannot find categories!' });
                return;
            }
            res.json(response);
        })
        .catch(error => {
            console.log(error);
            res.status(500).json(error)
        });
});

router.get('/:id', (req, res) => {
    // find one category by its `id` value
    // be sure to include its associated Products
    Category.findOne({
            where: {
                id: req.params.id
            },
            include: {
                model: Product,
                attributes: ["id", "product_name", "price", "stock", "category_id"]
            }
        }).then(response => {
            if (!response) {
                res.status(404).json({ message: "No categories found" });
                return;
            }
            res.json(response);
        })
        .catch(error => {
            console.log(error);
            res.status(500).json(error)
        });
});

router.post('/', (req, res) => {
    // create a new category
    Category.create({
            category_name: req.body.category_name
        })
        .then(response => res.json(response))
        .catch(error => {
            console.log(error);
            res.status(500).json(error);
        });
});

router.put('/:id', (req, res) => {
    // update a category by its `id` value
    Category.update(req.body, {
            where: {
                id: req.params.id
            }
        })
        .then(response => {
            if (!response) {
                res.status(404).json({ message: 'Cannot find category with ID!' });
                return;
            }
            res.json(response);
        })
        .catch(error => {
            console.log(error);
            res.status(500).json(error);
        });
});



router.delete('/:id', (req, res) => {
    // delete a category by its `id` value
    Category.destroy({
            where: {
                id: req.params.id
            }
        })
        .then(response => {
            if (!response) {
                res.status(404).json({ message: 'Cannot find category with ID!' });
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
