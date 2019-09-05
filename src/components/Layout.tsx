import React from "react";
import Head from "next/head";
import Link from "next/link";
import { Global, css } from "@emotion/core";
import { AuthContext } from "@client/withAuth";

export function Layout({ children }) {
  const { auth } = React.useContext(AuthContext);

  return (
    <div>
      <GlobalStyles />
      <Head>
        <title>uses.tools</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link
          href="https://fonts.googleapis.com/css?family=Darker+Grotesque:500&display=swap"
          rel="stylesheet"
        />
        <meta
          name="google-site-verification"
          content="tb-2fNRCzypRXEqOHVFo_e4-XgSBgid7ejO_MPRdFkA"
        />
      </Head>
      <nav
        css={css`
          width: 100%;
          padding: 0.5rem;
          position: fixed;
          top: 0px;
          display: flex;
          align-items: center;
          background: #fff;
          z-index: 10;

          &:before {
            position: absolute;
            display: block;
            content: "";
            z-index: -1;
            opacity: 1;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            background: #1fa2ff;
            background-image: linear-gradient(
              69.8deg,
              rgba(25, 49, 108, 1) 2.8%,
              rgba(1, 179, 201, 1) 97.8%
            );
          }

          a {
            display: inline-block;
            padding: 0px 0.5rem;
            color: #fff;
            font-size: 0.8rem;
          }
        `}
      >
        <div
          css={css`
            flex-grow: 1;
          `}
        >
          <Link href="/">
            <a
              css={css`
                color: rgba(1, 179, 201, 1) !important;
                font-family: "Darker Grotesque", sans-serif;
                font-size: 1.5rem !important;
                transform: translateY(-4px);
              `}
            >
              uses.tools
            </a>
          </Link>
        </div>

        <div
          css={css`
            text-align: right;
          `}
        >
          {auth ? (
            <>
              <Link
                href={`/[slug]/edit?slug=${auth.username}`}
                as={`/${auth.username}/edit`}
              >
                <a>{auth.username}</a>
              </Link>
              <Link
                href={`/[slug]?slug=${auth.username}`}
                as={`/${auth.username}`}
              >
                <a>public</a>
              </Link>

              <Link href="/logout">
                <a>logout</a>
              </Link>
            </>
          ) : (
            <Link href="/login">
              <a>login</a>
            </Link>
          )}
        </div>
      </nav>
      <main
        css={css`
          padding: 1rem;
          padding-top: 4rem;
        `}
      >
        {children}
      </main>
    </div>
  );
}

function GlobalStyles() {
  return (
    <Global
      styles={css`
        * {
          box-sizing: border-box;
        }

        html {
          font-size: 18px;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
        }

        a {
          color: #1f6ed4;
          text-decoration: none;
          cursor: pointer;
        }

        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
          color: #05445c;
        }

        img {
          max-width: 100%;
          display: inline-block;
        }

        p {
          font-size: 1rem;
          line-height: 1.4rem;
        }

        input,
        textarea {
          width: 100%;
          padding: 0.25rem;
        }

        button,
        a.button {
          border: 1px solid #3f3f3f;
          cursor: pointer;
          padding: 0.25rem 0.5rem;
        }

        button.button-link {
          border: none;
          padding: 0px;
          padding-right: 1rem;
          color: #1f6ed4;
          background: none;
        }

        .has-error {
          border: 1px solid red;
        }

        .react-autosuggest__container {
          position: relative;
        }

        .react-autosuggest__input {
          width: 240px;
          height: 30px;
          padding: 10px 20px;
          font-family: "Open Sans", sans-serif;
          font-weight: 300;
          font-size: 16px;
          border: 1px solid #aaa;
          border-radius: 4px;
          -webkit-appearance: none;
        }

        .react-autosuggest__input--focused {
          outline: none;
        }

        .react-autosuggest__input::-ms-clear {
          display: none;
        }

        .react-autosuggest__input--open {
          border-bottom-left-radius: 0;
          border-bottom-right-radius: 0;
        }

        .react-autosuggest__suggestions-container {
          display: none;
        }

        .react-autosuggest__suggestions-container--open {
          display: block;
          position: relative;
          top: -1px;
          width: 280px;
          border: 1px solid #aaa;
          background-color: #fff;
          font-family: "Open Sans", sans-serif;
          font-weight: 300;
          font-size: 16px;
          border-bottom-left-radius: 4px;
          border-bottom-right-radius: 4px;
          z-index: 2;
        }

        .react-autosuggest__suggestions-list {
          margin: 0;
          padding: 0;
          list-style-type: none;
        }

        .react-autosuggest__suggestion {
          cursor: pointer;
          padding: 10px 20px;
        }

        .react-autosuggest__suggestion--highlighted {
          background-color: #ddd;
        }

        input,
        textarea {
          border: none;
          padding: 0.5rem;
          margin-top: 0.25rem;
        }
      `}
    />
  );
}
