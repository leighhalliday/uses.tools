import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import { ApolloLink } from "apollo-link";
import { HttpLink } from "apollo-link-http";
import { setContext } from "apollo-link-context";
import { onError } from "apollo-link-error";
import produce from "immer";
import fetch from "isomorphic-unfetch";
import Cookies from "universal-cookie";
import { IncomingMessage } from "http";

const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, path }) =>
      console.log(`[GraphQL error]: Message: ${message}, Path: ${path}`)
    );
  }

  if (networkError) {
    console.log(
      `[Network error ${operation.operationName}]: ${networkError.message}`
    );
  }
});

const httpLink = new HttpLink({
  uri: "http://localhost:3000/graphql",
  fetch
});

export function createBrowserClient() {
  const cache = new InMemoryCache();
  const cookies = new Cookies();

  const authLink = setContext((_, oldContext) => {
    return produce(oldContext, draft => {
      if (!draft.headers) {
        draft.headers = {};
      }
      const token = cookies.get("token");
      if (token) {
        draft.headers["Authorization"] = `Bearer ${token}`;
      }
      draft.headers["X-SOURCE"] = "browser";
    });
  });

  const client = new ApolloClient({
    cache,
    link: ApolloLink.from([errorLink, authLink, httpLink])
  });

  return client;
}

export function createServerClient(req: IncomingMessage) {
  const cache = new InMemoryCache();
  const cookies = new Cookies(req.headers.cookie);

  const authLink = setContext((_, oldContext) => {
    return produce(oldContext, draft => {
      if (!draft.headers) {
        draft.headers = {};
      }
      const token = cookies.get("token");
      if (token) {
        draft.headers["Authorization"] = `Bearer ${token}`;
      }
      draft.headers["X-SOURCE"] = "server";
    });
  });

  const client = new ApolloClient({
    cache,
    link: ApolloLink.from([errorLink, authLink, httpLink]),
    ssrMode: true
  });

  return client;
}
