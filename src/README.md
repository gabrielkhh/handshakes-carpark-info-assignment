## Getting Started
First, We need to establish our database tables and seed some users into it:
```bash
node seedData.js
```
Then, we need to ingest our carpark data from our source file
```bash
node ingest.js
```

After we are done with setting up the database, let's install our dependencies required for our API server.
```bash
pnpm i
```

To run the API server:
```bash
node app.js
```

View the Swagger Docs at http://localhost:3000/api-docs/