const express = require('express');
const cors = require('cors');

const userRoutes = require('./routes/user');
const roleRoutes = require('./routes/role.route');
const authRoutes = require('./routes/auth.route');
const testRoutes = require('./routes/test.route');

const app = express();

const corsOption = {
    origin: 'http://localhost:3000'
};

app.use(cors(corsOption));

app.use(express.json());

app.use(express.urlencoded({extended: true}));

authRoutes(app);

testRoutes(app);

app.use(userRoutes);

app.use(roleRoutes);

app.listen(3000); 