
const accessToken = 'IGQWROYnJWei0wYTFzV0I3TGtnM2ltbUF4ZAjZAqZAzk0bDZAEU2lvWGFkMGRSWFdUcnFaMTNiNkV6eUVkLUd5Smpnc1RpY1AyOEJNaU5sZAGFQNGtyanJuQ2EtY19GTktaV0twTWhtb01fR29BZAzJVdC1mWU1NbUJMQjQZD'; // Replace with your actual access token



const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3100;

// Instagram app credentials
app.use(cors());


// Endpoint to fetch user media
app.get('/instagram', async (req, res) => {
  const apiEndpoint = 'https://graph.instagram.com/me/media';
  const queryParams = {
    fields: 'id,media_url,caption',
    access_token: accessToken
  };
  
  
  try {
    const response = await axios.get(apiEndpoint, { params: queryParams });
    const responseData = response.data.data;
    res.json(responseData);
  } catch (error) {
    console.error('Error fetching user media:', error.response.data);
    res.status(500).json({ error: 'Error fetching user media' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});



