import React from "react";
import { css } from "@emotion/core";
import { UserShowData_user } from "@generated/UserShowData";

interface Props {
  user: UserShowData_user;
}

export function ProfileHeader({ user }: Props) {
  return (
    <div>
      <h1
        css={css`
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          margin-bottom: 1rem;
        `}
      >
        <img
          src={user.avatarUrl}
          alt={`${user.name} profile pic`}
          css={css`
            width: 50px;
            border-radius: 50%;
            margin-right: 1rem;
          `}
        />
        {user.name}
      </h1>

      <p
        css={css`
          text-align: center;

          > a {
            display: inline-block;
            padding: 0px 0.5rem;
          }
        `}
      >
        {user.websiteUrl ? (
          <a href={user.websiteUrl} target="_blank">
            Website
          </a>
        ) : null}
        <a href={user.githubUrl} target="_blank">
          GitHub
        </a>
      </p>
    </div>
  );
}
