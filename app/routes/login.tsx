import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { startOAuth } from "@/server/oauth";
import { useState } from "react";

export const Route = createFileRoute("/login")({
  component: RouteComponent,
});

function RouteComponent() {
  const [doingAuth, setDoingAuth] = useState(false);

  const Form = useForm({
    defaultValues: {
      handle: "",
    },
    onSubmit: async ({ value }) => {
      setDoingAuth(true);
      try {
        window.location.href = await startOAuth(value.handle);
      } catch (e) {
        console.log(e);
      }
      setDoingAuth(false);
    },
  });

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          Form.handleSubmit();
        }}
      >
        <div>
          <Form.Field
            name="handle"
            children={(field) => (
              <input
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            )}
          />
        </div>
        <button type="submit">{!doingAuth ? "Login" : "Authorizing"}</button>
      </form>
    </div>
  );
}
