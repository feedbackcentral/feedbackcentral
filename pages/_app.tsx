import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { Fragment } from "react";
import "windi.css";
import { Navbar } from "~/components/Navbar";
import { SidebarProfile, SidebarProject } from "~/components/Sidebar";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isAuth = router.pathname !== "/" && true; // TODO: Replace with auth check
  const isProfilePage = router.pathname === "/profile";
  const isProjectPage = router.pathname === "/projects/[uuid]";
  if (isAuth) {
    return (
      <Fragment>
        <Navbar />
        <main className="flex h-full">
          {isAuth && isProfilePage && <SidebarProfile />}
          {isAuth && isProjectPage && <SidebarProject />}
          <section className="p-10 w-full">
            <Component {...pageProps} />
          </section>
        </main>
      </Fragment>
    );
  }
  return <Component {...pageProps} />;
}

export default MyApp;
