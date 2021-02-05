const express = require('express');
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const UsuarioModel = require('../models/usuario.model');

const app = express();

app.post('/login', (req, res) => {

    let body = req.body;

    UsuarioModel.findOne({ email: body.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: '¡Correo no registrado!',
                }
            })
        }

        let isValidPassword = bcrypt.compareSync(body.password, usuarioDB.password);
        if (!isValidPassword) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: '¡Contraseña incorrecta!',
                }
            })
        }

        let token = jwt.sign({
            usuario: usuarioDB,
        }, process.env.JWT_KEY, { expiresIn: process.env.CADUCIDAD_TOKEN });

        res.json({
            ok: true,
            usuario: usuarioDB,
            token,
        });
    });
});

module.exports = app;