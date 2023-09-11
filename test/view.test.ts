import * as glue from "@aws-cdk/aws-glue-alpha";
import { App, Stack } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import * as iam from "aws-cdk-lib/aws-iam";
import { View } from "../src";

test("Should not create S3 Bucket", () => {
  const app = new App();
  const stack = new Stack(app);
  const database = new glue.Database(stack, "Database");
  // const orderTable = new glue.Table(stack, "OrderTable", {
  //   database,
  //   columns: [
  //     { name: "orderkey", type: glue.Schema.STRING },
  //     { name: "orderstatus", type: glue.Schema.STRING },
  //     { name: "totalprice", type: glue.Schema.BIG_INT },
  //     { name: "orderdate", type: glue.Schema.DATE },
  //   ],
  //   dataFormat: glue.DataFormat.JSON,
  // });

  new View(stack, "OrdersByDate", {
    database,
    columns: [
      { name: "orderdate", type: glue.Schema.STRING },
      { name: "price", type: glue.Schema.BIG_INT },
    ],
    queryString: `SELECT orderdate, sum(totalprice) AS price FROM orders GROUP BY orderdate;`,
  });
  const template = Template.fromStack(stack);
  template.resourceCountIs("AWS::S3::Bucket", 0);
});

test("Should can use grant APIs", () => {
  const app = new App();
  const stack = new Stack(app);
  const database = new glue.Database(stack, "Database");
  const view = new View(stack, "OrdersByDate", {
    database,
    columns: [
      { name: "orderdate", type: glue.Schema.STRING },
      { name: "price", type: glue.Schema.BIG_INT },
    ],
    queryString: `SELECT orderdate, sum(totalprice) AS price FROM orders GROUP BY orderdate;`,
  });
  const readOnlyRole = new iam.Role(stack, "ReadOnlyRole", {
    assumedBy: new iam.AnyPrincipal(),
  });
  const writeOnlyRole = new iam.Role(stack, "WriteOnlyRole", {
    assumedBy: new iam.AnyPrincipal(),
  });
  const readWriteRole = new iam.Role(stack, "ReadWriteRole", {
    assumedBy: new iam.AnyPrincipal(),
  });
  const toUnderlyingResourcesRole = new iam.Role(
    stack,
    "ToUnderlyingResourcesRole",
    {
      assumedBy: new iam.AnyPrincipal(),
    },
  );
  view.grantRead(readOnlyRole);
  view.grantWrite(writeOnlyRole);
  view.grantReadWrite(readWriteRole);
  view.grantToUnderlyingResources(toUnderlyingResourcesRole, ["glue:*"]);
  Template.fromStack(stack);
});
