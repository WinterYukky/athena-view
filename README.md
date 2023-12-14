# Athena View Construct

This is a Construct Library that makes it easy to create Views in Amazon Athena.

## Install

```bash
npm install athena-view
# OR
yarn add athena-view
```

## Get Started

```ts
import * as glue from "@aws-cdk/aws-glue-alpha";
import { View } from "athena-view";

const database = new glue.Database(this, "Database");
const orderTable = new glue.S3Table(this, "OrderTable", {
  database,
  columns: [
    { name: "orderkey", type: glue.Schema.STRING },
    { name: "orderstatus", type: glue.Schema.STRING },
    { name: "totalprice", type: glue.Schema.BIG_INT },
    { name: "orderdate", type: glue.Schema.DATE },
  ],
  dataFormat: glue.DataFormat.PARQUET,
});
new View(this, "OrdersByDate", {
  database,
  columns: [
    { name: "orderdate", type: glue.Schema.STRING },
    { name: "price", type: glue.Schema.BIG_INT },
  ],
  queryString: `SELECT orderdate, sum(totalprice) AS price FROM ${orderTable.tableName} GROUP BY orderdate;`,
});
```

## Side note

The actual state of a view in Amazon Athena is an AWS Glue table. This Construct Library is a Glue Table L2.5 Construct specialized for Athena Views. If you want to customize it in detail, please refer to the GitHub source.
https://github.com/WinterYukky/athena-view
