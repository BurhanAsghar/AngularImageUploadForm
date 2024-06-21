// const express = require('express');
// const cors = require('cors');
// const app = express();
// const port = 3000;

// app.use(cors()); // Enable CORS
// app.use(express.json()); // Parse JSON bodies

// let users = [];

// app.get('/', (req, res) => {
//   res.send('Hello from Express!');
// });

// app.get('/users', (req, res) => {
//   res.send(users);
// });

// app.post('/users', (req, res) => {
//   const user = req.body;
//   users.push(user);
//   res.status(201).send(user);
// });

// app.listen(port, () => {
//   console.log(`Server running on http://localhost:${port}`);
// });


const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const app = express();
const port = 3000;

app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies
app.use('/uploads', express.static('uploads')); // Serve uploaded files

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Append extension
    }
});

const upload = multer({ storage: storage });

let users = [];

app.get('/', (req, res) => {
    res.send('Hello from Express!');
});

app.get('/users', (req, res) => {
    res.send(users);
});

app.post('/users', upload.single('profileImage'), (req, res) => {
    const user = {
        ...req.body,
        profileImage: req.file ? `/uploads/${req.file.filename}` : null
    };
    users.push(user);
    res.status(201).send(user);
});

// app.put('/users/:id', (req, res) => {
//     const user = users.find(u => u.id === req.params.id);
//     if (!user) {
//         return res.status(404).json({ error: 'User not found' });
//     }
//     const { name, email, password, rollnumber } = req.body;
//     if (name) user.name = name;
//     if (email) user.email = email;
//     if (password) user.password = password;
//     if (rollnumber) user.rollnumber = rollnumber;
//     res.json(user);
// });

// app.delete('/users/:id', (req, res) => {
//     const userIndex = users.findIndex(u => u.id === req.params.id);
//     if (userIndex === -1) {
//         return res.status(404).json({ error: 'User not found' });
//     }
//     users.splice(userIndex, 1);
//     res.status(204).send();
// });

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
