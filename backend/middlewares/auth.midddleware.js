import jwt from 'jsonwebtoken';

export const isAuthenticated = async (req, res, next) => {
    try {
        // const authHeader = req.headers['authorization'];
        // if (!authHeader) {
        //     return res.status(401).json({ message: 'No token provided', success: false });
        // }

        const token = req.headers['authorization'].split(' ')[1]; // Fixing split('') issue
        if (!token) {
            return res.status(401).json({ message: 'Token missing', success: false });
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
            if (err) {
                return res.status(401).json({ message: 'Auth failed', success: false });
            } else {
                req.userId = decode.id;
                next();
            }
        });

    } catch (error) {
        console.log(error);
        res.status(401).json({ message: 'Auth Failed', success: false });
    }
};
