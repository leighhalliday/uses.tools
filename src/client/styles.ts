import { css } from "@emotion/core";

export default {
  card: css`
    transition: box-shadow 0.3s ease-in-out;
    display: block;
    min-height: 4rem;
    padding: 0.5rem;
    border-radius: 0.25rem;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px,
      rgba(0, 0, 0, 0.14) 0px 1px 1px 0px, rgba(0, 0, 0, 0.12) 0px 2px 1px -1px;

    &:hover {
      box-shadow: rgba(0, 0, 0, 0.4) 0px 1px 3px 0px,
        rgba(0, 0, 0, 0.14) 0px 1px 1px 0px,
        rgba(0, 0, 0, 0.12) 0px 2px 1px -1px;
    }
  `
};
