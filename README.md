### Fundamentos Next

#### _app.tsx 
- É o arquivo responsavel por renderizar todos os nosso componentes...

Toda interação de paginas esse arquivos recarega todos os componentes / estados.

#### _document.tsx 
- É responsável por carregar nossos script uma única vez... 
ex: carregamento de fontes
 
#### Regra para Criar Pages:

- Dentro do Pages todos os Jsx devem ser exportados como default 

ex: export default

obs: todo arquivo tsx que não seja o _app nem o _document virá uma página.. isso acontece por causa do File Route do Next


#### Regra para pasta dentro do pages / api :
- Se precisar criar uma pasta que não seja uma rota precisamos criar a pasta com _ na frente do nome. 

ex: pasta _lib dentro da pasta api

#### Regra para trabalhar com imgs no Next:

- Para usar imagens precisamos somente adicionar elas na pasta public e basta só importa o nome da imagens sem precisar

```jsx
// ex: 
// public/images/banner.png

export function Header() {
    return (
        <header>
            <div>
                <img src="/images/banner.png" alt="" />
            </div>
        </header>
    );
}

```

#### Chamadas a api via server-side

- Para usamos chamadas api não usamos o useEffect. O useEffect é executado somente no client(Browser).
- Como fazer essa chamada pelo server


```jsx
// O nome da function sempre deve ser getServerSideProps para que o next entenda 
// Sempre deve seguir esse padrão conforme mostramos abaixo

import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
        ...
    }
  }
}

//obs: O getServerSideProps ele só é executado no servidor e não no client

```

#### SSG (Static Site Generation)


```jsx
//será renderizado um conteúdo estático sem que precise remontar toda a pagina
///só será remontado essa página quando a props revalidate estiver com o tempo escotado.

import { GetStaticProps } from "next";

export const getStaticProps: GetStaticProps = async () => {

  const price = await stripe.prices.retrieve('price_1JeWRwI3RejWguqqWvjKfQj5');

  const product = { 
    priceId: price.id,
    amount: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price.unit_amount / 100),
  }

  return {
    props: {
      product
    },
    revalidate: 60 * 60 * 24, //24 hours
  }
}
```

Uma propriedade important no SSG é o getStaticPaths

```jsx
  export const getStaticPaths = () => {
      return {
          paths: [], //-> Serve para indicar quais páginas serão geradas de forma estática durante o build
          fallback: 'blocking'
      }
  }
```
Caso o atributo paths do getStaticPaths esteja vazio, a geração das páginas será estáticas no primeiro acesso.

obs: getStaticPaths só funcionam com páginas que tenham parametros dinâmicos.


#### API ROUTERS NEXT (Criando Rota pelo Next)

- Para Criar uma Rota no Next precisamos criar uma pasta chamada /api dentro da pasta pages. Onde cada arquivo vai ser um rota da nossa app
- Toda api routers elas são criada e executadas com o conceito de serverless.

```jsx
//segue um exemplo de uma rota que exibe uma lista de usuarios
import { NextApiRequest, NextApiResponse }  from "next"

export default (request: NextApiRequest, response: NextApiResponse)  => {

  const users = [
    { id: 1, name: "Rodolfo" },
    { id: 2, name: "Romulo" },
    { id: 3, name: "Rivan" }
  ]

  return response.json(users)
}

```

obs: A Camada de services que usam as variaveis .env(process.env) não podem ser executadas do lado do client(Não podem ser usadas direto no componente executado pelo Browser) e sim do servidor.
tanto usando api Routes Next ou usam o Modo SSG(Static Site Generation).

##### Parametrização nas Rotas de api do Next

Quando precisamos capturar(Criar) os parametros da nossa rota precisamos seguir os seguintes passos:

- Criar uma pasta que vai ser o nome da rota colocamos
 ex: 
    users/
      [id].tsx -> esse [id] é o nome do paramentro podemos usar [...id] que ira pegar todos os parametros dessa rota de users
      index.tsx

[link para doc completa](https://next-auth.js.org/getting-started/example)


#### Usando variaveis de ambiente pelo cliente

Quando criamos variaveis de ambiente e precisamos acessar pelo cliente 

``` js
import { loadStripe } from "@stripe/stripe-js";

export async function getStripeJs() {
    const stripeJs = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

    return stripeJs
}
```

precisamos usar o prefix NEXT_PUBLIC na frente das variaveis de ambiente 

ex: Doc de .env.local

``` 
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_51JeWQFI3RejWguqqeCtnmgApKhG65A1VZcCJm6KsG6iMss9sa5Y6wPlQm1GiqRJtQrZ1k6U7PmVaHsoGFcxP2hli00w079ZU6D

```
#### Estrategias para Autenticação no Front-End

- JWT (Storage)
- Next Auth (Social)
- Cognito, Auth0
### Contexto do Projeto

![fluxo-de-aplicação (1)](https://user-images.githubusercontent.com/50894217/135559853-91b6c873-02ef-45a1-9709-460cfbd45b53.png)1
