const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const Product = require('./db/Products');


require('./db/config');
const User = require('./db/User')
const jwtKey = 'e-comm';

app.use(express.json())
app.use(cors());
//****************************************************************************** */
const ValidateTokenHandeler = (req, res, next) => {
    let token = req.headers['authorization'];
    if(token){
        token = token.split(' ')[1];
        jwt.verify(token,jwtKey,(err,valid)=>{
            if(err){
                res.status(401)
                throw new Error("Please provide valid token!")
            }else{
                next();
            }
        })
    }else{
        res.status(401)
        throw new Error('Please add token with header!')
    }
}
//******************************************************************************** */
app.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            res.status(400);
            throw new Error('All fileds are mandatory!')
        }
        const userAvailable = await User.findOne({ email });
        if (userAvailable) {
            res.status(400);
            throw new Error('User already registered!')
        }
        const hashPasswrd = await bcrypt.hash(password.toString(), 10)
        const user = await User.create({
            name,
            email,
            password: hashPasswrd,
        })
        const accessToken = jwt.sign({
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
        },
            jwtKey, { expiresIn: '2h' },
        );
        if (user) {
            res.status(201).json({ user, accessToken, message: 'User is created successfully!' });
        } else {
            res.status(400).json({ message: 'User data is not valid!' })
        }
    } catch (err) {
        res.json({ message: err.message });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400);
            throw new Error('All fileds are mandatory!')
        }
        const user = await User.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password))) {
            const accessToken = jwt.sign({
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                },
            },
                jwtKey, { expiresIn: '2h' },
            );
            res.status(200).json({ user, accessToken });
        } else {
            res.status(401)
            throw new Error("Email and password not valid!")
        }
        return res.json({ user: user, message: "Login Successfully!" })
    } catch (err) {
        console.log(err.message);
    }

})

//add product api
//route: '/addProduct'
//access: public
app.post('/addProduct',ValidateTokenHandeler, async (req, res) => {
    try {
        const data = new Product(req.body);
        const product = await data.save();
        res.status(201).json({ product, message: 'Product added successfully!' })
    } catch (error) {
        console.log(error)
    }
})
app.get('/products', async (req, res) => {
    const product = await Product.find();
    if (product.length > 0) {
        res.status(200).json({ product })
    } else {
        res.status(400);
        throw new Error('No Data Found!')
    }
})

app.listen(5000);