const jwt = require('jsonwebtoken');

// =============
// Verificar token
// =============
let verificarToken = (req, res, next) => {
    let token = req.get('token'); // Authoritation
    jwt.verify(token, process.env.JWT_KEY, (err, payload) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: '¡No autorizado, verificar token!'
                }
            });
        }

        req.usuario = payload.usuario;
        next();
    });
};

/**
 * Verificar AdminRole
 */
let verificarAdminRole = (req, res, next) => {
    let usuario = req.usuario;
    let isAdmin = usuario.role === 'ADMIN_ROLE' ? true : false;
    if (!isAdmin) {
        return res.status(400).json({
            ok: false,
            err: {
                message: '¡No eres administrador!'
            }
        });
    }

    next();
};


module.exports = {
    verificarToken,
    verificarAdminRole
}