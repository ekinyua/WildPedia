const request = require('supertest');
const express = require('express');
const authController = require('../../controllers/auth.controller');
const userModel = require('../../models/user.model');
const { comparePassword } = require('../../utils/password.utils');

// Mock dependencies
jest.mock('../../models/user.model');
jest.mock('../../utils/password.utils');
jest.mock('jsonwebtoken', () => ({
    sign: jest.fn().mockReturnValue('mocked-token')
}));

const app = express();
app.use(express.json());
app.post('/api/auth/login', authController.login);

describe('Auth Controller', () => {
    describe('login', () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });

        it('should return 401 for invalid username', async () => {
            userModel.findByUsername.mockResolvedValue(null);

            const response = await request(app)
                .post('/api/auth/login')
                .send({ username: 'nonexistent', password: 'password123' });

            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('message', 'Invalid username or password');
        });

        it('should return 401 for invalid password', async () => {
            userModel.findByUsername.mockResolvedValue({
                id: 1,
                username: 'testuser',
                password_hash: 'hashedpassword'
            });
            comparePassword.mockResolvedValue(false);

            const response = await request(app)
                .post('/api/auth/login')
                .send({ username: 'testuser', password: 'wrongpassword' });

            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('message', 'Invalid username or password');
        });

        it('should return 200 with token for valid credentials', async () => {
            const mockUser = {
                id: 1,
                username: 'testuser',
                email: 'test@example.com',
                password_hash: 'hashedpassword',
                role: 'user'
            };

            userModel.findByUsername.mockResolvedValue(mockUser);
            comparePassword.mockResolvedValue(true);
            userModel.updateLastLogin.mockResolvedValue();

            const response = await request(app)
                .post('/api/auth/login')
                .send({ username: 'testuser', password: 'password123' });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('token', 'mocked-token');
            expect(response.body.user).toHaveProperty('username', 'testuser');
            expect(userModel.updateLastLogin).toHaveBeenCalledWith(1);
        });
    });
});