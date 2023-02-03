const { ApolloServer, gql } = require("apollo-server");
const { fakeData } = require("./src/fake-data");

// 定义schema，也就是要传给前端的接口文档。
const typeDefs = gql`
  # 定义了Store类
  type Store {
    listingId: ID!
    name: String!
    latitude: Float!
    longitude: Float!
    address: String!
    visitors: Int
    frequency: Float
    mediumIncome: String
  }

  # 定义了开放给前端的查询接口。
  type Query {
    store(latitude: Float!, longitude: Float!, radius: Float): [Store]
    pin(latitude: Float!, longitude: Float!, radius: Float): [Store]
  }
`;

const getData = (args, radius) => {
  return fakeData.filter((item) => {
    return (
      Number(item.latitude) <= args.latitude + radius &&
      Number(item.latitude) >= args.latitude - radius &&
      Number(item.longitude) >= args.longitude - radius &&
      Number(item.longitude) <= args.longitude + radius
    );
  });
};

// 将数据与graphql对接
const resolvers = {
  // 处理查询接口。
  Query: {
    store(parent, args, context, info) {
      let radius = args.radius || 0;
      return getData(args, radius);
    },
    pin(parent, args, context, info) {
      let radius = args.radius || 0;
      return getData(args, radius);
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
