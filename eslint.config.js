const security = require('eslint-plugin-security');

module.exports = [
    // Only scan JavaScript files
    {
        files: ['**/*.js'],
        plugins: {
            security: security
        },
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
            globals: {
                console: 'readonly',
                process: 'readonly',
                require: 'readonly',
                module: 'readonly',
                __dirname: 'readonly',
                fetch: 'readonly',
                Buffer: 'readonly'
            }
        },
        rules: {
            'security/detect-object-injection': 'warn',
            'security/detect-non-literal-fs-filename': 'warn',
            'security/detect-child-process': 'warn',
            'no-console': 'off',
            'no-unused-vars': 'warn'
        }
    },
    // Ignore HTML and other non-JS files
    {
        ignores: [
            '**/*.html',
            '**/*.css',
            'node_modules/**',
            'database/**',
            'public/**',
            '*.log',
            'package-lock.json'
        ]
    }
];
