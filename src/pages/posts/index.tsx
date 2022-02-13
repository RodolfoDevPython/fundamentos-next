import { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import styles from "./styles.module.scss";
import Prismic from "@prismicio/client";
import { getPrismicClient } from "../../services/prismic";
import { RichText } from "prismic-dom"

type Post = {
    slug: string;
    title: string;
    excerpt: string;
    updatedAt: string
}

interface PostProps {
    posts: Post[]
}

export default function Posts({ posts }: PostProps) {

    return(
        <>
            <Head>
                <title>Posts | Ignews</title>
            </Head>

            <main className={styles.container}>
                <div className={styles.posts}>
                    {
                        posts.map( ({ slug, updatedAt, title, excerpt }) => (
                            <Link href={`/posts/${slug}`} >
                                <a key={slug} >
                                <time>{updatedAt}</time>
                                <strong>{title}</strong>
                                <p>{excerpt}</p>
                            </a>
                            </Link>
                            
                        ))
                    }
                    
                </div>
            </main>
        </>
    )

}

//Essa page vai ser estatica para evitar gastar recursos de busca de conteúdos no PRISMIC CMS
export const getStaticProps: GetStaticProps = async () => {

    const prismic = getPrismicClient();
    const response = await prismic.query(
        [
            Prismic.predicates.at("document.type", "pos")//where -> pegar todos os documentos que sejam do tipo pos(esse pos foi criado no admin do Prismic)
        ], {
            fetch: [
                "title", 
                "content"
            ],
            pageSize: 100
    });

    

    const posts = response.results.map(post => {

        return {
            slug: post.id,
            title: RichText.asText(post.data.title),
            excerpt: post.data.content.find(content => content.type == "paragraph")?.text ?? "",
            updatedAt: new Date(post.last_publication_date).toLocaleDateString("pt-BR", {
                day: '2-digit',
                month: "long",
                year: 'numeric'
            })
        }

    })
    
    return {
        props: {
            posts
        }
    }
}