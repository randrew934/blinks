import {
  ActionGetResponse,
  ActionPostRequest,
  ActionPostResponse,
  createPostResponse,
  createActionHeaders,
} from "@solana/actions";
import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  clusterApiUrl,
} from "@solana/web3.js";

// create the standard headers for this route (including CORS)
const headers = createActionHeaders();

// GET request handler
export async function GET(request: Request) {
  const url = new URL(request.url);
  const payload: ActionGetResponse = {
    icon: "https://opengraph.b-cdn.net/production/images/c1717d90-8f85-4be3-b2e3-c1a69ce5ba8e.jpg?token=ohoLEhUik6X74fqi5dsd0M3r3V7eJYzeXs_t-gRPma8&height=1080&width=810&expires=33265514795", // Local icon path
    title: "Donate to Ral Andrew",
    description: "Support Ral Andrew by donating SOL.",
    label: "Donate",
    links: {
      actions: [
        {
          label: "Donate 0.1 SOL",
          href: `${url.href}?amount=0.1`,
          type: "external-link",
        },
      ],
    },
  };
  return new Response(JSON.stringify(payload), {
    headers
  });
}

// DO NOT FORGET TO INCLUDE THE `OPTIONS` HTTP METHOD
// THIS WILL ENSURE CORS WORKS FOR BLINKS
export const OPTIONS = async () => Response.json(null, { headers });

// POST request handler
export async function POST(request: Request) {
  const body: ActionPostRequest = await request.json();
  const url = new URL(request.url);
  const amount = Number(url.searchParams.get("amount")) || 0.1;
  let sender;

  try {
    sender = new PublicKey(body.account);
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: {
          message: "Invalid account" + error,
        },
      }),
      {
        status: 400,
        headers,
      }
    );
  }

  const connection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed");

  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: sender, // Sender public key
      toPubkey: new PublicKey("AbVh32GTzzBuUYQEgZ2LjpX17StgxN5aPzqaYaxbLvB4"), // Replace with your recipient public key
      lamports: amount * LAMPORTS_PER_SOL,
    })
  );
  transaction.feePayer = sender;
  transaction.recentBlockhash = (
    await connection.getLatestBlockhash()
  ).blockhash;
  transaction.lastValidBlockHeight = (
    await connection.getLatestBlockhash()
  ).lastValidBlockHeight;

  const payload: ActionPostResponse = await createPostResponse({
    fields: {
      type: "transaction",
      transaction: transaction,
      message: "Transaction created",
    },
  });
  return new Response(JSON.stringify(payload), {
    headers,
  });
}
