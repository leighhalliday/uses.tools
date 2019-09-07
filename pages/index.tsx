import gql from "graphql-tag";
import Link from "next/link";
import Head from "next/head";
import { css } from "@emotion/core";
import { Layout } from "@components/Layout";
import { slugify } from "@client/slugify";
import styles from "@client/styles";

const HomeQuery = gql`
  query HomeData {
    featuredUsers(first: 10) {
      id
      username
      name
      avatarUrl
      userTools(first: 15) {
        id
        tool {
          id
          name
        }
      }
    }
    featuredTools(first: 5) {
      id
      name
      ogImageUrl
      ogTitle
      ogDescription
    }
  }
`;

interface Props {
  tools: any;
  users: any;
}

const HomeUsers = ({ users }) => (
  <div
    css={css`
      width: 50%;
      display: flex;
      flex-wrap: wrap;
      flex-direction: column;
      padding: 0.5rem;

      @media (max-width: 1024px) {
        width: 60%;
      }
      @media (max-width: 800px) {
        width: 100%;
      }
    `}
  >
    <h2
      css={css`
        text-align: center;
      `}
    >
      Featured Users
    </h2>
    {users.map(user => (
      <div
        key={user.id}
        css={css`
          width: 100%;
          margin-bottom: 1rem;
        `}
      >
        <Link href={`/[slug]?slug=${user.username}`} as={`/${user.username}`}>
          <a css={styles.card}>
            <h3
              css={css`
                display: flex;
                align-items: center;
                justify-content: center;
              `}
            >
              <img
                src={user.avatarUrl}
                title={user.name}
                css={css`
                  width: 50px;
                  height: 50px;
                  border-radius: 50%;
                  margin-right: 1rem;
                `}
              />
              {user.name}
            </h3>
            <p>{user.userTools.map(({ tool }) => tool.name).join(", ")}</p>
          </a>
        </Link>
      </div>
    ))}
  </div>
);

const HomeTools = ({ tools }) => (
  <div
    css={css`
      width: 25%;
      display: flex;
      flex-wrap: wrap;
      flex-direction: column;
      padding: 0.5rem;

      @media (max-width: 1024px) {
        width: 40%;
      }
      @media (max-width: 800px) {
        width: 100%;
      }
    `}
  >
    <h2
      css={css`
        text-align: center;
      `}
    >
      Featured Tools
    </h2>
    {tools.map(tool => (
      <div
        key={tool.id}
        css={css`
          width: 100%;
          margin-bottom: 1rem;
        `}
      >
        <Link
          href={`/tools/[id]?id=${slugify(tool.id, tool.name)}`}
          as={`/tools/${slugify(tool.id, tool.name)}`}
        >
          <a css={styles.card}>
            <h3
              css={css`
                text-align: center;
              `}
            >
              {tool.name}
            </h3>
            {tool.ogImageUrl && (
              <img
                src={tool.ogImageUrl}
                title={tool.ogTitle || tool.name}
                css={css`
                  display: block;
                  margin: 0 auto;
                  max-height: 200px;
                `}
              />
            )}
            {tool.ogDescription || tool.ogTitle ? (
              <p>{tool.ogDescription || tool.ogTitle}</p>
            ) : null}
          </a>
        </Link>
      </div>
    ))}

    <p>
      <Link href="/tools">
        <a>View All Tools</a>
      </Link>
    </p>
  </div>
);

const Home = ({ tools, users }: Props) => {
  return (
    <Layout>
      <Head>
        <title>uses.tools</title>
        <meta property="og:title" content="uses.tools" />
        <meta
          property="og:description"
          content="Share the tools that you use as a developer or designer."
        />
      </Head>
      <div
        css={css`
          display: flex;
          justify-content: center;
          flex-wrap: wrap;

          a p {
            color: black !important;
          }
        `}
      >
        <HomeUsers users={users} />
        <HomeTools tools={tools} />
      </div>
    </Layout>
  );
};

Home.getInitialProps = async ({ apolloClient }: any) => {
  const { data } = await apolloClient.query({
    query: HomeQuery,
    variables: {}
  });
  const { featuredTools, featuredUsers } = data;

  return { tools: featuredTools, users: featuredUsers };
};

export default Home;
