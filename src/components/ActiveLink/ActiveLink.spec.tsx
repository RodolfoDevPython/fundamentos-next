import { render, screen } from "@testing-library/react"
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

describe("ActiveLink component", () => {

    it('renders correctly', () => {
        render(
    
            <ActiveLink href="/" activeClassName="active">
                <a>Home</a>
            </ActiveLink>
        )
    
        expect(screen.getByText("Home")).toBeInTheDocument()
    })
    
    it('adds active class if the link as currently active', () => {
        render(
            <ActiveLink href="/" activeClassName="active">
                <a>Home</a>
            </ActiveLink>
        )
    
        expect(screen.getByText("Home")).toHaveClass("active")
    })

})
