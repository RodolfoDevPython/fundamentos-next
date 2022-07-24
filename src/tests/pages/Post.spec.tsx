import { render, screen } from "@testing-library/react";
import { getSession } from "next-auth/client";
import { createMock } from "ts-jest-mock";
import Post, { getServerSideProps } from "../../pages/posts/[slug]";
import { getPrismicClient } from "../../services/prismic";
// import { stripe } from "../../services/stripe";

const posts = { 
    slug: "my-new-post", 
    title: "My New Post", 
    content: "<p>Post except</p>", 
    updatedAt: "10 de Abril" 
};

jest.mock("next-auth/client");
jest.mock("../../services/prismic");

describe("Post page", () => {
    it("renders correctly", () => {
        render(<Post post={posts} />)

        expect(screen.getByText("My New Post")).toBeInTheDocument();
        expect(screen.getByText("Post except")).toBeInTheDocument();
    });

    it("redirects user if no subscription is found", async () => {
        const getSessionMocked = createMock(getSession);
        
        getSessionMocked.mockResolvedValueOnce({
            activeSubscription: null
        });
        
        const response = await getServerSideProps({ 
            params: { slug: 'my-new-post' } 
        } as any);

        expect(response).toEqual(
            expect.objectContaining({
                redirect: expect.objectContaining({ 
                    destination: '/' 
                })
            })
        )
         
    });

    it("loads initial data", async () => {
        const getSessionMocked = createMock(getSession);
        const getPrismicClientMocked = createMock(getPrismicClient);
        
        getPrismicClientMocked.mockReturnValue({
            getByUID: jest.fn().mockResolvedValueOnce({
                data: {
                    title: [
                        { type: "heading", text: "My new post" }
                    ],
                    content: [
                        { type: "paragraph", text: "Post content" }
                    ]
                },
                last_publication_date: '04-01-2021'
            })
        } as any)

        getSessionMocked.mockResolvedValueOnce({
            activeSubscription: 'fake-active-subscription' 
        });

        const response = await getServerSideProps({ 
            params: { slug: 'my-new-post' } 
        } as any);

        expect(response).toEqual(
            expect.objectContaining({
                props: {
                    post: {
                        slug: "my-new-post",
                        title: "My new post",
                        content: "<p>Post content</p>",
                        updatedAt: "01 de abril de 2021"
                    }
                }
            })
        )
        


    });
     
})