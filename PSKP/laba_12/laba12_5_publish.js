const redis = require('redis');

const client = redis.createClient({url:'redis://localhost:6379/'});


(async () =>{
    await client.connect();

    setTimeout(async()=>{await client.publish('channelOne', '1');},2000);
    setTimeout(async()=>{await client.publish('channelTwo', '1');},3000);
    setTimeout(async()=>{await client.publish('channelThree', '1');},4000);
    setTimeout(async()=>{await client.publish('channelFour', '1');},6000);

    setTimeout(async()=>{await client.quit();},20000);
    client.on('end',()=>console.log('end'));
})()