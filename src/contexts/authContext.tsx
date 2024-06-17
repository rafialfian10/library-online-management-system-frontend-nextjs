"use client";

import { useState, useEffect, createContext } from "react";
import { useSession } from "next-auth/react";

import { UserAuth } from "@/types/userAuth";
import { CheckAuthValues } from "@/types/checkAuth";

type AuthContextType = {
  userCheckAuth: CheckAuthValues;
  setUserCheckAuth: React.Dispatch<React.SetStateAction<CheckAuthValues>>;
};

const AuthContextState = {
  userCheckAuth: {
    id: 0,
    username: "",
    email: "",
    is_email_verified: false,
    password: "",
    gender: "",
    phone: "",
    address: "",
    photo: "",
    role: {
      id: 0,
      role: "",
    },
  },
  setUserCheckAuth: () => {},
};

export const AuthContext = createContext<AuthContextType>(AuthContextState);

export default function AuthContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const userAuth: UserAuth | undefined = session?.user;

  const [userCheckAuth, setUserCheckAuth] = useState<CheckAuthValues>(
    AuthContextState.userCheckAuth
  );

  async function fetchUserCheckAuth() {
    if (status === "authenticated" && userAuth?.data?.token) {
      const config = {
        headers: {
          "Content-type": "multipart/form-data",
          Authorization: "Bearer " + userAuth?.data?.token,
        },
      };

      try {
        const response = await fetch(
          `http://localhost:5000/api/v1/check-auth`,
          {
            cache: "no-store",
            headers: config.headers,
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const userCheckAuthData = await response.json();
        setUserCheckAuth(userCheckAuthData.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  }

  useEffect(() => {
    if (status === "authenticated") {
      fetchUserCheckAuth();
    }
  }, [session, status]);

  return (
    <AuthContext.Provider value={{ userCheckAuth, setUserCheckAuth }}>
      {children}
    </AuthContext.Provider>
  );
}
