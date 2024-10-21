import { createActionHeaders, type ActionsJson } from "@solana/actions";

export const GET = async () => {
  const payload: ActionsJson = {
    rules: [
      // Map all root level routes to an action
      {
        pathPattern: "/",
        apiPath: "/api/donate/",
      },
    ],
  };

  return Response.json(payload, {
    headers: createActionHeaders(),
  });
};

// DO NOT FORGET TO INCLUDE THE `OPTIONS` HTTP METHOD
// THIS WILL ENSURE CORS WORKS FOR BLINKS
export const OPTIONS = GET;