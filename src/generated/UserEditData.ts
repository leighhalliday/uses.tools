/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: UserEditData
// ====================================================

export interface UserEditData_user_userTools_tool {
  __typename: "Tool";
  id: string;
  name: string;
  url: string;
}

export interface UserEditData_user_userTools_category {
  __typename: "Category";
  id: string;
}

export interface UserEditData_user_userTools {
  __typename: "UserTool";
  id: string;
  url: string | null;
  description: string;
  tool: UserEditData_user_userTools_tool;
  category: UserEditData_user_userTools_category;
}

export interface UserEditData_user {
  __typename: "User";
  id: string;
  username: string;
  name: string;
  userTools: UserEditData_user_userTools[];
}

export interface UserEditData_viewer_user {
  __typename: "User";
  id: string;
  username: string;
}

export interface UserEditData_viewer {
  __typename: "Viewer";
  id: string;
  user: UserEditData_viewer_user;
}

export interface UserEditData_categories {
  __typename: "Category";
  id: string;
  name: string;
  slug: string | null;
  description: string | null;
}

export interface UserEditData {
  user: UserEditData_user | null;
  viewer: UserEditData_viewer | null;
  categories: UserEditData_categories[];
}

export interface UserEditDataVariables {
  username: string;
}
