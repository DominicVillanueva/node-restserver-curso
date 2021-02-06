const express = require('express');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

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

// Configuraciones de Google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const { name, email, picture } = ticket.getPayload();
    return {
        nombre: name,
        email,
        img: picture,
        google: true,
    }
}

app.post('/google', async(req, res) => {
    let token = req.body.idtoken;
    let { nombre, email, img, google } = await verify(token)
        .catch((err) => {
            return res.status(403).json({
                ok: false,
                err
            });
        });

    UsuarioModel.findOne({ email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false.
                err,
            });
        }

        if (usuarioDB) {
            if (usuarioDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Debe de usar su autenticación normal',
                    },
                });
            } else {
                let token = jwt.sign({
                    usuario: usuarioDB,
                }, process.env.JWT_KEY, { expiresIn: process.env.CADUCIDAD_TOKEN });


                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token,
                });
            }
        } else {
            // Si el usuario no existe en nuestra BD
            let usuario = new UsuarioModel();
            usuario.nombre = nombre;
            usuario.email = email;
            usuario.img = img;
            usuario.google = google;
            usuario.password = ':)';

            usuario.save((err, usuarioDB) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                };

                let token = jwt.sign({
                    usuario: usuarioDB,
                }, process.env.JWT_KEY, { expiresIn: process.env.CADUCIDAD_TOKEN });


                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token,
                });
            });
        }
    });
})

module.exports = app;