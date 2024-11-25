import {
  createFileRoute,
  Link,
  redirect,
  useNavigate,
} from "@tanstack/react-router";
import { atclient } from "@/server/client-metadata";
import { createServerFn } from "@tanstack/start";
import { setCookie } from "vinxi/http";
import { useState } from "react";
import { env } from "@config";
import { encryptString } from "@/lib/encryption";
import { decodeBase64, encodeBase64urlNoPadding } from "@oslojs/encoding";

export const Route = createFileRoute("/oauth/callback")({
  component: RouteComponent,
  loader: async ({ location }) =>
    await getAuthSession(location.searchStr.slice(1)),
});

// TODO change to use the location url and extract params server side
const getAuthSession = createServerFn("GET", async (paramsStr: string) => {
  const params = new URLSearchParams(paramsStr);
  const { session } = await atclient.callback(params);

  const key = decodeBase64(env.B64PWORD)
  const encrypted = await encryptString(key, session.did);
  const encoded = encodeBase64urlNoPadding(encrypted);

  setCookie("sid", encoded, { path: "/", maxAge: 60 * 60, httpOnly: true, sameSite: "lax" });
});

function RouteComponent() {
  const nav = useNavigate();
  const [timedOut, setTimedOut] = useState(false);
  nav({ to: "/" });

  setTimeout(() => setTimedOut(true), 2000);

  return timedOut ? (
    <>
      This is taking some time... <br />
      If youre stuck here click <Link to="/">here</Link> to go home :3
    </>
  ) : (
    ""
  );
}

/*
export async function GET({ request, cookies }: RequestEvent) {
  const params = new URLSearchParams(request.url.split("?")[1]);
  try {
    const { session } = await atclient.callback(params)
    const key = decodeBase64(MYB_PASSWORD);
    const encrypted = await encryptString(key, session.did);
    const encoded = encodeBase64urlNoPadding(encrypted);
    cookies.set("sid", encoded, { path: "/", maxAge: 60 * 60, httpOnly: true, sameSite: "lax" });
  } catch (err) {
    console.log(err);
    error(500, { message: (err as Error).message });
  }

  redirect(301, "/");
}
*/
