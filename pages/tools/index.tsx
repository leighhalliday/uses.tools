import gql from "graphql-tag";
import Head from "next/head";
import { css } from "@emotion/core";
import Link from "next/link";
import { Layout } from "@components/Layout";
import { slugify } from "@client/slugify";

const ToolIndexQuery = gql`
  query ToolIndexData($first: Int!, $skip: Int!) {
    tools(first: $first, skip: $skip) {
      id
      name
      ogImageUrl
      ogTitle
      ogDescription
      usersCount
    }
  }
`;

const truncate = (text: string, chars: number): string => {
  if (text.length <= chars) {
    return text;
  }
  return `${text.substring(0, chars)}...`;
};

const Tools = ({ tools, page, nextPage, prevPage }) => {
  const title = `Tools for developers and designers - Page ${page}`;
  const description = title;

  return (
    <Layout>
      <Head>
        <title>{title}</title>
        <meta property="og:title" content={title} />
        <meta name="twitter:title" content={title} />

        <meta name="description" content={description} />
        <meta property="og:description" content={description} />
        <meta name="twitter:description" content={description} />
      </Head>

      <h1
        css={css`
          text-align: center;
        `}
      >
        Tools {page > 1 ? ` Page ${page}` : null}
      </h1>

      <div
        css={css`
          margin: 0 auto;
          max-width: 1024px;
          display: flex;
          flex-wrap: wrap;
        `}
      >
        {tools.map(tool => (
          <div
            key={tool.id}
            css={css`
              width: 50%;
              margin-bottom: 2rem;
              padding: 1.5rem;

              @media (max-width: 800px) {
                width: 100%;
                padding: 0px;
                margin-bottom: 1rem;
              }
            `}
          >
            <Link
              href={`/tools/[id]?id=${slugify(tool.id, tool.name)}`}
              as={`/tools/${slugify(tool.id, tool.name)}`}
            >
              <a
                css={css`
                  display: block;
                `}
              >
                <h2
                  css={css`
                    text-align: left;
                    margin-bottom: 0.5rem;
                  `}
                >
                  {tool.name}
                </h2>
              </a>
            </Link>

            {tool.usersCount > 0 && (
              <p
                css={css`
                  font-size: 0.8rem;
                  margin-top: 0px;
                  font-style: italic;
                `}
              >
                Used by {tool.usersCount}{" "}
                {tool.usersCount === 1 ? "person" : "people"}.
              </p>
            )}

            {tool.ogImageUrl && (
              <Link
                href={`/tools/[id]?id=${slugify(tool.id, tool.name)}`}
                as={`/tools/${slugify(tool.id, tool.name)}`}
              >
                <a
                  css={css`
                    display: block;
                  `}
                >
                  <img
                    css={css`
                      display: block;
                      margin: 0 auto;
                      max-width: 100%;
                      max-height: 150px;
                    `}
                    src={tool.ogImageUrl}
                    title={tool.ogTitle || tool.name}
                  />
                </a>
              </Link>
            )}

            {tool.ogDescription && (
              <p
                css={css`
                  margin-bottom: 0px;
                `}
              >
                {truncate(tool.ogDescription, 150)}
              </p>
            )}
          </div>
        ))}
      </div>

      <div
        css={css`
          margin: 0 auto;
          max-width: 1024px;
          display: flex;
          justify-content: center;

          a {
            display: inline-block;
            padding: 2rem 1rem;
          }
        `}
      >
        {prevPage && (
          <Link href={`/tools?page=${prevPage}`}>
            <a>Prev Page</a>
          </Link>
        )}
        {nextPage && (
          <Link href={`/tools?page=${nextPage}`}>
            <a>Next Page</a>
          </Link>
        )}
      </div>
    </Layout>
  );
};

Tools.getInitialProps = async ({ apolloClient, query }) => {
  const page = parseInt(query.page || "1", 10);
  const first = 25;
  const skip = page * first - first;

  const { data } = await apolloClient.query({
    query: ToolIndexQuery,
    variables: { first, skip }
  });
  const { tools } = data;
  const prevPage = page > 1 ? page - 1 : null;
  const nextPage = tools.length === first ? page + 1 : null;

  return { tools, page, prevPage, nextPage };
};

export default Tools;
