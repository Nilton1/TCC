
import response from  'express'; 
import {RedisClient,Multi} from 'redis';
import { makeExecutableSchema } from 'graphql-tools';
//import * as redis from 'redis';

var { graphqlHTTP } = require('express-graphql');



import typeDefs from './schema';
import resolvers from './resolvers';
import bluebird from 'bluebird';

export const schema = makeExecutableSchema({
    typeDefs,
    resolvers
})
const express = require('express'); 
const app = express(); 

//const client = redis.createClient();
var redis = require('redis');
bluebird.promisifyAll(RedisClient.prototype);
bluebird.promisifyAll(Multi.prototype);

client.on("error", err =>{
    console.log("Error " + err);
})

const PORT = 8080;



app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: global,
  graphiql: true,
  context:{client}
}));
app.listen(PORT);
console.log(`Running a GraphQL API server at http://localhost:${PORT}/graphql`);

