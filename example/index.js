import server, { router } from "../src";

let templates = {
  customers: {
    templates: [
      {
        req: { query: { name: /a.*/ } },
        res: [{ id: 1, name: "Aaron" }, { id: 2, name: "Adrian" }]
      },
      { req: { query: { name: /.*/ } }, res: { body: [] } }
    ]
  }
};

const app = server(templates);
app.listen(3000, () => {
  console.log("Running on port 3000.");
});
