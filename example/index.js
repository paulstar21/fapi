import server from "../src";

let templates = {
  ping: [
    {
      res: { body: "pong" }
    }
  ]
};

const app = server(templates, {
  swagger: {
    title: "test api"
  }
});
app.listen(3000, () => {
  console.log("Running on port 3000.");
});
