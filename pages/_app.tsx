import App, { Container } from "next/app";
import React from "react";
import { ApolloProvider } from "react-apollo";
import { ApolloProvider as ApolloHooksProvider } from "react-apollo-hooks";
import { withApollo } from "@client/withApollo";
import { withAuth, AuthProvider } from "@client/withAuth";

import "normalize.css";

interface Props {
  apolloClient: any;
  auth: any;
}

class MyApp extends App<Props> {
  render() {
    const { Component, pageProps, apolloClient, auth } = this.props;

    return (
      <Container>
        <AuthProvider auth={auth}>
          <ApolloProvider client={apolloClient}>
            <ApolloHooksProvider client={apolloClient}>
              <Component {...pageProps} auth={auth} />
            </ApolloHooksProvider>
          </ApolloProvider>
        </AuthProvider>
      </Container>
    );
  }
}

export default withApollo(withAuth(MyApp));
