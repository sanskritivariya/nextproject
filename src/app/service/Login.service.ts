import { LoginApi } from '../graphql/main';
import { executeMutation, TStatement } from './apiService';

export const LoginAPICALL = (input: any): Promise<any> => {
  const statement: TStatement = {
    statement: LoginApi,
    name: 'login',
  };
 
  return executeMutation(statement, { ...input });
};
