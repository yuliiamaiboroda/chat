export default () => {
  return {
    mongoDB: {
      uri: process.env.MONGODB_URI,
    },
  };
};
