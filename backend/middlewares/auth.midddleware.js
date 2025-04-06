import jwt from 'jsonwebtoken';

export const isAuthenticated = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            return res.status(401).json({ 
                message: 'Authorization header missing', 
                success: false 
            });
        }

        if (!authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ 
                message: 'Invalid token format. Must be Bearer token', 
                success: false 
            });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ 
                message: 'Token missing', 
                success: false 
            });
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    return res.status(401).json({ 
                        message: 'Token expired', 
                        success: false 
                    });
                }
                return res.status(401).json({ 
                    message: 'Invalid token', 
                    success: false 
                });
            }
            
            req.userId = decode.id;
            next();
        });

    } catch (error) {
        console.log('Auth Middleware Error:', error);
        res.status(401).json({ 
            message: 'Authentication failed', 
            success: false,
            error: error.message 
        });
    }
};
