import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "./ui/button";
import { AlertCircle, Lock } from "lucide-react";

export function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showResetForm, setShowResetForm] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const success = await login(email, password);

    if (success) {
      navigate("/admin");
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-indigo-100 flex items-center justify-center px-4">
      {" "}
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        {" "}
        <div className="text-center mb-8">
          {" "}
          <div className="flex justify-center mb-4">
            {" "}
            <div className="bg-brand-600 p-3 rounded-full">
              {" "}
              <Lock className="h-8 w-8 text-white" />{" "}
            </div>{" "}
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Portal</h1>
          <p className="text-gray-600 mt-2">Diksha Consulting and Projects</p>
        </div>
        {!showResetForm ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-start gap-2">
                <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                autoComplete="current-password"
              />
            </div>

            <Button type="submit" className="w-full">
              Sign In
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setShowResetForm(true)}
                className="text-sm text-brand-600 hover:text-brand-800"
              >
                Forgot password?
              </button>
            </div>
          </form>
        ) : (
          <PasswordResetForm onBack={() => setShowResetForm(false)} />
        )}
      </div>
    </div>
  );
}

function PasswordResetForm({ onBack }: { onBack: () => void }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { resetPassword } = useAuth();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const success = await resetPassword(email);

      if (success) {
        setMessage(
          "Password reset email has been sent. Please check your inbox.",
        );
      } else {
        setError("Unable to send reset email.");
      }
    } catch {
      setError("Failed to send password reset email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleResetPassword} className="space-y-6">
      {" "}
      <div>
        {" "}
        <h3 className="text-lg font-semibold mb-2">Reset Password </h3>
        <p className="text-sm text-gray-600">
          Enter your Firebase admin email.
        </p>
      </div>
      {message && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded text-sm">
          {message}
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
          {error}
        </div>
      )}
      <div>
        <label
          htmlFor="reset-email"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Email
        </label>

        <input
          id="reset-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>
      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="flex-1"
        >
          Back
        </Button>

        <Button type="submit" className="flex-1" disabled={loading}>
          {loading ? "Sending..." : "Send Reset Email"}
        </Button>
      </div>
    </form>
  );
}
