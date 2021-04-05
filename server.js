const express = require("express");
const bodyParser = require("body-parser");
const { graphqlExpress, graphiqlExpress } = require("apollo-server-express");
const { makeExecutableSchema } = require("graphql-tools");
var cors = require("cors");

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

const greetings = [
  {
    id: 1,
    language: "english",
    message: "Hello",
  },
  {
    id: 2,
    language: "korean",
    message: "안녕하세요",
  },
];

// The GraphQL schema in string form
const typeDefs = `
  type Book {
    id: Int,
    title: String,
    author: String
  }
  
  type Greeting {
    id: Int,
    language: String,
    message: String
  }
  
  type Query {
    books: [Book],
    book(id: Int): Book,
    greetings: [Greeting],
    greeting(language: String): Greeting
  }

  type Mutation {
    addBook(title: String, author: String): Book,
    addGreeting(language: String, message: String): Greeting
  }
`;

// The resolvers
const resolvers = {
  Query: {
    books: () => books,
    book: (_, { id }) => {
      return books.filter((book) => book.id === id)[0];
    },
    greetings: () => greetings,
    greeting: (_, { language }) => {
      console.log(language);
      return greetings.filter((greeting) => greeting.language === language)[0];
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
    addGreeting: (_, { language, message }) => {
      const newGreeting = {
        id: greetings.length + 1,
        language,
        message,
      };

      greetings.push(newGreeting);

      return newGreeting;
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

app.use(cors());

// The GraphQL endpoint
app.use("/graphql", bodyParser.json(), graphqlExpress({ schema }));

// GraphiQL, a visual editor for queries
app.use("/graphiql", graphiqlExpress({ endpointURL: "/graphql" }));

// Start the server
app.listen(3000, () => {
  console.log("Go to http://localhost:3000/graphiql to run queries!");
});
