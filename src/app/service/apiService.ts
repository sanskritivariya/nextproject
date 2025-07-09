import {
  ApolloError,
  ApolloQueryResult,
  DocumentNode,
  FetchPolicy,
} from '@apollo/client';
import { getApolloClient } from './apollo.client';

export type TStatement = {
  statement: DocumentNode;
  name: string;
  fetchPolicy?: FetchPolicy;
  header?: any;
  type?: string;
};

export const executeQuery = async (
  { statement, name, fetchPolicy }: TStatement,
  variables: any = {}
): Promise<ApolloQueryResult<any>> => {
  try {
    const client = getApolloClient({});
    const { data } = await client.query({
      query: statement,
      variables: {
        ...variables,
      },
      fetchPolicy: fetchPolicy ? fetchPolicy : 'no-cache',
    });
    return data[name];
  } catch (err) {
    if (err instanceof ApolloError) {
      const networkError = err.networkError as any;
      const graphQLErrors = err.graphQLErrors as any;
      const errors =
        (graphQLErrors && graphQLErrors?.at(0)?.message) ||
        (networkError?.result?.errors &&
          networkError?.result?.errors[0] &&
          networkError?.result?.errors[0].message) ||
        'Error in execute';
      throw errors;
    }
    throw err;
  }
};
export const executeMutation = async (
  { statement, name, header, type }: TStatement,

  variables: any
): Promise<any> => {
  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));
  const timeout = delay(1600000);

  try {
    const client = getApolloClient({ header, type });
    const result = await Promise.race([
      client.mutate({
        mutation: statement,
        variables: {
          ...variables,
        },
      }),
      timeout.then(() => {
        throw new Error('Timeout error');
      }),
    ]);
    console.log('result', result);
    console.log('name', name);
    return result.data[name]; // ✅ FIXED
  } catch (err) {
    if (err instanceof ApolloError) {
      const networkError = err.networkError as any;
      const graphQLErrors = err.graphQLErrors as any;
      const errors =
        (graphQLErrors && graphQLErrors?.at(0)?.message) ||
        (networkError?.result?.errors &&
          networkError?.result?.errors[0]?.message) ||
        'Error in execute';
      throw errors;
    }
    throw err;
  }
};
