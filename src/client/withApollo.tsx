import React from "react";
import PropTypes from "prop-types";
import { getDataFromTree } from "react-apollo";
import { ApolloClient } from "apollo-client";
import { NormalizedCacheObject } from "apollo-cache-inmemory";
import Head from "next/head";
import { NextPageContext } from "next";
import { AppContext } from "next/app";
import { createBrowserClient, createServerClient } from "./apolloClients";

interface MyContext extends NextPageContext {
  apolloClient: ApolloClient<NormalizedCacheObject>;
}
interface MyAppContext extends AppContext {
  ctx: MyContext;
}

export function withApollo(App: any) {
  let apolloClient: ApolloClient<NormalizedCacheObject>;
  if (process.browser) {
    apolloClient = createBrowserClient();
  }

  return class WithData extends React.Component {
    static displayName = `WithApollo(${App.displayName})`;
    static propTypes = {
      apolloState: PropTypes.object.isRequired
    };

    static async getInitialProps(context: MyAppContext) {
      const {
        Component,
        router,
        ctx: { res, req }
      } = context;

      if (!process.browser) {
        apolloClient = createServerClient(req);
      }

      context.ctx.apolloClient = apolloClient;

      let appProps = {};
      if (App.getInitialProps) {
        appProps = await App.getInitialProps(context);
      }

      if (res && res.finished) {
        // When redirecting, the response is finished.
        // No point in continuing to render
        return {};
      }

      if (!process.browser) {
        // Run all graphql queries in the component tree
        // and extract the resulting data
        try {
          // Run all GraphQL queries
          await getDataFromTree(
            <App
              {...appProps}
              Component={Component}
              router={router}
              apolloClient={apolloClient}
            />
          );
        } catch (error) {
          // Prevent Apollo Client GraphQL errors from crashing SSR.
          // Handle them in components via the data.error prop:
          // https://www.apollographql.com/docs/react/api/react-apollo.html#graphql-query-data-error
          console.error("Error while running `getDataFromTree`", error);
        }

        // getDataFromTree does not call componentWillUnmount
        // head side effect therefore need to be cleared manually
        Head.rewind();
      }

      // Extract query data from the Apollo's store
      const apolloState = apolloClient.cache.extract();

      return {
        ...appProps,
        apolloState
      };
    }

    render() {
      return <App {...this.props} apolloClient={apolloClient} />;
    }
  };
}
