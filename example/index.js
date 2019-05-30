import server from "../src";

let templates = {
  ping: [
    {
      res: { body: "pong" }
    }
  ]
};

const app = server(templates);
app.listen(3000, () => {
  console.log("Running on port 3000.");
});
