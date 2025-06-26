"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function CallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get("code");

      if (!code) {
        console.error("No code found in URL.");
        router.push("/login");
        return;
      }

      try {
        const params = new URLSearchParams();
        params.append("grant_type", "authorization_code");
        params.append("code", code);
        params.append("client_id", "nextjs-frontend");
        params.append("client_secret", "GRPPm0REFKH2bQku6VmHNTR4ISvjXHsO");
        params.append("redirect_uri", "http://localhost:4000/callback");

        const response = await fetch(
          "http://localhost:8080/realms/vre/protocol/openid-connect/token",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: params.toString(),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          console.error("Failed to get token:", data);
          router.push("/login");
          return;
        }

        document.cookie = `kc-token=${data.access_token}; path=/`;

        const state = searchParams.get("state") || "/";
        router.push(state);
      } catch (error) {
        console.error("OAuth error:", error);
        router.push("/login");
      }
    };

    handleCallback();
  }, [searchParams]);

  return <p>Logging in...</p>;
}
