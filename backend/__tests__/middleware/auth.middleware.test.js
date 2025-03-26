const { verifyToken, isAdmin, isModerator } = require('../../middleware/auth.middleware');
const jwt = require('jsonwebtoken');
const userModel = require('../../models/user.model');

// Mock dependencies
jest.mock('jsonwebtoken');
jest.mock('../../models/user.model');
jest.mock('../../config/auth.config', () => ({ jwtSecret: 'test-secret' }));

describe('Auth Middleware', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            headers: {
                authorization: 'Bearer test-token'
            }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
        jest.clearAllMocks();
    });

    describe('verifyToken', () => {
        it('should return 403 if no token provided', async () => {
            req.headers.authorization = undefined;

            await verifyToken(req, res, next);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ message: 'No token provided' });
            expect(next).not.toHaveBeenCalled();
        });

        it('should return 401 if invalid token', async () => {
            jwt.verify.mockImplementation(() => {
                throw new Error('Invalid token');
            });

            await verifyToken(req, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: 'Invalid or expired token' });
            expect(next).not.toHaveBeenCalled();
        });

        it('should return 403 if user not found', async () => {
            jwt.verify.mockReturnValue({ username: 'testuser' });
            userModel.findByUsername.mockResolvedValue(null);

            await verifyToken(req, res, next);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ message: 'User no longer valid' });
            expect(next).not.toHaveBeenCalled();
        });

        it('should return 403 if user is inactive', async () => {
            jwt.verify.mockReturnValue({ username: 'testuser' });
            userModel.findByUsername.mockResolvedValue({
                username: 'testuser',
                is_active: false
            });

            await verifyToken(req, res, next);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ message: 'User no longer valid' });
            expect(next).not.toHaveBeenCalled();
        });

        it('should call next() for valid token and active user', async () => {
            const mockUser = {
                username: 'testuser',
                is_active: true,
                role: 'user'
            };

            jwt.verify.mockReturnValue({ id: 1, username: 'testuser' });
            userModel.findByUsername.mockResolvedValue(mockUser);

            await verifyToken(req, res, next);

            expect(next).toHaveBeenCalled();
            expect(req.user).toHaveProperty('username', 'testuser');
            expect(req.user).toHaveProperty('isAdmin', false);
            expect(req.user).toHaveProperty('isModerator', false);
        });

        it('should set isAdmin and isModerator flags for admin users', async () => {
            const mockUser = {
                username: 'admin',
                is_active: true,
                role: 'admin'
            };

            jwt.verify.mockReturnValue({ id: 1, username: 'admin' });
            userModel.findByUsername.mockResolvedValue(mockUser);

            await verifyToken(req, res, next);

            expect(next).toHaveBeenCalled();
            expect(req.user).toHaveProperty('isAdmin', true);
            expect(req.user).toHaveProperty('isModerator', true);
        });
    });

    describe('isAdmin', () => {
        it('should return 403 if user is not an admin', () => {
            req.user = { role: 'user' };

            isAdmin(req, res, next);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ message: 'Admin access required' });
            expect(next).not.toHaveBeenCalled();
        });

        it('should call next() if user is an admin', () => {
            req.user = { role: 'admin' };

            isAdmin(req, res, next);

            expect(next).toHaveBeenCalled();
        });
    });

    describe('isModerator', () => {
        it('should return 403 if user is not a moderator or admin', () => {
            req.user = { role: 'user' };

            isModerator(req, res, next);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ message: 'Moderator access required' });
            expect(next).not.toHaveBeenCalled();
        });

        it('should call next() if user is a moderator', () => {
            req.user = { role: 'moderator' };

            isModerator(req, res, next);

            expect(next).toHaveBeenCalled();
        });

        it('should call next() if user is an admin', () => {
            req.user = { role: 'admin' };

            isModerator(req, res, next);

            expect(next).toHaveBeenCalled();
        });
    });
});