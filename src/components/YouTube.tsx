import React from "react";
import { css } from "@emotion/core";

interface Props {
  id: string;
}

const YouTube = ({ id }: Props) => (
  <div
    css={css`
      position: relative;
      padding-bottom: 56.25%;
      height: 0;
      overflow: hidden;
      max-width: 100%;
    `}
  >
    <iframe
      css={css`
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      `}
      src={`https://www.youtube.com/embed/${id}`}
      allow="autoplay; encrypted-media"
      title="Embedded YouTube video"
    />
  </div>
);

export default YouTube;
