const Joi = require('joi');

const schemas = {
    updateRole: Joi.object({
        role: Joi.string()
            .valid('user', 'moderator', 'admin')
            .required()
            .messages({
                'any.only': 'Role must be either user, moderator, or admin'
            })
    }),

    // Cultural content validation schemas
    culturalContent: Joi.object({
        speciesId: Joi.string().required(),
        contentType: Joi.string().valid('myth', 'legend', 'proverb').required(),
        title: Joi.string().min(3).max(255).required(),
        content: Joi.string().min(10).required(),
        language: Joi.string().valid('en', 'rw', 'sw').default('en'),
        source: Joi.string().allow('', null)
    }),

    culturalContentUpdate: Joi.object({
        title: Joi.string().min(3).max(255),
        content: Joi.string().min(10),
        source: Joi.string().allow('', null)
    }).min(1),

    contentModeration: Joi.object({
        status: Joi.string().valid('pending', 'approved', 'rejected').required(),
        reason: Joi.string().when('status', {
            is: 'rejected',
            then: Joi.required(),
            otherwise: Joi.optional()
        })
    }),

    // Species facts validation schemas
    speciesFact: Joi.object({
        speciesId: Joi.string().required(),
        category: Joi.string().valid(
            'habitat',
            'behavior',
            'diet',
            'reproduction',
            'conservation',
            'distribution',
            'physical_characteristics',
            'ecological_role',
            'human_use',
            'other'
        ).required(),
        fact: Joi.string().min(10).required(),
        sourceReference: Joi.string().required()
    }),

    speciesFactUpdate: Joi.object({
        category: Joi.string().valid(
            'habitat',
            'behavior',
            'diet',
            'reproduction',
            'conservation',
            'distribution',
            'physical_characteristics',
            'ecological_role',
            'human_use',
            'other'
        ),
        fact: Joi.string().min(10),
        sourceReference: Joi.string()
    }).min(1),

    signup: Joi.object({
        username: Joi.string()
            .alphanum()
            .min(3)
            .max(50)
            .required()
            .messages({
                'string.min': 'Username must be at least 3 characters long',
                'string.max': 'Username cannot exceed 50 characters'
            }),

        email: Joi.string()
            .email()
            .required()
            .messages({
                'string.email': 'Please provide a valid email address'
            }),

        password: Joi.string()
            .min(8)
            .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])'))
            .required()
            .messages({
                'string.min': 'Password must be at least 8 characters long',
                'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
            }),

        full_name: Joi.string().max(100),
        bio: Joi.string(),
        location: Joi.string().max(100),
        organization: Joi.string().max(100),
        expertise_area: Joi.string().max(100)
    }),

    login: Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required()
    }),

    updateProfile: Joi.object({
        full_name: Joi.string().max(100),
        bio: Joi.string(),
        location: Joi.string().max(100),
        organization: Joi.string().max(100),
        expertise_area: Joi.string().max(100)
    }).min(1),

    changePassword: Joi.object({
        currentPassword: Joi.string().required(),
        newPassword: Joi.string()
            .min(8)
            .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])'))
            .required()
            .messages({
                'string.min': 'Password must be at least 8 characters long',
                'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
            })
    }),

    resetPassword: Joi.object({
        token: Joi.string().required(),
        newPassword: Joi.string()
            .min(8)
            .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])'))
            .required()
    }),

    requestReset: Joi.object({
        email: Joi.string().email().required()
    }),

    quizResult: Joi.object({
        correctAnswers: Joi.number().integer().min(0).required(),
        totalQuestions: Joi.number().integer().min(1).required()
    }),
};

const validateRequest = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });

        if (error) {
            const errors = error.details.map(detail => ({
                field: detail.path[0],
                message: detail.message
            }));

            return res.status(400).json({
                message: "Validation failed",
                errors
            });
        }

        next();
    };
};

module.exports = {
    validateRequest,
    schemas
};