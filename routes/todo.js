const express = require('express');
const router = express.Router();

let todos = [
    { id: 1, nama_spesies: 'Kucing', jumlah_hewan: 5 },
    { id: 2, nama_spesies: 'Anjing', jumlah_hewan: 3 },
];

router.get('/', (req, res) => {
    console.log('GET /todos berhasil diakses');
    res.json(todos);
});

router.post('/', (req, res) => {
    const { nama_spesies, jumlah_hewan } = req.body;

    if (!nama_spesies || jumlah_hewan === undefined) {
        return res.status(400).json({ message: 'Nama spesies dan jumlah hewan harus diisi' });
    }

    const newTodo = {
        id: todos.length > 0 ? todos[todos.length - 1].id + 1 : 1,
        nama_spesies,
        jumlah_hewan: parseInt(jumlah_hewan),
    };

    todos.push(newTodo);
    console.log('POST /todos: Data ditambahkan', newTodo);
    res.status(201).json(newTodo);
});

router.delete('/:id', (req, res) => {
    const todoIndex = todos.findIndex(t => t.id === parseInt(req.params.id));

    if (todoIndex === -1) {
        return res.status(404).json({ message: 'Data tidak ditemukan' });
    }

    const deletedTodo = todos.splice(todoIndex, 1)[0];
    console.log('DELETE /todos: Data dihapus', deletedTodo);
    res.status(200).json({ message: `Data '${deletedTodo.nama_spesies}' telah dihapus` });
});

router.put('/:id', (req, res) => {
    const todo = todos.find(t => t.id === parseInt(req.params.id));

    if (!todo) {
        return res.status(404).json({ message: 'Data tidak ditemukan' });
    }

    const { nama_spesies, jumlah_hewan } = req.body;

    todo.nama_spesies = nama_spesies || todo.nama_spesies;
    todo.jumlah_hewan = jumlah_hewan !== undefined ? parseInt(jumlah_hewan) : todo.jumlah_hewan;

    console.log('PUT /todos: Data diperbarui', todo);
    res.status(200).json({ message: `Data dengan ID ${todo.id} telah diperbarui`, updatedTodo: todo });
});

module.exports = router;