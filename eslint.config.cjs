module.exports = [
    {
        languageOptions: {
            globals: {
                document: "readonly",
                window: "readonly",
                console: "readonly",
                module: "readonly"
            }
        },
        rules: {
            "no-unused-vars": "warn",
            "no-undef": "error",
        }
    }
];