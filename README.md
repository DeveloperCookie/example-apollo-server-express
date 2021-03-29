# 목차

1. Quick Start
2. Database 생성
3. Schema 구현
4. Resolver 구현
5. 서버 생성
6. 서버 실행 및 테스트

# 1. Quick Start

Apollo 공식 문서에서 제공하는 커맨드를 통해 빠르게 Node Express 서버를 구성할 수 있습니다.

[https://www.apollographql.com/docs/apollo-server/v1/example/](https://www.apollographql.com/docs/apollo-server/v1/example/)

```bash
npm install --save apollo-server-express@1 graphql-tools graphql express body-parser
```

# 2. Database 생성

DB는 MongoDB, MySQL 등 종류는 상관없습니다.

테스트를 위해 로컬에 간단히 생성해봅니다.

```jsx
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
```

# 3. Schema 구현

Schema 는 클라이언트와 서버가 어떻게 통신할지를 정의한 명세서입니다.

### Query, Mutation

- Query: 데이터 읽기 요청
- Mutation: 데이터 수정 요청

아래와 같이 각 데이터의 타입과 필수입력 여부를 명시합니다.

- Type 종류: String, Int, ...
- `!` : Not Nullable

```jsx
// The GraphQL schema in string form
const typeDefs = `
  type Book {
    id: Int,
    title: String!,
    author: String
  }
  
  type Query {
    books: [Book]
  }

  type Mutation {
    addBook(title: String!, author: String): Book
  }
`;
```

# 4. Resolver 구현

Resolver 라는 개념은 DNS 등 여러 기술에서 언급되는 개념인데요,

GraphQL 에서의 Resolver 는 "**클라이언트에서 요청한 쿼리를 서버에서 어떻게 처리할지**" 를 정의합니다.

DB 에서 데이터를 찾거나, 메모리에 접근하거나, 다른 API 에 요청해서 데이터를 가져오는 등의 역할을 할 수 있습니다.

참고

- DNS resolver: Host 의 정보를 구하는 프로그램의 요청을 네임서버에 대한 질의 형태로 번역하고, 그 질의에 대한 응답을 프로그램에 적절한 형태로 변경하는 일을 담당합니다.

### Resolver Arguments

리졸버는 4가지 Arguments 를 받습니다.

```jsx
fieldName(obj, args, context, info) { result }
```

1. `obj`: Parent 필드로부터 받은 결과를 포함합니다.
2. `args`: 쿼리로 넘겨받은 arguments 객체. ex) `author(name: "Haley")` → `{"name": "Haley"}`
3. `context`: 모든 Resolver 가 공유하는 객체.
4. `info`: advanced case 에서만 사용되는 매개변수. 쿼리 실행 상태에 대한 정보를 담고 있습니다.

주로 obj, args 를 활용하여 특정 작업을 수행한 후 결과값을 반환합니다.

**Example Code**

```jsx
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
```

# 5. 서버 생성

```jsx
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
```

# 6. 서버 실행 및 테스트

```bash
node server.js
> Go to http://localhost:3000/graphiql to run queries!
```

### 테스트

**Query**

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/560456ac-4d1b-4dc5-87c8-066c94a795f7/_2021-03-29__12.00.34.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/560456ac-4d1b-4dc5-87c8-066c94a795f7/_2021-03-29__12.00.34.png)

**Mutation**

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/7d95114b-8e36-4bca-a650-5a19ea955fb1/_2021-03-29__12.14.31.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/7d95114b-8e36-4bca-a650-5a19ea955fb1/_2021-03-29__12.14.31.png)
