# Teste React

## Preparando o Ambiente

Para iniciar com os nossos teste precisamos adicionar algumas dependencias importantes. Basta instalar as seguintes libs

```shell
yarn add jest jest-dom @testing-library/jest-dom @testing-library/dom @testing-library/react babel-jest -D
```

Configuramos os arquivos de babel.config.js e jest.config.js


```js
//arquivo -> babel.config.js
module.exports = {
    presets: ["next/babel"]
}
```

```js
//arquivo -> jest.config.js
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
        "\\.(scss|css|scss)$": "identity-obj-proxy" //precisamos instalar essa lib identity-obj-proxy para trabalhar com css.module
    }
};
```



### Jest 

[Jest](https://jestjs.io/pt-BR/) é um poderoso Framework de Testes em JavaScript com um foco na simplicidade.

#### mock

[Funções de simulação ( mocks em inglês )](https://jestjs.io/pt-BR/docs/mock-functions) permitem que você teste os links entre códigos, apagando a implementação real de uma função, capturando chamadas para a função (e os parâmetros passados nessas chamadas), capturar instâncias do construtor de funções quando instanciado com new, e permitindo configuração em tempo de teste de valores de retorno.

Existem duas maneiras de simular funções: Seja criando uma função simulada para usar no código de teste, ou escrevendo uma simulação manual para sobrescrever uma dependência de modulo.

Exemplo da aplicação de um mock realizando um teste em um componente
~

```jsx
//Component
import { useRouter } from "next/dist/client/router";

export function ActiveLink({ children, activeClassName, ...rest }: ActiveLinkProps) {

    const { asPath } = useRouter();
    
    const className = asPath === rest.href
    ? activeClassName
    : '';

    return (
        <div className>
            {...children}
        </div>
    )
}
```

```jsx
//Test Component               
import { render } from "@testing-library/react"
import { ActiveLink } from "."

//Criação de mock tem um das suas utilizades fazer uma copia da funcionalidades externas(No caso a funcionalidade de router do next)
jest.mock('next/dist/client/router', () => {
    return {
        useRouter() {
            return {
                asPath: '/'
            }
        }
    }
}) 


test('active link renders correctly', () => {
    const { debug } = render(

        <ActiveLink href="/" activeClassName="active">
            <a>Home</a>
        </ActiveLink>
    )

    debug()

})
```
> a function debug é responsável por exibir pelo terminal como está sendo gerado o "HTML Virtual" para a execução dos teste

#### ts-jest-mock

Usando o pacote mocked dentro ts-jest conseguimos resolver um problema de mock.

```shell
yarn add ts-jest-mock -D
```

Segue um exemplo de um cenário:

Precisamos testar o nosso componente SignInButton. 

Dessa forma vamos adicionar o mock 
```jsx
import { signIn , useSession, signOut } from "next-auth/client";

export function SignInButton() {

    const [session] = useSession();

    return session ? (
        <button 
            type="button"
            onClick={() => signOut()}
        >
            Logado
        </button>
    ) :
    (
        <button 
            type="button"
            onClick={() => signIn("github")}
        >
            Sign in with github
        </button>   
    )
}
```

como já sabemos para realizar um teste nesse componente, vamos precisar fazer o mock do next-auth/client.

```js
jest.mock('next-auth/client', () => {
    return {
        useSession() {
            return [null, false]
        }
    }
}) 
```

para não precisar adicionar um outro mock para testar outro cenário do useSession, seguimos da seguinte forma:

Adicionamos somente uma referencia para criação do mock no next-auth/client

```js
jest.mock('next-auth/client') 
```

Depois adicionamos o mocked do ts-jest/utils para realizar o teste em um cenário especifico sem precisar reescrever todo o jest.mock. Segue o exemplo abaixo

```js
describe("SignInButton component", () => {

    it('renders correctly when user is not authenticated', () => {

        const useSessionMocked = createMock(useSession)        

        useSessionMocked.mockReturnValue([null, false]); //aplica a anteração de state do mock antes de renderiar o componente

        const {debug} = render(<SignInButton />)
    
        expect(screen.getByText("Sign in with github")).toBeInTheDocument()

        debug()
    })
})
```


#### expect

Dentro do expect podemos recuperar se uma função foi chamada. exemplo

```js

    it('redirects user to sign in when not authenticated', () => {
        const signInMocked = createMock(signIn);
        const useSessionMocked = createMock(useSession);
        
        useSessionMocked.mockReturnValueOnce([null, false]);

        render(<SubscribeButton />)

        const subscribeButton = screen.getByText("Subscribe now");

        //simulação de um click sobre o botão
        fireEvent.click(subscribeButton);

        expect(signInMocked).toHaveBeenCalled() //verificar se a function 
    })

```

Podemos verificar se a função foi chamada utilizando algum parametro especifico. Basta realizar a troca de toHaveBeenCalled() por toHaveBeenCalledWith("/{parametro especifico}")