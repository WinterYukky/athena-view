import * as glue from "@aws-cdk/aws-glue-alpha";
import { Fn, Stack } from "aws-cdk-lib";
import { CfnTable } from "aws-cdk-lib/aws-glue";
import * as iam from "aws-cdk-lib/aws-iam";
import * as s3 from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";

interface PrestoView {
  readonly originalSql: string;
  readonly catalog: "awsdatacatalog";
  readonly schema: string;
  readonly columns: { readonly name: string; readonly type: string }[];
  readonly owner: string;
  readonly runAsInvoker: false;
  readonly properties: {};
}

/**
 * ViewProps
 */
export interface ViewProps {
  /**
   * The view name.
   * @default - generated by CDK
   */
  readonly viewName?: string;
  /**
   * Query string that source of View.
   * @example `SELECT orderkey, orderstatus, totalprice / 4 AS quarter FROM orders;`
   */
  readonly queryString: string;
  /**
   * Glue database where the view will be created.
   */
  readonly database: glue.IDatabase;
  /**
   * Columns of a view.
   */
  readonly columns: glue.Column[];
}

/**
 * Athena View. It's actually Glue Table.
 */
export class View extends Construct {
  /**
   * ARN of this view.
   *
   * @attribute
   */
  readonly viewArn: string;
  /**
   * Name of this view.
   *
   * @attribute
   */
  readonly viewName: string;
  private readonly _resource: glue.Table;
  constructor(scope: Construct, id: string, props: ViewProps) {
    super(scope, id);
    this._resource = new glue.Table(this, "Resource", {
      tableName: props.viewName,
      columns: props.columns,
      database: props.database,
      bucket: s3.Bucket.fromBucketName(this, "DummyBucket", "dummybucket"),
      dataFormat: new glue.DataFormat({
        inputFormat: new glue.InputFormat(""),
        outputFormat: new glue.InputFormat(""),
        serializationLibrary: new glue.SerializationLibrary(""),
      }),
    });
    this.viewArn = this._resource.tableArn;
    this.viewName = this._resource.tableName;

    this._resource.node.tryRemoveChild("DummyBucket");
    const cfnViewTable = this._resource.node.defaultChild as CfnTable;
    cfnViewTable.addPropertyOverride(
      "TableInput.StorageDescriptor.Location",
      "",
    );
    cfnViewTable.addPropertyDeletionOverride(
      "TableInput.StorageDescriptor.SerdeInfo.SerializationLibrary",
    );
    cfnViewTable.addPropertyOverride("TableInput.Parameters.presto_view", true);
    cfnViewTable.addPropertyOverride("TableInput.TableType", "VIRTUAL_VIEW");
    cfnViewTable.addPropertyOverride(
      "TableInput.ViewExpandedText",
      "/* Presto View */",
    );
    cfnViewTable.addPropertyOverride(
      "TableInput.ViewOriginalText",
      `/* Presto View: ${Fn.base64(
        JSON.stringify({
          originalSql: props.queryString,
          catalog: "awsdatacatalog",
          owner: Stack.of(this).account,
          columns: props.columns.map((column) => ({
            name: column.name,
            type:
              column.type.inputString === glue.Schema.STRING.inputString
                ? "varchar"
                : column.type.inputString,
          })),
          runAsInvoker: false,
          properties: {},
          schema: props.database.databaseName,
        } satisfies PrestoView),
      )} */`,
    );
  }
  grant(grantee: iam.IGrantable, actions: string[]) {
    return this._resource.grant(grantee, actions);
  }
  grantToUnderlyingResources(grantee: iam.IGrantable, actions: string[]) {
    return this._resource.grantToUnderlyingResources(grantee, actions);
  }
  grantRead(grantee: iam.IGrantable) {
    return this._resource.grantRead(grantee);
  }
  grantWrite(grantee: iam.IGrantable) {
    return this._resource.grantWrite(grantee);
  }
  grantReadWrite(grantee: iam.IGrantable) {
    return this._resource.grantReadWrite(grantee);
  }
}
