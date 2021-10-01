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

### Contexto do Projeto

![fluxo-de-aplicação (1)](https://user-images.githubusercontent.com/50894217/135559853-91b6c873-02ef-45a1-9709-460cfbd45b53.png)

