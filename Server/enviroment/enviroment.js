export const environment = {
  externalUrl:process.env["EXTERNAL_URL"],
  connections: {
    redis: {
      host: process.env["REDIS__HOST"],
      db: +process.env["REDIS__DB"],
      prefix: process.env["REDIS__PREFIX"],
      port: +process.env["REDIS__PORT"],
      password: process.env["REDIS__PASSWORD"],
    },
    mongo: {
      external: {
        host: process.env["MONGO_EXTERNAL_HOST"],
        user: process.env["MONGO_EXTERNAL_USER"],
        pass: process.env["MONGO_EXTERNAL_PASS"],
        tls: process.env["MONGO_EXTERNAL_TLS"],
        port: +process.env["MONGO_EXTERNAL_PORT"],
        extraQueryParams: process.env["MONGO_EXTERNAL_PARAMS"],
        prefix: process.env["MONGO_EXTERNAL_PREFXIX"],
      },
    },
    internalRabbit: {
      hostname: process.env["RABBIT_INTERNAL_HOST"],
      vhost: process.env["RABBIT_INTERNAL_VHOST"],
      prefix: process.env["RABBIT_INTERNAL_PREFIX"],
      port: +process.env["RABBIT_INTERNAL_PORT"],
      username: process.env["RABBIT_INTERNAL_USER"],
      password: process.env["RABBIT_INTERNAL_PASS"],
      protocol: process.env["RABBIT_INTERNAL_PROTOCOL"],
    },
  },
    mongo: {
      host: "localhost",
      user: "admin",
      pass: "root",
      tls: "false",
      port: "27020",
      extraQueryParams: "tls=false&authMechanism=DEFAULT",
      prefix: "dev_",
    },


  
};
