import { createFileRoute, Link, useRouter } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <>
      <div>
        Welcome to Cleric!!!
        <br />
        This is ✨ugly✨ as i am tryna get atproto workin
      </div>
      <Link to="/login">Login</Link>
    </>
  );
}
