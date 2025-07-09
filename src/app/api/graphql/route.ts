import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { NextRequest } from 'next/server';
import { gql } from 'graphql-tag';

// Fake users database
const users = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password456',
  },
];

// GraphQL type definitions
const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
  }

  type LoginResponse {
    token: String!
    user: User!
  }

  type Mutation {
    login(email: String!, password: String!): LoginResponse
  }

  type Query {
    _empty: String
  }
`;

// Resolvers for the GraphQL schema
const resolvers = {
  Mutation: {
    login: (
      _: any,
      { email, password }: { email: string; password: string }
    ) => {
      const user = users.find(
        (u) => u.email === email && u.password === password
      );
      console.log('user', user);
      if (!user) throw new Error('Invalid credentials');

      return {
        token: `fake-token-${user.id}`,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      };
    },
  },
};

// Apollo server setup
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const handler = startServerAndCreateNextHandler<NextRequest>(server);

export { handler as GET, handler as POST };
