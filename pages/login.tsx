import { css } from "@emotion/core";
import { Layout } from "@components/Layout";

const Login = () => {
  return (
    <Layout>
      <div
        css={css`
          width: 100%;
          text-align: center;
          padding-top: 4rem;
        `}
      >
        <a
          href="/api/auth/login"
          className="button"
          css={css`
            display: inline-block;
            color: black !important;
            font-size: 1.5rem;
          `}
        >
          <span
            css={css`
              display: flex;
              align-items: center;
            `}
          >
            Connect with
            <img
              src="/github.png"
              css={css`
                height: 2rem;
              `}
            />
          </span>
        </a>
      </div>
    </Layout>
  );
};

export default Login;
