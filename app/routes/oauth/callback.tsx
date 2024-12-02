import {
  createFileRoute,
  Link,
  redirect,
  useNavigate,
} from "@tanstack/react-router";
import { atclient } from "@/server/client-metadata";
import { encryptString } from "@/lib/encryption";
import { env } from "@config";
import { createServerFn } from "@tanstack/start";
import { setCookie } from "vinxi/http";
import { useState } from "react";
import { decodeBase64, encodeBase64urlNoPadding } from "@oslojs/encoding";

export const Route = createFileRoute("/oauth/callback")({
  component: RouteComponent,
  loader: async ({ location }) =>
    await getAuthSession(location.searchStr.slice(1)),
});

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
