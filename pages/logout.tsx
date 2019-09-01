import { Layout } from "@components/Layout";
import Router from "next/router";
import { removeCookies } from "cookies-next";

const Logout = () => {
  return <Layout>being logged out</Layout>;
};

Logout.getInitialProps = ctx => {
  const { res } = ctx;
  removeCookies(ctx, "token");

  if (res) {
    res.writeHead(302, {
      Location: "/"
    });
    res.end();
  } else {
    Router.push("/");
  }

  return {};
};

export default Logout;
