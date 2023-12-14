import * as glue from "@aws-cdk/aws-glue-alpha";
import * as integ from "@aws-cdk/integ-tests-alpha";
import { App, RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import * as s3 from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";
import { View } from "../src";

class AthenaViewStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    const database = new glue.Database(this, "Database");
    new glue.S3Table(this, "OrderTable", {
      bucket: new s3.Bucket(this, "OrderBucket", {
        removalPolicy: RemovalPolicy.DESTROY,
        autoDeleteObjects: true,
      }),
      database,
      columns: [
        { name: "orderkey", type: glue.Schema.STRING },
        { name: "orderstatus", type: glue.Schema.STRING },
        { name: "totalprice", type: glue.Schema.BIG_INT },
        { name: "orderdate", type: glue.Schema.DATE },
      ],
      dataFormat: glue.DataFormat.JSON,
    });

    new View(this, "OrdersByDate", {
      database,
      columns: [
        { name: "orderdate", type: glue.Schema.STRING },
        { name: "price", type: glue.Schema.BIG_INT },
      ],
      queryString: `SELECT orderdate, sum(totalprice) AS price FROM orders GROUP BY orderdate;`,
    });
  }
}

const app = new App();
const testCase = new AthenaViewStack(app, "IntegDefaultStack");
new integ.IntegTest(app, "IntegTestDefault", {
  testCases: [testCase],
  diffAssets: true,
});
