import gql from "graphql-tag";
import { css } from "@emotion/core";
import Link from "next/link";
import { Layout } from "@components/Layout";

const ToolShowQuery = gql`
  query ToolShowData($id: ID!) {
    tool(id: $id) {
      id
      name
      ogImageUrl
      ogTitle
      ogDescription
      userTools(first: 50) {
        id
        user {
          id
          username
          name
          avatarUrl
        }
      }
    }
  }
`;

const Tool = ({ tool }) => {
  return (
    <Layout>
      <div
        css={css`
          margin: 0 auto;
          max-width: 800px;
        `}
      >
        <div>
          <h1
            css={css`
              text-align: center;
            `}
          >
            {tool.name}
          </h1>
          {tool.ogImageUrl && (
            <img
              css={css`
                display: block;
                margin: 0 auto;
                width: 100%;
                max-width: 600px;
              `}
              src={tool.ogImageUrl}
              title={tool.ogTitle || tool.name}
            />
          )}
          {tool.ogDescription && <p>{tool.ogDescription}</p>}
        </div>

        <div>
          <h2
            css={css`
              text-align: center;
            `}
          >
            Used By
          </h2>

          <ul
            css={css`
              display: flex;
              flex-wrap: wrap;
              list-style: none;
            `}
          >
            {tool.userTools.map(({ id, user }) => (
              <li
                key={id}
                css={css`
                  margin-right: 1rem;
                  margin-bottom: 1rem;
                `}
              >
                <Link
                  href={`/[slug]?slug=${user.username}`}
                  as={`/${user.username}`}
                >
                  <a
                    css={css`
                      display: flex;
                      align-items: center;
                    `}
                  >
                    <img
                      css={css`
                        width: 25px;
                        height: 25px;
                        border-radius: 50%;
                        margin-right: 0.5rem;
                      `}
                      src={user.avatarUrl}
                      title={user.name}
                    />
                    {user.name}
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Layout>
  );
};

Tool.getInitialProps = async ({ apolloClient, query }) => {
  const id = query.id.split("-")[0];

  const { data } = await apolloClient.query({
    query: ToolShowQuery,
    variables: { id }
  });
  const { tool } = data;

  return { tool };
};

export default Tool;
