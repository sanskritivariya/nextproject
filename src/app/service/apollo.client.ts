import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
// import TimeoutLink from 'apollo-link-timeout'
import {
  ApolloLink,
  Observable,
  Operation,
  NextLink,
  FetchResult,
} from '@apollo/client';

class TimeoutLink extends ApolloLink {
  private timeout: number;
  constructor(timeout: number) {
    super();
    this.timeout = timeout;
  }
  request(operation: Operation, forward: NextLink) {
    return new Observable<FetchResult>((observer) => {
      const timer = setTimeout(() => {
        observer.error(new Error('Request timed out'));
      }, this.timeout);
      const subscription = forward(operation).subscribe({
        next: (result) => observer.next(result),
        error: (error) => observer.error(error),
        complete: () => observer.complete(),
      });
      return () => {
        clearTimeout(timer);
        subscription.unsubscribe();
      };
    });
  }
}
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs';

const httpLink = createHttpLink({
  uri: 'http://localhost:3000/api/graphql',
});

const uploadLink = createUploadLink({
  uri: 'http://localhost:3000/api/graphql',
});

const timeoutLink = new TimeoutLink(1600000);

const unauthorizedLink = onError(({ networkError }) => {
  const statusCode =
    networkError && 'statusCode' in networkError
      ? networkError.statusCode
      : 500;
  if (statusCode === 401 || statusCode === 403) {
    localStorage.removeItem('token');
  }
});
const cache = new InMemoryCache({});

export const getApolloClient = ({
  header,
  type,
}: {
  header?: any;
  type?: string;
}): ApolloClient<NormalizedCacheObject> => {
  const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        ...headers,
        ...header,
        Authorization: token ? `Bearer ${token}` : '',
      },
    };
  });

  const link =
    type === 'FormData'
      ? ApolloLink.from([authLink, timeoutLink, unauthorizedLink, uploadLink])
      : ApolloLink.from([authLink, timeoutLink, unauthorizedLink, httpLink]);

  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link,
    cache: cache,
  });
};
