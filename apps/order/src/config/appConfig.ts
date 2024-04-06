export default () => {
  return {
    database: {
      client: process.env.DATABASE_CLIENT,
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD || '',
      name: process.env.DATABASE_NAME,
      synchronize: process.env.TYPEORM_SYNCHRONIZE || false,
      max_pool: +process.env.DATABASE_MAX_POOL,
    },
  };
};
