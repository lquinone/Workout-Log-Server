// const Express = require("express").Router;
const router = require("express").Router();
const { User } = require("../models");
const { UniqueConstraintError } = require("sequelize/lib/errors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

router.post("/register", async (req, res) => {
    let { username, passwordhash } = req.body.user;
    try {
        const newUser = await User.create({
            username,
            passwordhash: bcrypt.hashSync(passwordhash, 13),
        });
        let token = jwt.sign({id: newUser.id}, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24 });

        res.status(201).json({
            message: "User successfully logged in!",
            user: newUser,
            sessionToken: token
        });
    } catch (err) {
        console.log(err);
        if (err instanceof UniqueConstraintError) {
            res.status(409).json({
                message: "Username already in use",
            });
        } else {
            res.status(500).json({
                message: "Failed to register user",
            });
        }
    }
});

router.post("/login", async (req, res) => {
    let { username, passwordhash } = req.body.user;
    try {
        const loginUser = await User.findOne({
            where: {
                username: username,
            },
        });
        if (loginUser) {
            let passwordComparison = await bcrypt.compare(passwordhash, loginUser.passwordhash);
            if (passwordComparison) {
                let token = jwt.sign({ id: loginUser.id }, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24 });

                res.status(201).json({
                    user: loginUser,
                    message: "User successfully logged in!",
                    sessionToken: token
                });
            } else {
                res.status(401).json({
                    message: "Incorrect email or password"
                })
            }
        } else {
            res.status(401).json({
                message: "Incorrect email or password"
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Failed to log user in"
        })
    }
});


module.exports = router;