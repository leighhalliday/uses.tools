/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { RemoveToolInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: RemoveToolMutation
// ====================================================

export interface RemoveToolMutation_removeTool {
  __typename: "RemoveToolPayload";
  errors: string[];
}

export interface RemoveToolMutation {
  removeTool: RemoveToolMutation_removeTool | null;
}

export interface RemoveToolMutationVariables {
  input: RemoveToolInput;
}
