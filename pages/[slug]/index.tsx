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
        <a href={userTool.url || userTool.tool.url} target="_blank">
          {userTool.tool.name}
        </a>
      </h3>
      <p>{userTool.description}</p>
    </li>
  );
}

const Uses = ({ user, categories }) => {
  const categoryTools = mapCategoryTools(user.userTools);

  return (
    <Layout>
      <Head>
        <title>{user.name}</title>
        <meta name="description" content={`Tools used by ${user.name}`} />
        <meta property="og:title" content={user.name} />
        <meta
          property="og:description"
          content={`Tools used by ${user.name}`}
        />
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
