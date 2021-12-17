import { NextApiRequest, NextApiResponse } from "next";
import { Readable } from "stream";
import Stripe from "stripe";
import { stripe } from "../../services/stripe";


//convert readable stream in string
async function buffer(readable: Readable) {
    const chunks = [];

    for await (const chunk of readable) {
        chunks.push(
            typeof chunk === "string" ? Buffer.from(chunk) : chunk
        );
    }

    return Buffer.concat(chunks);

}


//desabilitar o formato padrão de json das request do next 
//pq precisamos pegar uma stream e não um json 
export const config = {
    api: {
        bodyParser: false
    }
}

const relevantEvents = new Set([
    'checkout.session.completed'
])

export default async (req: NextApiRequest, res: NextApiResponse) => {

    console.log("webhooks");

    if (req.method === "POST") {
        const buf = await buffer(req)
        const secret = req.headers['stripe-signature'];

        let event: Stripe.Event;

        try {
            event = stripe.webhooks.constructEvent(buf, secret, "");
        } catch (error) {
            return res.status(400).send(`Webhook error: ${error.message}`);
        }

        const { type } = event;

        if (relevantEvents.has(type)) {

            try {

                switch (type) {
                    case "checkout.session.completed":
                        break;
                    default:
                        throw new Error("Unhandled event");
                }    

            } catch (error) {
                return res.json({ error: "Webhook handler failed" })    
            }
            
        }
        
        res.status(200).json({
            ok: true
        })

        

    } else {
        res.setHeader("Allow", "POST")
        res.status(405).end("Method not allowed")
    }
    
}