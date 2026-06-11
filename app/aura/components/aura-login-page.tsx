import { Form, Link, useActionData, useNavigation } from "react-router";
import { useConfigurables } from "~/modules/configurables";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";

interface ActionData {
  error?: string;
}

export function AuraLoginPage() {
  const actionData = useActionData<ActionData>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const { config, loading } = useConfigurables();

  const appName = loading ? "Aura" : (config.appName ?? "Aura");
  const companionName = loading ? "Aura" : (config.companionName ?? "Aura");
  const tagline = loading ? "Your AI girlfriend, always available." : (config.loginTagline ?? "Your AI girlfriend, always available.");
  const bgColor = loading ? "#0D0D1A" : (config.backgroundColor ?? "#0D0D1A");
  const surfaceColor = loading ? "#1A1A2E" : (config.surfaceColor ?? "#1A1A2E");

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center px-4 py-12"
      style={{ backgroundColor: bgColor }}
    >
      {/* Logo / Brand */}
      <div className="mb-8 flex flex-col items-center gap-3">
        <div
          className="flex h-16 w-16 items-center justify-center rounded-full"
          style={{
            background: "linear-gradient(135deg, #9B59B6, #E91E8C)",
            boxShadow: "0 0 32px rgba(155, 89, 182, 0.5)",
          }}
        >
          <span className="text-2xl font-bold text-white">{appName.charAt(0)}</span>
        </div>
        <h1
          className="text-3xl font-bold tracking-tight text-white"
          style={{
            background: "linear-gradient(135deg, #9B59B6, #E91E8C)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {appName}
        </h1>
        <p className="text-sm text-gray-400">{tagline}</p>
      </div>

      {/* Card */}
      <div
        className="w-full max-w-sm rounded-2xl p-8"
        style={{
          backgroundColor: surfaceColor,
          border: "1px solid rgba(155, 89, 182, 0.2)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
        }}
      >
        <h2 className="mb-6 text-center text-xl font-semibold text-white">
          Welcome back
        </h2>

        <Form method="post" className="space-y-5">
          {actionData?.error && (
            <div className="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400 border border-red-500/20">
              {actionData.error}
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-gray-300 text-sm">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              autoComplete="email"
              className="aura-input"
              style={{
                backgroundColor: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(155, 89, 182, 0.3)",
                color: "#fff",
              }}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-gray-300 text-sm">
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="aura-input"
              style={{
                backgroundColor: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(155, 89, 182, 0.3)",
                color: "#fff",
              }}
            />
          </div>

          <Button
            type="submit"
            className="w-full font-semibold text-white"
            disabled={isSubmitting}
            style={{
              background: isSubmitting
                ? "rgba(155,89,182,0.5)"
                : "linear-gradient(135deg, #9B59B6, #E91E8C)",
              border: "none",
              boxShadow: isSubmitting ? "none" : "0 0 20px rgba(155, 89, 182, 0.4)",
            }}
          >
            {isSubmitting ? "Signing in…" : `Talk to ${companionName}`}
          </Button>
        </Form>

        <p className="mt-5 text-center text-sm text-gray-500">
          New here?{" "}
          <Link
            to="/auth/register"
            className="font-medium"
            style={{ color: "#9B59B6" }}
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
