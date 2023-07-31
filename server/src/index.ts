import app from "./app";

const port = 4000;

app.listen(port, () => {
  console.log(
    `[Server]: I am running at http://localhost:${port} in ${process.env.NODE_ENV} mode`
  );
});
