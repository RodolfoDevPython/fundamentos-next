import { render, screen } from "@testing-library/react";
import { useSession } from "next-auth/client";
import { useRouter } from "next/dist/client/router";
import { createMock } from "ts-jest-mock";
import PostPreview, { getStaticProps } from "../../pages/posts/preview/[slug]";
import { getPrismicClient } from "../../services/prismic";
// import { stripe } from "../../services/stripe";

const posts = { 
    slug: "my-new-post", 
    title: "My New Post", 
    content: "<p>Post except</p>", 
    updatedAt: "10 de Abril" 
};

jest.mock("next-auth/client");
jest.mock('next/dist/client/router');
jest.mock("../../services/prismic");

describe("Post preview page", () => {
    it("renders correctly", () => {
        const useSessionMocked = createMock(useSession);

        useSessionMocked.mockReturnValueOnce([null, false]);

        render(<PostPreview post={posts} />)

        expect(screen.getByText("My New Post")).toBeInTheDocument();
        expect(screen.getByText("Post except")).toBeInTheDocument();
        expect(screen.getByText("Wanna continue reading?")).toBeInTheDocument();
    });

    it("redirects user to full post when user is subscribed", async () => {
        const useSessionMocked = createMock(useSession);
        const useRouterMocked = createMock(useRouter);
        const pushMock = jest.fn()

        useSessionMocked.mockReturnValueOnce([
            { activeSubscription: 'fake-active-subscription' },
            false
        ] as any);

        useRouterMocked.mockReturnValueOnce({
            push: pushMock
        } as any)

        render(<PostPreview post={posts} />)

        expect(pushMock).toHaveBeenCalledWith("/posts/my-new-post") 
        
    });

    it("loads initial data", async () => {

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

        const response = await getStaticProps({ 
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