const express = require('express');
const router = express.Router();
const db = require('../database/db');

router.get('/', (req, res) => {
    db.query('SELECT * FROM animals', (err, results) => {
        if (err) return res.status(500).json({ message: 'Error fetching animals.' });
        res.json(results);
    });
});

router.post('/', (req, res) => {
    const { nama_spesies, jumlah_hewan } = req.body;
    if (!nama_spesies || !jumlah_hewan) return res.status(400).json({ message: 'Invalid input.' });

    const sql = 'INSERT INTO animals (nama_spesies, jumlah_hewan) VALUES (?, ?)';
    db.query(sql, [nama_spesies, jumlah_hewan], (err, result) => {
        if (err) return res.status(500).json({ message: 'Error adding animal.' });
        res.status(201).json({ id: result.insertId });
    });
});

router.put('/:id', (req, res) => {
    const { nama_spesies, jumlah_hewan } = req.body;
    const { id } = req.params;
    const sql = 'UPDATE animals SET nama_spesies = ?, jumlah_hewan = ? WHERE id = ?';

    db.query(sql, [nama_spesies, jumlah_hewan, id], (err, result) => {
        if (err || result.affectedRows === 0) return res.status(500).json({ message: 'Error updating animal.' });
        res.status(200).json({ id });
    });
});

router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM animals WHERE id = ?';

    db.query(sql, [id], (err, result) => {
        if (err || result.affectedRows === 0) return res.status(500).json({ message: 'Error deleting animal.' });
        res.status(204).send();
    });
});

module.exports = router;