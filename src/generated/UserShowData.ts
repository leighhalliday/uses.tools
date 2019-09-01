/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: UserShowData
// ====================================================

export interface UserShowData_user_userTools_tool {
  __typename: "Tool";
  id: string;
  name: string;
  url: string;
}

export interface UserShowData_user_userTools_category {
  __typename: "Category";
  id: string;
}

export interface UserShowData_user_userTools {
  __typename: "UserTool";
  id: string;
  url: string | null;
  description: string;
  tool: UserShowData_user_userTools_tool;
  category: UserShowData_user_userTools_category;
}

export interface UserShowData_user {
  __typename: "User";
  id: string;
  username: string;
  name: string;
  avatarUrl: string | null;
  websiteUrl: string | null;
  githubUrl: string;
  userTools: UserShowData_user_userTools[];
}

export interface UserShowData_categories {
  __typename: "Category";
  id: string;
  name: string;
  slug: string | null;
}

export interface UserShowData {
  user: UserShowData_user | null;
  categories: UserShowData_categories[];
}

export interface UserShowDataVariables {
  username: string;
}
