const router = require('express').Router();
const { response } = require('express');
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', (req, res) => {
    // find all tags
    // be sure to include its associated Product response
    Tag.findAll({
            include: {
                model: Product,
                attributes: ['product_name', 'price', 'stock', 'category_id']
            }
        })
        .then(response => res.json(response))
        .catch(error => {
            console.log(error);
            res.status(500).json(error);
        });
});

router.get('/:id', (req, res) => {
    // find a single tag by its `id`
    // be sure to include its associated Product response
    Tag.findOne({
            where: {
                id: req.params.id
            },
            include: {
                model: Product,
                attributes: ['product_name', 'price', 'stock', 'category_id']
            }
        })
        .then(response => res.json(response))
        .catch(error => {
            console.log(error);
            res.status(500).json(error);
        });
});

router.post('/', (req, res) => {
    // create a new tag
    Tag.create({
            tag_name: req.body.tag_name
        })
        .then(response => res.json(response))
        .catch(error => {
            console.log(error);
            res.status(500).json(error);
        });
});

router.put('/:id', (req, res) => {
    // update a tag's name by its `id` value
    Tag.update(req.body, {
            where: {
                id: req.params.id
            }
        })
        .then(response => {
            if (!response) {
                res.status(404).json({ message: 'Cannot find tag with this ID!' });
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
    // delete on tag by its `id` value
    Tag.destroy({
            where: {
                id: req.params.id
            }
        })
        .then(response => {
            if (!response) {
                res.status(404).json({ message: 'Cannot find tag with this ID!' });
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