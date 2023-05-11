# OAuth2 client

This library provides a client for OAuth2 authentication.

## Usage

The client is used to obtain an access token from an OAuth2 provider. 
The access token is then used to make requests to the API.

```typescript
const client = new OAuth2Client({
  clientId: 'your_client_id',
  clientSecret: 'your_client_secret',
  accessTokenUrl: 'https://example.com/oauth2/token',
  refreshTokenUrl: 'https://example.com/oauth2/refresh_token',
});

const data = await client.get('https://api.example.com/data');
console.log(data);

const newData = { name: 'John', age: 30 };
const result = await client.post('https://api.example.com/create', newData);
console.log(result);
```