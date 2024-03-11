const redis = require('redis');

const client = redis.createClient({url:'redis://localhost:6379/'});


(async () =>{

    
    await client.connect();

    await client.pSubscribe('channel*',(message,channel)=>{
        console.log(`channel: ${channel} message: ${message}`);
    },true)

    client.on('error',(err)=>console.log(err));

    setTimeout(async()=>{
        if (client.connected) {
            await client.pUnsubscribe();
            await client.quit();
        }
        else
            process.exit();
    },8000);
})()