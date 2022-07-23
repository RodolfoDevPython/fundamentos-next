import { render, screen } from "@testing-library/react"
import { Header } from "."

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

jest.mock('next-auth/client', () => {
    return {
        useSession() {
            return [null, false]
        }
    }
}) 

describe("Header component", () => {

    it('renders correctly', () => {
        render(
            <Header />
        )
    
        expect(screen.getByText("Home")).toBeInTheDocument()
        expect(screen.getByText("Posts")).toBeInTheDocument()
    })
    
})
