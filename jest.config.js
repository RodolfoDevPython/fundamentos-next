module.exports = {
    testPathIgnorePatterns: ["/node_modules/", "/.next/"],
    setupFilesAfterEnv: [
        "<rootDir>/src/tests/setupTest.ts" //arquivvos de setup para o jest executar antes de iniciar os testes 
    ],
    transform: {
        "^.+\\.(js|jsx|ts|tsx)$": "<rootDir>/node_modules/babel-jest"
    }, //Configuração usada para transforma os arquivos escritos em typescript - O jest não entende typescript
    testEnvironment: 'jsdom',
    moduleNameMapper: {
        "\\.(scss|css|scss)$": "identity-obj-proxy"
    }
};