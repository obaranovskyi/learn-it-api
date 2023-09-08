import { GraphQLError } from 'graphql';

export interface GqlResponseModel {
    body: { data: any; errors: GraphQLError[] };
}
