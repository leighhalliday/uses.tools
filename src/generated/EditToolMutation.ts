/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { EditToolInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: EditToolMutation
// ====================================================

export interface EditToolMutation_editTool_userTool {
  __typename: "UserTool";
  id: string;
}

export interface EditToolMutation_editTool {
  __typename: "EditToolPayload";
  errors: string[];
  userTool: EditToolMutation_editTool_userTool | null;
}

export interface EditToolMutation {
  editTool: EditToolMutation_editTool | null;
}

export interface EditToolMutationVariables {
  input: EditToolInput;
}
