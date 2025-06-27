"use client";

import { useEffect } from "react";

export default function UnauthorizedPage() {
  useEffect(() => {
    const loginUrl = new URL(
      "http://localhost:8080/realms/vre/protocol/openid-connect/auth"
    );

    loginUrl.searchParams.set("client_id", "nextjs-frontend");
    loginUrl.searchParams.set("redirect_uri", window.location.origin + "/callback");
    loginUrl.searchParams.set("response_type", "code");
    loginUrl.searchParams.set("scope", "openid");

    // Delay a bit before redirecting
    setTimeout(() => {
      window.location.href = loginUrl.toString();
    }, 1000); // 1 second delay
  }, []);

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>🔒 Session expired</h1>
      <p>Redirecting you to login...</p>
    </div>
  );
}
