const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const UsuarioModel = require('../models/usuario.model');
const { verificarToken, verificarAdminRole } = require('../middlewares/autenticacion');
const app = express();

app.get('/usuario', verificarToken, (req, res) => {
    let desde = Number(req.query.desde) || 0;
    let limite = Number(req.query.limite) || 5;

    UsuarioModel.find({ estado: true }, 'nombre email role estado google img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            UsuarioModel.countDocuments({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    cantidad: conteo,
                    usuarios
                })
            })
        });

});

app.post('/usuario', [verificarToken, verificarAdminRole], (req, res) => {

    const { nombre, email, password, role } = req.body;

    let usuario = new UsuarioModel({
        nombre,
        email,
        password: bcrypt.hashSync(password, 10),
        role
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        })
    })
})

app.put('/usuario/:id', [verificarToken, verificarAdminRole], (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    UsuarioModel.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
})

app.delete('/usuario/:id', [verificarToken, verificarAdminRole], (req, res) => {
    let id = req.params.id;

    let cambiaEstado = {
        estado: false
    };

    // UsuarioModel.findByIdAndRemove(id, ['estado'], { new: true, runValidators: true }, (err, usuarioActualizado) => {

    UsuarioModel.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioActualizado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!usuarioActualizado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            usuario: usuarioActualizado
        });
    })
})

module.exports = app;