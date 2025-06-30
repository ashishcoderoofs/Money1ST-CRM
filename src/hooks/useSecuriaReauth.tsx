import { useMutation } from "@tanstack/react-query";
import { useAuth } from "./useAuth";

interface SecuriaReauthRequest {
  email: string;
  password: string;
}

interface SecuriaReauthResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const useSecuriaReauth = () => {
  const { token } = useAuth();

  return useMutation<SecuriaReauthResponse, Error, SecuriaReauthRequest>({
    mutationFn: async ({ email, password }) => {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const response = await fetch(`${apiUrl}/api/securia/reauth`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ email, password }),
      });

      const text = await response.text();
      const data = text.trim() ? JSON.parse(text) : { success: false, message: "Empty response" };

      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}`);
      }

      return data;
    },
  });
};