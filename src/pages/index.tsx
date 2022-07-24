import styles from "./home.module.scss";

import { GetStaticProps } from "next";

import Head from "next/head";
import { SubscribeButton } from "../components/SubscribeButton";
import { stripe } from "../services/stripe";
//Head faz o input de conteudo dentro da tag head de forma dinâmica

interface HomeProps {
  product: {
    priceId: string;
    amount: string;
  }  
}

export default function Home({ product }: HomeProps) {
  return (
    <>
      <Head>
        <title>Home | ig.news</title>
      </Head>
      <main className={styles.contentContainer}>

        <section className={styles.hero}>
          <span>👏 Hey, welcome</span>
          <h1>News about the <span>React</span> world.</h1>
          <p>
            Get acess to all the publications <br />
            <span>for {product.amount} month</span>
          </p>

          <SubscribeButton priceId={product.priceId} />

        </section>

        <img src="/images/avatar.svg" alt="Girl coding" />
      </main>
    </>
    
  )
}

//Modo SSR (Server Side Render)
// export const getServerSideProps: GetServerSideProps = async () => {

//   const price = await stripe.prices.retrieve('price_1JeWRwI3RejWguqqWvjKfQj5');

//   const product = { 
//     priceId: price.id,
//     amount: new Intl.NumberFormat('en-US', {
//       style: 'currency',
//       currency: 'USD'
//     }).format(price.unit_amount / 100),
//   }

//   return {
//     props: {
//       product
//     }
//   }
// }

//Modo SSG(Static Site Generation) faz com que esse componente não seja executado a todo momente
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