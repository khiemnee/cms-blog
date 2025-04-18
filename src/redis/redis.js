import { createClient } from 'redis';

const client = createClient({
    username: process.env.redis_username,
    password: process.env.redis_password,
    socket: {
        host: process.env.redis_host,
        port: process.env.redis_port
    }
});

client.on('error', err => console.log('Redis Client Error', err));

await client.connect();

export default client