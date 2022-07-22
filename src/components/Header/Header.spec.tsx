import { render } from "@testing-library/react"
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

describe("Header component", () => {

    it('renders correctly', () => {
        const { getByText } = render(
            <Header />
        )
    
        expect(getByText("Home")).toBeInTheDocument()
        expect(getByText("Posts")).toBeInTheDocument()
    })
    
})
