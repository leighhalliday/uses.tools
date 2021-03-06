import gql from "graphql-tag";
import Head from "next/head";
import { css } from "@emotion/core";
import { Layout } from "@components/Layout";
import { ProfileHeader } from "@components/ProfileHeader";
import {
  UserShowData_categories,
  UserShowData_user_userTools
} from "@generated/UserShowData";

const UserQuery = gql`
  query UserShowData($username: String!) {
    user(username: $username) {
      id
      username
      name
      avatarUrl
      websiteUrl
      githubUrl
      userTools {
        id
        url
        description
        tool {
          id
          name
          url
        }
        category {
          id
        }
      }
    }
    categories {
      id
      name
      slug
    }
  }
`;

function mapCategoryTools(userTools) {
  return userTools.reduce((acc, userTool) => {
    const key = userTool.category.id;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(userTool);
    return acc;
  }, {});
}

interface CategoryProps {
  category: UserShowData_categories;
  userTools: UserShowData_user_userTools[];
}

function Category({ category, userTools }: CategoryProps) {
  return (
    <li
      css={css`
        margin-bottom: 2rem;
      `}
    >
      <h2>{category.name}</h2>
      <ul
        css={css`
          list-style: none;
          margin: 0;
          padding: 0%;
        `}
      >
        {userTools.map(userTool => (
          <UserTool key={userTool.id} userTool={userTool} />
        ))}
      </ul>
    </li>
  );
}

interface UserToolProps {
  userTool: UserShowData_user_userTools;
}

function UserTool({ userTool }: UserToolProps) {
  return (
    <li>
      <h3>
        <a
          href={userTool.url || userTool.tool.url}
          target="_blank"
          rel="noopener"
        >
          {userTool.tool.name}
        </a>
      </h3>
      <p>{userTool.description}</p>
    </li>
  );
}

const buildDescription = (userTools): string => {
  const description = userTools.reduce((acc, { tool }) => {
    const newAcc = acc === "" ? tool.name : `${acc}, ${tool.name}`;
    if (newAcc.length > 100) {
      return acc;
    } else {
      return newAcc;
    }
  }, "");

  return description.trimStart();
};

const buildURL = (url: string, obj: object) => {
  const query = Object.entries(obj)
    .map(pair => pair.map(encodeURIComponent).join("="))
    .join("&");

  return `${url}?${query}`;
};

const Uses = ({ user, categories }) => {
  const categoryTools = mapCategoryTools(user.userTools);
  const description = buildDescription(user.userTools);

  const ogImageUrl = buildURL("https://leighhalliday-og-image.now.sh/og.jpg", {
    author: user.name,
    website: `uses.tools`,
    title: description,
    image: user.avatarUrl
  });

  return (
    <Layout>
      <Head>
        <title>{user.name}</title>
        <meta property="og:title" content={user.name} />
        <meta name="twitter:title" content={user.name} />

        <meta name="description" content={description} />
        <meta property="og:description" content={description} />
        <meta name="twitter:description" content={description} />

        <meta property="og:image" content={ogImageUrl} />
        <meta name="twitter:image" content={ogImageUrl} />

        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <ProfileHeader user={user} />

      <ul
        css={css`
          list-style: none;
          margin: 0 auto;
          max-width: 800px;
          padding: 0;
        `}
      >
        {categories
          .filter(category => categoryTools[category.id])
          .map(category => (
            <Category
              key={category.id}
              category={category}
              userTools={categoryTools[category.id]}
            />
          ))}
      </ul>
    </Layout>
  );
};

Uses.getInitialProps = async ({ apolloClient, query }: any) => {
  const { data } = await apolloClient.query({
    query: UserQuery,
    variables: { username: query.slug }
  });

  return { user: data.user, categories: data.categories };
};

export default Uses;
