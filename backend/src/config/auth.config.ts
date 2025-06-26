export default () => {
  return {
    token: {
      secret: process.env.AUTH_SECRET,
      ttl: 60 * 60, // 1 hour
      refreshTtl: 24 * 60 * 60 * 30, // 30 days
    },
  };
};
