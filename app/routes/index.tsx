import { decryptToString } from "@/lib/encryption";
import { atclient } from "@/server/client-metadata";
import { env } from "@config";
import {
  decodeBase64,
  decodeBase64url,
  decodeBase64urlIgnorePadding,
} from "@oslojs/encoding";
import { useForm } from "@tanstack/react-form";
import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/start";
import { parseCookies } from "vinxi/http";
import { Agent } from "@atproto/api";

export const Route = createFileRoute("/")({
  component: Home,
});

const createPost = createServerFn(
  "POST",
  async ({ fullName }: { fullName: string }) => {
    const cookies = parseCookies();

    const key = decodeBase64(env.B64PWORD);
    console.log("got key");

    const sid = cookies.sid;
    const sidEnc = decodeBase64urlIgnorePadding(sid);
    const did = await decryptToString(key, sidEnc);
    console.log("got did");

    const oathSesh = await atclient.restore(did);
    console.log("got sesh");
    const agent = new Agent(oathSesh);
    console.log("got agent");

    await agent.post({ text: fullName });
    console.log("made post");
    await oathSesh.signOut();
    console.log("signed out");

    return "success";
  }
);

function Post() {
  const form = useForm({
    defaultValues: {
      fullName: "",
    },
    onSubmit: async ({ value }) => {
      // Do something with form data
      console.log(await createPost(value));
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <div>
        <form.Field
          name="fullName"
          children={(field) => (
            <textarea
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          )}
        />
      </div>
      <button type="submit">Post</button>
    </form>
  );
}

function Home() {
  return (
    <>
      <div>
        Welcome to Cleric!!!
        <br />
        This is ✨ugly✨ as i am tryna get atproto workin
      </div>
      <Link to="/login">Login</Link>
      <br />
      <Post />
    </>
  );
}
