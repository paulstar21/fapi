import server from "../src";
import _ from "lodash";

let customerData = [
  { id: 1, name: "Aaron" },
  { id: 2, name: "Adrian" },
  { id: 3, name: "Ben" }
];

let templates = {
  customers: [
    {
      req: { path: () => `/:id([0-9]{1,3})` },
      res: {
        body: ctx => _.find(customerData, { id: parseInt(ctx.req.params.id) }),
        status: ctx =>
          parseInt(ctx.req.params.id) <= customerData.length ? 200 : 404
      }
    },
    {
      req: { query: { name: /.*/ } },
      res: { body: ctx => _.filter(customerData, ctx.req.query) }
    },
    {
      res: { body: ctx => customerData }
    },
    {
      req: { method: "post", body: { name: /.+/ } },
      res: {
        status: 201,
        body: ctx => {
          const customer = {
            id: customerData.length + 1,
            name: ctx.req.body.name
          };
          customerData = [...customerData, customer];
          return customer;
        }
      }
    }
  ]
};

const app = server(templates);
app.listen(3000, () => {
  console.log("Running on port 3000.");
});
