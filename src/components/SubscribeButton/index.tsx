import { signIn, useSession } from "next-auth/client";
import { useRouter } from "next/dist/client/router";
import { getStripeJs } from "../../services/stripe-js";
import style from "./style.module.scss";

export function SubscribeButton() {

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