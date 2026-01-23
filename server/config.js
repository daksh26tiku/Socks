// config.js
module.exports = {
    database: {
      username: process.env.DB_USER || 'user',
      password: process.env.DB_PASSWORD || '1234',
      database: process.env.DB_NAME || 'chat-app',
      host: process.env.DB_HOST || 'localhost',
      dialect: 'postgres',
      port: process.env.DB_PORT || 5432,
    },
    jwt_expiry: process.env.JWT_EXPIRY || '6h',
    jwt_secret: process.env.JWT_SECRET || "a_strong_secret_key",
    redisConfig : {
      url: process.env.REDIS_URL || 'redis://redis-container:6379',
    },
    kafkaConfig : {
      brokers: process.env.KAFKA_BROKERS ? process.env.KAFKA_BROKERS.split(',') : [process.env.KAFKA_HOST || 'kafka:9092'],
      ssl: process.env.KAFKA_SSL === 'true',
      ca: process.env.KAFKA_CA_CERT || null,
      cert: process.env.KAFKA_ACCESS_CERT || null,
      key: process.env.KAFKA_ACCESS_KEY || null,
      topic: {
          CHAT_MESSAGES: "chat-messages",
          CHAT_EVENTS: "chat-events"
        },
    }
  };

// docker run --name mysql-container -e MYSQL_ROOT_PASSWORD=root-pw -e MYSQL_DATABASE=chat-app -e MYSQL_USER=user -e MYSQL_PASSWORD=1234 -d -p 3306:3306 mysql:latest

// docker run --name redis-container -p 6389:6379 -d redis:latest

// docker run -p 2181:2181 zookeeper


