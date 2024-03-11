const redis = require('redis');

const client = redis.createClient({url:'redis://localhost:6379/'});
client.on('ready',()=>console.log('client ready'));
client.on('error',()=>console.log('error'));
client.on('connect',()=>console.log('connect'));
client.on('end',()=>console.log('end'));

(async ()=>{
    await client.connect();

    await client.set('incr',0)

    var startTime = performance.now();

    for(var i = 0; i < 10000; i++){
        await client.incr('incr');
    }

    var endTime = performance.now()
    console.log(`\ttime: ${endTime - startTime} milliseconds`);
    
    
    startTime = performance.now();

    for(var i = 0; i < 10000; i++){
        await client.decr('incr');
    }

    endTime = performance.now()
    console.log(`\ttime: ${endTime - startTime} milliseconds`);
    
    await client.del('incr')

     await client.quit()
})()