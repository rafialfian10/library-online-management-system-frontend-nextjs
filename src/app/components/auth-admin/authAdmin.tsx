"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import { useEffect } from "react";

import { UserAuth } from "@/types/userAuth";

export default function AuthAdmin(Component: any) {
  return function WithAuth(props: any) {
    const { data: session, status } = useSession();
    const userAuth: UserAuth | undefined = session?.user;

    const router = useRouter();

    useEffect(() => {
      if (status === "loading") {
        return;
      }

      if (!userAuth || status === "unauthenticated") {
        router.push("/pages/login");
        return;
      }

      if (userAuth?.data?.role?.role !== "Admin") {
        router.push("/pages/users/dashboard-user");
        return;
      }
    }, [status, userAuth, router]);

    if (status === "loading") {
      return null;
    }

    if (!userAuth) {
      return <p>Unauthorized, You are not admin</p>;
    }

    if (!session) {
      return null;
    }

    return <Component {...props} />;
  };
}
