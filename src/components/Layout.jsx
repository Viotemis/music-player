import React, { useEffect } from "react";
import Sidebar from "./SideBar";
import Header from "./Header";
import BottomPlayBar from "./ui/BottomPlayBar";
import { useRouter } from "next/router";
import { useHeader } from "../store";
import { navItems } from "../constants";

const navItemUrls = navItems.map((m) => m.url);

export default function Layout({ children }) {
  const router = useRouter();
  const { setHeaderToDefault, customHeader } = useHeader();
  useEffect(() => {
    const handleRouteChangeComplete = () => {
      console.log('routeChangeComplete', window.location.href.pathname);
      if (navItemUrls.includes(window.location.pathname)) {
        console.log('set header to default');
        setHeaderToDefault();
      }
    }
    router.events.on('routeChangeComplete', handleRouteChangeComplete);
    setHeaderToDefault();
    return () => {
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
    }
  }, [])
  return (
    <div className="flex items-stretch w-full min-w-screen max-w-screen h-full max-h-screen bg-slate-100 overflow-hidden">
      <Sidebar />
      <div className="relative min-w-[0] flex-1 max-w-screen h-full max-h-screen flex flex-col">
        {customHeader ? (
          <div>{customHeader}</div>
        ) : (
          <Header />
        )}
        <main className="w-full min-h-[0] flex-1 p-0 overflow-y-scroll scrollbar-hide">
          {children}
          <div className="h-20"></div>
        </main>
      </div>
      <BottomPlayBar />
    </div>
  );
}
