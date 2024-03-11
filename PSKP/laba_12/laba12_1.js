const redis = require('redis');

const client = redis.createClient({url:'redis://localhost:6379/'});
client.on('ready',()=>console.log('client ready'));
client.on('error',()=>console.log('error'));
client.on('connect',()=>console.log('connect'));
client.on('end',()=>console.log('end'));

client.connect().then(()=>{client.quit();}).catch(err=>console.log(err));