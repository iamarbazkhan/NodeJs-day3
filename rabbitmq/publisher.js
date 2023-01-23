const amqp = require("amqplib/callback_api");

amqp.connect("amqp://localhost", (err, conn) => {
  if (err) {
    throw err;
  }
  conn.createChannel((err, channel) => {
    if (err) {
      throw err;
    }
    let msg = { data: "RabbitMq msg" };
    channel.assertExchange("object", "fanout", {
      durable: false,
    });
    channel.publish("object", "", Buffer.from(JSON.stringify(msg)));
    console.log("msg", msg);
    setTimeout(() => {
      conn.close();
    }, 1000);
  });
});

