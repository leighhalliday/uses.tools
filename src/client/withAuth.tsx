import React from "react";
import gql from "graphql-tag";
import { NextPageContext } from "next";
import Router from "next/router";
import { AppContext } from "next/app";
import { getCookies } from "cookies-next";
import jwtDecode from "jwt-decode";

interface MyNextPageContent extends NextPageContext {
  auth: AuthProps | null;
}
interface MyAppContext extends AppContext {
  ctx: MyNextPageContent;
}
interface AuthProps {
  username: string;
  avatarUrl: string;
}

const getAuthProps = (ctx: NextPageContext): AuthProps | null => {
  const token: string | undefined = getCookies(ctx, "token");
  if (!token) return null;

  const { username, avatarUrl }: AuthProps = jwtDecode(token);
  const authProps: AuthProps = { username, avatarUrl };

  return authProps;
};

export function withAuth(App: any) {
  let auth: AuthProps | null = null;

  return class WithAuth extends React.Component {
    static displayName = `WithAuth(${App.displayName})`;

    static async getInitialProps(context: MyAppContext) {
      const { ctx } = context;
      const { res } = ctx;
      auth = getAuthProps(ctx);
      ctx.auth = auth;

      let appProps = {};
      if (App.getInitialProps) {
        appProps = await App.getInitialProps(context);
      }

      if (res && res.finished) {
        // When redirecting, the response is finished.
        // No point in continuing to render
        return {};
      }

      return { ...appProps, auth };
    }

    render() {
      return <App {...this.props} />;
    }
  };
}

interface AuthContextValue {
  auth: AuthProps | null;
}
const authContextValue: AuthContextValue = { auth: null };
const AuthContext = React.createContext(authContextValue);

function AuthProvider({ children, auth }) {
  const [currentAuth, setCurrentAuth] = React.useState(auth);

  React.useEffect(() => {
    setCurrentAuth(auth);
  }, [auth]);

  return (
    <AuthContext.Provider value={{ auth: currentAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

const EditViewerQuery = gql`
  query EditViewerData {
    viewer {
      id
      username
    }
  }
`;

async function canEditUser(ctx, username) {
  const { res, apolloClient } = ctx;
  const {
    data: { viewer }
  } = await apolloClient.query({
    query: EditViewerQuery
  });
  const { username: viewerUsername } = viewer || { username: null };

  if (username === viewerUsername) {
    return true;
  }

  if (res) {
    res.writeHead(302, {
      Location: "/"
    });
    res.end();
  } else {
    Router.push("/");
  }

  return false;
}

export { AuthContext, AuthProvider, canEditUser };
