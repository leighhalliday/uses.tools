import gql from "graphql-tag";
import { useState } from "react";
import { css } from "@emotion/core";
import { useMutation, useQuery } from "react-apollo-hooks";
import { AddToolForm, EditToolForm } from "@components/ToolForms";
import { Layout } from "@components/Layout";
import { canEditUser } from "@client/withAuth";
import { ProfileHeader } from "@components/ProfileHeader";

const UserEditQuery = gql`
  query UserEditData($username: String!) {
    user(username: $username) {
      id
      username
      name
      avatarUrl
      websiteUrl
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
    viewer {
      id
      user {
        id
        username
      }
    }
    categories {
      id
      name
      slug
      description
    }
  }
`;

const RemoveToolMutation = gql`
  mutation RemoveToolMutation($input: RemoveToolInput!) {
    removeTool(input: $input) {
      errors
    }
  }
`;

const EditTool = ({ userTool, username }) => {
  const [removeTool, { loading }] = useMutation(RemoveToolMutation, {
    variables: {
      input: {
        toolId: userTool.tool.id
      }
    },
    refetchQueries: [{ query: UserEditQuery, variables: { username } }]
  });
  const [showEditForm, setShowEditForm] = useState(false);

  return (
    <li>
      <h3>
        <a href={userTool.url || userTool.tool.url} target="_blank">
          {userTool.tool.name}
        </a>
      </h3>

      <p>{userTool.description}</p>

      {showEditForm ? (
        <EditToolForm
          userTool={userTool}
          refetchQueries={[{ query: UserEditQuery, variables: { username } }]}
          close={() => {
            setShowEditForm(false);
          }}
        />
      ) : (
        <>
          <button
            onClick={() => {
              setShowEditForm(!showEditForm);
            }}
            className="button-link"
          >
            edit
          </button>
          <button
            onClick={() => {
              if (confirm("You sure?")) {
                removeTool();
              }
            }}
            disabled={loading}
            className="button-link"
          >
            remove
          </button>
        </>
      )}
    </li>
  );
};

const EditCategory = ({ category, userTools, username }) => {
  const [adding, setAdding] = useState(false);

  return (
    <li
      key={category.id}
      css={css`
        margin-bottom: 2rem;
      `}
    >
      <h2>{category.name}</h2>
      {category.description ? <p>{category.description}</p> : null}
      <ul
        css={css`
          list-style: none;
          margin: 0;
          padding: 0%;
        `}
      >
        {userTools.map(userTool => (
          <EditTool userTool={userTool} key={userTool.id} username={username} />
        ))}
      </ul>

      {adding ? (
        <AddToolForm
          category={category}
          refetchQueries={[{ query: UserEditQuery, variables: { username } }]}
          close={() => {
            setAdding(false);
          }}
        />
      ) : (
        <p>
          <button onClick={() => setAdding(!adding)}>Add Tool</button>
        </p>
      )}
    </li>
  );
};

const Edit = ({ username }) => {
  const { data, loading } = useQuery(UserEditQuery, {
    variables: { username },
    ssr: false
  });

  if (loading || !data) {
    return <Layout>loading...</Layout>;
  }

  const { user, categories } = data;

  const categoryTools = user.userTools.reduce((acc, userTool) => {
    const key = userTool.category.id;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(userTool);
    return acc;
  }, {});

  return (
    <Layout>
      <ProfileHeader user={user} />

      <ul
        css={css`
          list-style: none;
          margin: 0 auto;
          padding: 0%;
          max-width: 800px;
        `}
      >
        {categories.map(category => (
          <EditCategory
            key={category.id}
            category={category}
            username={user.username}
            userTools={categoryTools[category.id] || []}
          />
        ))}
      </ul>
    </Layout>
  );
};

Edit.getInitialProps = async ctx => {
  const { query } = ctx;
  const hasAccess = await canEditUser(ctx, query.slug);
  if (!hasAccess) {
    return {};
  }

  return { username: query.slug };
};

export default Edit;
