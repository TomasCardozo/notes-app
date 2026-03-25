import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/authApi";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(username, password);
      navigate("/", { replace: true });
    } catch {
      setError("Incorrect User or Password.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="min-h-screen bg-canvas px-4 py-10">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-brand-3/30 bg-surface-soft shadow-2xl lg:grid-cols-2">
          <div className="hidden lg:flex flex-col justify-between bg-brand p-10 text-white-soft">
            <div>
              <div className="inline-flex rounded-2xl bg-white-soft/10 px-4 py-2 text-sm font-medium">
                NOTE API
              </div>

              <h1 className="mt-8 text-4xl font-semibold leading-tight">
                Simple, modern notes.
              </h1>

              <p className="mt-4 max-w-md text-sm leading-6 text-surface-soft">
                Manage your notes in a clean, clear, and consistent interface.
              </p>
            </div>

            <div className="rounded-2xl border border-white-soft/15 bg-white-soft/10 p-5 text-sm text-surface-soft">
              <p className="">
                A full-stack notes application built with modern architecture
                and a REST API backend.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center bg-surface-soft p-6 sm:p-10">
            <div className="w-full max-w-md">
              <div className="mb-8 text-center lg:text-left">
                <h2 className="text-3xl font-semibold tracking-tight text-canvas">
                  Sign in
                </h2>
                <p className="mt-2 text-sm text-brand">
                  Sign in to continue to NOTE API
                </p>
              </div>

              <form onSubmit={onSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="username"
                    className="mb-2 block text-sm font-medium text-canvas"
                  >
                    Username
                  </label>
                  <input
                    id="username"
                    type="text"
                    autoComplete="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    className="w-full rounded-2xl border border-brand-3 bg-white px-4 py-3 text-sm text-canvas outline-none transition placeholder:text-brand-2 focus:border-brand focus:ring-4 focus:ring-brand/20"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-medium text-canvas"
                  >
                    Password
                  </label>

                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full rounded-2xl border border-brand-3 bg-white px-4 py-3 pr-16 text-sm text-canvas outline-none transition placeholder:text-brand-2 focus:border-brand focus:ring-4 focus:ring-brand/20"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute inset-y-0 right-2 my-auto rounded-xl px-3 py-2 text-sm font-medium text-brand transition hover:bg-surface"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand px-4 py-3 text-sm font-semibold text-white-soft transition hover:bg-brand-2 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading && (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white-soft/40 border-t-white-soft" />
                  )}
                  {loading ? "Loading..." : "Login"}
                </button>

                {error && (
                  <div className="rounded-2xl border border-brand-3 bg-surface px-4 py-3 mt-2 text-sm text-canvas text-center">
                    {error}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
