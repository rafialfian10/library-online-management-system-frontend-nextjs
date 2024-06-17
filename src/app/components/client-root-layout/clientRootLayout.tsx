"use client"

import { useSession } from "next-auth/react";
import { SessionProvider } from "next-auth/react";

import { ReduxProvider } from "@/redux/reduxProvider";

import AuthProvider from "@/app/provider";
import Navbar from "../navbar/navbar";
import Footer from "../footer/footer";
import AuthContextProvider from "@/contexts/authContext";
import { UserAuth } from "@/types/userAuth";

import { ToastContainer } from "react-toastify";

export default function ClientRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <InnerLayout>{children}</InnerLayout>
    </SessionProvider>
  );
}

function InnerLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const user: UserAuth | undefined = session?.user;

  return (
    <AuthProvider>
      <AuthContextProvider>
        <ReduxProvider>
            {status === "authenticated" && <Navbar />}
            {children}
            <Footer />
            <ToastContainer />
        </ReduxProvider>
      </AuthContextProvider>
    </AuthProvider>
  );
}
