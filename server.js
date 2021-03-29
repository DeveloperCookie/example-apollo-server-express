const express = require("express");
const bodyParser = require("body-parser");
const { graphqlExpress, graphiqlExpress } = require("apollo-server-express");
const { makeExecutableSchema } = require("graphql-tools");

// Some fake data
const books = [
  {
    id: 1,
    title: "Harry Potter and the Sorcerer's stone",
    author: "J.K. Rowling",
  },
  {
    id: 2,
    title: "Jurassic Park",
    author: "Michael Crichton",
  },
];

// The GraphQL schema in string form
const typeDefs = `
  type Book {
    id: Int,
    title: String,
    author: String
  }
  
  type Query {
    books: [Book],
    book: Book
  }

  type Mutation {
    addBook(title: String, author: String): Book
  }
`;

// The resolvers
const resolvers = {
  Query: {
    books: () => books,
    book: (_, { id }) => {
      return books.filter((book) => book.id === id)[0];
    },
  },
  Mutation: {
    addBook: (_, { title, author }) => {
      const newBook = {
        id: books.length + 1,
        title,
        author,
      };

      books.push(newBook);

      return newBook;
    },
  },
};

// Put together a schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

// Initialize the app
const app = express();

// The GraphQL endpoint
app.use("/graphql", bodyParser.json(), graphqlExpress({ schema }));

// GraphiQL, a visual editor for queries
app.use("/graphiql", graphiqlExpress({ endpointURL: "/graphql" }));

// Start the server
app.listen(3000, () => {
  console.log("Go to http://localhost:3000/graphiql to run queries!");
});
