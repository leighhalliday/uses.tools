import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

interface FormErrorProps {
  touched: any;
  error: any;
}

const ValidationMessage = styled("div")`
  font-size: 0.7rem;
  line-height: 1.5rem;
`;

export function FormError({ touched, error }: FormErrorProps) {
  if (!touched) {
    return <ValidationMessage>&nbsp;</ValidationMessage>;
  }
  if (error) {
    return (
      <ValidationMessage
        css={css`
          color: red;
        `}
      >
        {error}
      </ValidationMessage>
    );
  }
  return (
    <ValidationMessage
      css={css`
        color: green;
      `}
    >
      all good
    </ValidationMessage>
  );
}
