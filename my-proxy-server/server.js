const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

const API_TOKENS = [
    'be3a4a0da29649b49f4e2993959b7c28',
    '3ffc8b7376ce456eba25599a38e36bea'
];
let currentTokenIndex = 0;

app.use(cors());

async function fetchWithToken(url, headers) {
    let retries = API_TOKENS.length;

    while (retries > 0) {
        try {
            headers['X-Auth-Token'] = API_TOKENS[currentTokenIndex];
            const response = await axios.get(url, { headers });
            return response.data;
        } catch (error) {
          
                console.log(`Error with token ${API_TOKENS[currentTokenIndex]}. Switching to next token...`);
                currentTokenIndex = (currentTokenIndex + 1) % API_TOKENS.length;
                retries--;
                     }
    }

    // If no token works, return a JSON error message
    throw new Error(JSON.stringify({ message: 'All API tokens failed.' }));
}


app.get('/api', async (req, res) => {
    const targetUrl = req.query.url;
    if (!targetUrl) {
        return res.status(400).send('Missing URL parameter');
    }

    try {
        const data = await fetchWithToken(targetUrl, {});
        res.json(data);
    } catch (error) {
        res.status(error.response?.status || 500).send(error.message);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy server running on http://localhost:${PORT}`));
