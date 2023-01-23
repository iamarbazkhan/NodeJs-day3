const amqp = require("amqplib/callback_api");

amqp.connect("amqp://localhost", (err, conn) => {
  if (err) {
    throw err;
  }
  conn.createChannel((err, channel) => {
    if (err) {
      throw err;
    }
    let exchange = 'object'
    channel.assertExchange(exchange,'fanout',{
      durable:false
  })
    channel.assertQueue('', {
      exclusion: true,
    },(error, q)=>{
  if (error){
    throw error;
  }
  channel.bindQueue(q.queue,exchange,'');
  channel.consume(q.queue,(msg)=>{
    console.log(JSON.parse(msg.content))
  })
    });
    
  });
  
});


