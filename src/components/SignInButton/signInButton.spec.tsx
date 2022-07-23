import { render, screen } from "@testing-library/react"
import { SignInButton } from "."
import { createMock } from "ts-jest-mock"
import { useSession } from "next-auth/client"

//Criação de mock tem um das suas utilizades fazer uma copia da funcionalidades externas(No caso a funcionalidade de next-auth/client)
jest.mock('next-auth/client') 

describe("SignInButton component", () => {

    it('renders correctly when user is not authenticated', () => {

        const useSessionMocked = createMock(useSession)        

        useSessionMocked.mockReturnValueOnce([null, false]); //somente para primeira renderização do componente

        render(<SignInButton />)
    
        expect(screen.getByText("Sign in with github")).toBeInTheDocument()

    })

    it('renders correctly when user is authenticated', () => {

        const useSessionMocked = createMock(useSession)        

        useSessionMocked.mockReturnValueOnce([
            {
                user: { name: "John Doe", email: "john.doe@example.com" },
                expires: 'fake-expires'
            }, 
            false
        ]); //somente para primeira renderização do componente

        render(<SignInButton />)
    
        expect(screen.getByText("John Doe")).toBeInTheDocument()
    })
    
})
