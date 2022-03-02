import { useRouter } from "next/dist/client/router";
import { signIn, useSession } from "../../../node_modules/next-auth/client";
import { getStripeJs } from "../../services/stripe-js";
import style from "./style.module.scss";

interface SubscribeButtonProps {
    priceId: string;
}

export function SubscribeButton({ priceId }: SubscribeButtonProps) {

    const [session] = useSession();
    const router = useRouter()

    async function handleSubscribe() {

        if (!session) {
            signIn("github") 
            return
        }

        if (session.activeSubscription) {
            router.push("/posts");
            return;
        }

        try {
            const resp = await fetch("/api/subscribe", {
                method: "post"
            })

            const { sessionId } = await resp.json();

            const stripe = await getStripeJs()

            await stripe.redirectToCheckout({ sessionId })

            console.log({
                sessionId ,
                resp    
            })

        } catch (error) {
            alert(error)
        }        

    }

    return (
        <button
            type="button"
            className={style.subscribeButton}
            onClick={handleSubscribe}
        >
            Subscribe now
        </button>
    )

}