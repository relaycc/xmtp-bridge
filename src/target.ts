import express from "express";

const app = express();
const port = 3000;

app.use(express.json());

app.post("/", (req, res) => {
  /* eslint-disable-next-line no-console */
  console.log("Received request from bridge: ", req.body);
  res.send({
    ok: true,
    data: `Hello from the proxied server! Your message was: ${req.body.message.content}`,
  });
});

app.listen(port, () => {
  /* eslint-disable-next-line no-console */
  console.log(`Bridge target listening on port ${port}`);
});
