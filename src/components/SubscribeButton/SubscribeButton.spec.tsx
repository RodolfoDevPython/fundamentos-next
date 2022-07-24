import { fireEvent, render, screen } from "@testing-library/react";
import { signIn, useSession } from "next-auth/client";
import { SubscribeButton } from ".";
import { createMock } from "ts-jest-mock";
import { useRouter } from "next/dist/client/router";

//Criação de mock tem um das suas utilizades fazer uma copia da funcionalidades externas(No caso a funcionalidade de next-auth/client)
jest.mock('next-auth/client');
jest.mock('next/dist/client/router');

describe("SubscribeButton component", () => {

    it('renders correctly', () => {
        const useSessionMocked = createMock(useSession);

        useSessionMocked.mockReturnValueOnce([null, false]);

        render(<SubscribeButton />)

        expect(screen.getByText("Subscribe now")).toBeInTheDocument()
    })

    it('redirects user to sign in when not authenticated', () => {
        const signInMocked = createMock(signIn);
        const useSessionMocked = createMock(useSession);
        
        useSessionMocked.mockReturnValueOnce([null, false]);

        render(<SubscribeButton />)

        const subscribeButton = screen.getByText("Subscribe now");

        //simulação de um click sobre o botão
        fireEvent.click(subscribeButton);

        expect(signInMocked).toHaveBeenCalled() //verificar se a function signIn foi chamada
    })

    it('redirects to posts when user already has a subscription', () => {
        const useRouterMocked = createMock(useRouter);
        const useSessionMocked = createMock(useSession);   
        const pushMock = jest. fn();

        useSessionMocked.mockReturnValueOnce([
            {
                user: { name: "John Doe", email: "john.doe@example.com" },
                activeSubscription: 'fake-active-subscription',
                expires: 'fake-expires'
            }, 
            false
        ]); //somente para primeira renderização do componente

        useRouterMocked.mockReturnValueOnce({
            push: pushMock
        } as any)

        render(<SubscribeButton />);

        const subscribeButton = screen.getByText('Subscribe now');

        fireEvent.click(subscribeButton);

        expect(pushMock).toHaveBeenCalledWith("/posts");
    })
    
})
