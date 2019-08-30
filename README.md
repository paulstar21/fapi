# fapi

Create fake API's in seconds.

## Getting Started

Installation is done using the `npm install` command.

Before installing, download and install [Node.js](https://nodejs.org/en/download/)

Create a directory that will hold your fake API.

```shell
$ mkdir fakeapi
$ cd fakeapi
```

Create a `package.json` file for your API using the `npm init` command.

Add `fapi` to your node app.

```shell
$ npm init -y
```

Install `fapi` in the `fakeapi` directory and save it to the dependency list.

```shell
$ npm i github:benfo/fapi#0.2.0
```

Create a new file called `index.js` with the following content.

```javascript
const fapi = require("fapi");

const templates = {
  ping: [{ res: { body: "pong" } }]
};

const app = fapi.server(templates);
app.listen(3000, () => {
  console.log("Running on port 3000.");
});
```

Start the API.

```shell
$ node index.js
```

Open your favorite browser and navigate to http://localhost:3000/api/ping.

You should a response message `pong`.
