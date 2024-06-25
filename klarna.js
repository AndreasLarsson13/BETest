const express = require('express');
const axios = require('axios');
const base64 = require('base-64');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Your Klarna API credentials
const username = 'PK138260_b03a4365bf89';
const password = 'wJIoLF0PBkDO457X';
const authHeader = 'Basic ' + base64.encode(username + ':' + password);

// API endpoint
const apiURL = 'https://api.playground.klarna.com/';


// Endpoint for opening a payment session with Klarna and redirecting to Klarna's checkout page
app.post('/open-payment-session', async (req, res) => {

  // Payload for opening a payment session
const payload = {
  auto_capture: false,
  billing_address: {
    city: req.body.city,
    country: 'FI',
    email: req.body.email,
    family_name: req.body.lastName,
    given_name: req.body.firstName,
    organization_name: 'string',
    phone: req.body.phone,
    postal_code: req.body.zipCode,
    region: 'OH',
    street_address: req.body.address,
  },
  locale: 'sv-FI',
  merchant_urls: {
    confirmation: 'https://www.example-url.com/confirmation',
    notification: 'https://www.example-url.com/notification',
    push: 'https://www.example-url.com/push',
    authorization: 'https://www.example-url.com/authorization',
    terms: 'https://www.example-url.com/authorization',
    checkout: 'https://www.example-url.com/authorization'
  },
  order_amount: req.body.orderData.total * 100,
  order_lines: [
  ],
  order_tax_amount: req.body.orderData.total * 0.2 * 100,
  purchase_country: 'FI',
  purchase_currency: 'EUR'
}

console.log(req.body.country)
if (req.body.country === "Sverige")
{
  payload.purchase_country = 'SE';
  payload.purchase_currency = 'SEK',
  payload.locale = 'sv-SE'
}

let number = 0;

req.body.orderData.items.forEach(item=> {
  number ++
  payload.order_lines.push({
    image_url: 'https://www.exampleobjects.com/logo.png',
    name: item.name,
    product_identifiers: {
      brand: item.name,
      category_path: 'Shoes > Running',
      manufacturer_part_number: 'hejsan',
      color: item.attributes.color,
      size: item.attributes.storlek
    },
    product_url: 'https://.../AD6654412.html',
    quantity: item.quantity,
    quantity_unit: 'pcs',
    tax_rate: 2500,
    total_amount: item.itemTotal * 100,
    total_discount_amount: 0,
    total_tax_amount: item.itemTotal * 0.2 * 100,
    type: 'physical',
    unit_price: item.price * 100
  })

})








    
    try {
        // POST request to open a payment session
        const response = await axios.post(apiURL + '/checkout/v3/orders', payload, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authHeader
            }
        }); 

        
        // Extract client token from the response
       const clientToken = response.data.client_token;
        // Redirect the customer to Klarna's payment page
        res.send(response.data.html_snippet);
        /* res.status(200).send('Funkar'); */
    } catch (error) {
        console.error('Error opening payment session:', error.response.data);
        res.status(500).send('Error opening payment session');
    }
});

app.listen(3500, () => {
    console.log('Server is running on port 3500');
});



