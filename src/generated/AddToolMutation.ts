/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { AddToolInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: AddToolMutation
// ====================================================

export interface AddToolMutation_addTool_userTool_tool {
  __typename: "Tool";
  id: string;
}

export interface AddToolMutation_addTool_userTool {
  __typename: "UserTool";
  id: string;
  tool: AddToolMutation_addTool_userTool_tool;
}

export interface AddToolMutation_addTool {
  __typename: "AddToolPayload";
  errors: string[];
  userTool: AddToolMutation_addTool_userTool | null;
}

export interface AddToolMutation {
  addTool: AddToolMutation_addTool | null;
}

export interface AddToolMutationVariables {
  input: AddToolInput;
}
