import React, { useState } from "react";
import Autosuggest from "react-autosuggest";
import { Formik } from "formik";
import { useApolloClient } from "react-apollo-hooks";
import gql from "graphql-tag";
import { css } from "@emotion/core";
import * as Yup from "yup";
import { FormError } from "@components/FormError";

const AddToolSchema = Yup.object().shape({
  name: Yup.string()
    .min(1, "Too Short!")
    .max(255, "Too Long!")
    .required("Required"),
  url: Yup.string()
    .url("Must be a URL")
    .min(10, "Too Short!")
    .max(255, "Too Long!")
    .required("Required"),
  userUrl: Yup.string()
    .url("Must be a URL")
    .min(10, "Too Short!")
    .max(255, "Too Long!"),
  description: Yup.string()
    .min(1, "Too Short!")
    .max(1000, "Too Long!")
    .required("Required")
});

const ToolsQuery = gql`
  query ToolsSearchData($search: String!) {
    tools(search: $search) {
      id
      name
      url
    }
  }
`;

const AddToolMutation = gql`
  mutation AddToolMutation($input: AddToolInput!) {
    addTool(input: $input) {
      errors
      userTool {
        id
        tool {
          id
        }
      }
    }
  }
`;

export const AddToolForm = ({ category, close, refetchQueries }) => {
  const [serverErrors, setServerErrors] = useState([]);
  const client = useApolloClient();
  const [suggestions, setSuggestions] = useState([]);

  return (
    <Formik
      initialValues={{
        toolId: "",
        name: "",
        url: "",
        userUrl: "",
        description: ""
      }}
      validationSchema={AddToolSchema}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        const { data } = await client.mutate({
          mutation: AddToolMutation,
          variables: {
            input: {
              toolId: values.toolId,
              categoryId: category.id,
              name: values.name,
              url: values.url,
              userUrl: values.userUrl,
              description: values.description
            }
          },
          refetchQueries
        });
        const {
          addTool: { errors }
        } = data;

        setSubmitting(false);
        setServerErrors([]);

        if (errors.length === 0) {
          resetForm();
          close();
        } else {
          setServerErrors(errors);
        }
      }}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting,
        setFieldValue
      }) => (
        <form onSubmit={handleSubmit} css={styles.form}>
          <input
            type="hidden"
            name="toolId"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.toolId}
          />

          <div>
            <label>Name</label>
            <Autosuggest
              suggestions={suggestions}
              onSuggestionsFetchRequested={async ({ value }) => {
                if (!value) {
                  setSuggestions([]);
                  return;
                }

                const { data } = await client.query({
                  query: ToolsQuery,
                  variables: {
                    search: value
                  }
                });
                setSuggestions(data.tools);
              }}
              onSuggestionsClearRequested={() => {
                setSuggestions([]);
              }}
              getSuggestionValue={suggestion => suggestion.name}
              renderSuggestion={suggestion => <div>{suggestion.name}</div>}
              onSuggestionSelected={(event, { suggestion, method }) => {
                if (method === "enter") {
                  event.preventDefault();
                }
                setFieldValue("toolId", suggestion.id);
                setFieldValue("url", suggestion.url);
              }}
              onSuggestionHighlighted={({ suggestion }) => {
                if (suggestion) {
                  setFieldValue("toolId", suggestion.id);
                  setFieldValue("url", suggestion.url);
                }
              }}
              inputProps={{
                placeholder: "Enter or search for a tool",
                value: values.name,
                name: "name",
                onChange: (_event, { newValue }) => {
                  setFieldValue("name", newValue);
                  setFieldValue("toolId", "");
                  setFieldValue("url", "");
                },
                onBlur: handleBlur,
                className: errors.name ? "hasError" : null
              }}
            />
            <FormError touched={touched.name} error={errors.name} />
          </div>

          <div>
            <label>URL</label>
            <input
              type="text"
              name="url"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.url}
              disabled={values.toolId ? true : false}
              className={errors.url ? "hasError" : null}
            />
            <FormError touched={touched.url} error={errors.url} />
          </div>

          <div>
            <label>Your URL</label>
            <input
              type="text"
              name="userUrl"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.userUrl}
              className={errors.userUrl ? "hasError" : null}
            />
            <p
              css={css`
                font-size: 0.75rem;
                margin: 0px;
              `}
            >
              If you have an affiliate link, we'll use that one for any user
              clicking to the tool from your page.
            </p>
            <FormError touched={touched.userUrl} error={errors.userUrl} />
          </div>

          <div>
            <label>Description</label>
            <textarea
              name="description"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.description}
              className={errors.description ? "hasError" : null}
            />
            <FormError
              touched={touched.description}
              error={errors.description}
            />
          </div>

          {serverErrors.length > 0 ? (
            <p
              css={css`
                color: red;
                font-size: 0.75rem;
              `}
            >
              {serverErrors.join(",")}
            </p>
          ) : null}

          <div>
            <button type="submit" disabled={isSubmitting}>
              Save
            </button>
            <button
              onClick={event => {
                event.preventDefault();
                close();
              }}
              className="button-link"
              css={css`
                padding-left: 0.5rem !important;
              `}
            >
              cancel
            </button>
          </div>
        </form>
      )}
    </Formik>
  );
};

const EditToolSchema = Yup.object().shape({
  userUrl: Yup.string()
    .url("Must be a URL")
    .min(10, "Too Short!")
    .max(255, "Too Long!"),
  description: Yup.string()
    .min(1, "Too Short!")
    .max(1000, "Too Long!")
    .required("Required")
});

const EditToolMutation = gql`
  mutation EditToolMutation($input: EditToolInput!) {
    editTool(input: $input) {
      errors
      userTool {
        id
      }
    }
  }
`;

export const EditToolForm = ({ userTool, close, refetchQueries }) => {
  const client = useApolloClient();

  return (
    <Formik
      initialValues={{
        userUrl: userTool.url,
        description: userTool.description
      }}
      validationSchema={EditToolSchema}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        await client.mutate({
          mutation: EditToolMutation,
          variables: {
            input: {
              id: userTool.id,
              userUrl: values.userUrl,
              description: values.description
            }
          },
          refetchQueries
        });
        resetForm();
        setSubmitting(false);
        close();
      }}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting
      }) => (
        <form onSubmit={handleSubmit} css={styles.form}>
          <div>
            <label>Your URL</label>
            <input
              type="text"
              name="userUrl"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.userUrl}
              className={errors.userUrl ? "hasError" : null}
            />
            <FormError touched={touched.userUrl} error={errors.userUrl} />
            <p>
              If you have an affiliate link, we'll use that one for any user
              clicking to the tool from your page.
            </p>
          </div>

          <div>
            <label>Description</label>
            <textarea
              name="description"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.description}
              className={errors.description ? "hasError" : null}
            />
            <FormError
              touched={touched.description}
              error={errors.description}
            />
          </div>

          <div>
            <button type="submit" disabled={isSubmitting}>
              Save
            </button>
            <button
              onClick={event => {
                event.preventDefault();
                close();
              }}
              className="button-link"
              css={css`
                padding-left: 0.5rem !important;
              `}
            >
              cancel
            </button>
          </div>
        </form>
      )}
    </Formik>
  );
};

const styles = {
  form: css`
    padding: 1rem;
    position: relative;

    &:before {
      position: absolute;
      display: block;
      content: "";
      z-index: -1;
      opacity: 1;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background: #8ac6d1;
    }
  `
};
