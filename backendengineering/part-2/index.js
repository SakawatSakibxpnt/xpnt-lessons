import express from 'express';

const app = express();

const largeCalc = (n) => {
    let sum = 0;
    const start = Date.now();
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < 1e4; j++) {
            sum += i * j;
        }
    }
    const end = Date.now();
    const  time = ((end - start)/1000).toFixed(2);
    return {Sum: sum, time: `Execution : ${time}s`};
};

app.get('/cal', (req, res) => {
    console.log(`Received request for n=${req.query.n}`);
    
    const start = Date.now();

    const result = largeCalc(req.query.n);

    const end = Date.now();

    const time = ((end - start)/1000).toFixed(2);

    console.log(`Time of req receive to response for n=${req.query.n}: ${time}s`);

    res.json(result);
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});