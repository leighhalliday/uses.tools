/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export interface AddToolInput {
  toolId?: string | null;
  categoryId: string;
  name: string;
  url: string;
  userUrl?: string | null;
  description: string;
}

export interface EditToolInput {
  id: string;
  userUrl?: string | null;
  description: string;
}

export interface RemoveToolInput {
  toolId: string;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
