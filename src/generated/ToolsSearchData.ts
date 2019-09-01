/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ToolsSearchData
// ====================================================

export interface ToolsSearchData_tools {
  __typename: "Tool";
  id: string;
  name: string;
  url: string;
}

export interface ToolsSearchData {
  tools: ToolsSearchData_tools[];
}

export interface ToolsSearchDataVariables {
  search: string;
}
