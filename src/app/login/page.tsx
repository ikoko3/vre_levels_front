"use client";
import { useEffect } from "react";
import keycloak from "@app/lib/auth";

export default function LoginPage() {
  useEffect(() => {
    keycloak.login({ redirectUri: window.location.origin });
  }, []);

  return <p className="p-4">Redirecting to login...</p>;
}
