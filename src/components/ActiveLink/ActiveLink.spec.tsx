import { render } from "@testing-library/react"
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
        const { getByText } = render(
    
            <ActiveLink href="/" activeClassName="active">
                <a>Home</a>
            </ActiveLink>
        )
    
        expect(getByText("Home")).toBeInTheDocument()
    })
    
    it('adds active class if the link as currently active', () => {
        const { getByText } = render(
            <ActiveLink href="/" activeClassName="active">
                <a>Home</a>
            </ActiveLink>
        )
    
        expect(getByText("Home")).toHaveClass("active")
    })

})
