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

# API Reference <a name="API Reference" id="api-reference"></a>

## Constructs <a name="Constructs" id="Constructs"></a>

### View <a name="View" id="athena-view.View"></a>

Athena View.

It's actually Glue Table.

#### Initializers <a name="Initializers" id="athena-view.View.Initializer"></a>

```typescript
import { View } from 'athena-view'

new View(scope: Construct, id: string, props: ViewProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#athena-view.View.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#athena-view.View.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#athena-view.View.Initializer.parameter.props">props</a></code> | <code><a href="#athena-view.ViewProps">ViewProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="athena-view.View.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="athena-view.View.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="athena-view.View.Initializer.parameter.props"></a>

- *Type:* <a href="#athena-view.ViewProps">ViewProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#athena-view.View.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#athena-view.View.grant">grant</a></code> | *No description.* |
| <code><a href="#athena-view.View.grantRead">grantRead</a></code> | *No description.* |
| <code><a href="#athena-view.View.grantReadWrite">grantReadWrite</a></code> | *No description.* |
| <code><a href="#athena-view.View.grantToUnderlyingResources">grantToUnderlyingResources</a></code> | *No description.* |
| <code><a href="#athena-view.View.grantWrite">grantWrite</a></code> | *No description.* |

---

##### `toString` <a name="toString" id="athena-view.View.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `grant` <a name="grant" id="athena-view.View.grant"></a>

```typescript
public grant(grantee: IGrantable, actions: string[]): Grant
```

###### `grantee`<sup>Required</sup> <a name="grantee" id="athena-view.View.grant.parameter.grantee"></a>

- *Type:* aws-cdk-lib.aws_iam.IGrantable

---

###### `actions`<sup>Required</sup> <a name="actions" id="athena-view.View.grant.parameter.actions"></a>

- *Type:* string[]

---

##### `grantRead` <a name="grantRead" id="athena-view.View.grantRead"></a>

```typescript
public grantRead(grantee: IGrantable): Grant
```

###### `grantee`<sup>Required</sup> <a name="grantee" id="athena-view.View.grantRead.parameter.grantee"></a>

- *Type:* aws-cdk-lib.aws_iam.IGrantable

---

##### `grantReadWrite` <a name="grantReadWrite" id="athena-view.View.grantReadWrite"></a>

```typescript
public grantReadWrite(grantee: IGrantable): Grant
```

###### `grantee`<sup>Required</sup> <a name="grantee" id="athena-view.View.grantReadWrite.parameter.grantee"></a>

- *Type:* aws-cdk-lib.aws_iam.IGrantable

---

##### `grantToUnderlyingResources` <a name="grantToUnderlyingResources" id="athena-view.View.grantToUnderlyingResources"></a>

```typescript
public grantToUnderlyingResources(grantee: IGrantable, actions: string[]): Grant
```

###### `grantee`<sup>Required</sup> <a name="grantee" id="athena-view.View.grantToUnderlyingResources.parameter.grantee"></a>

- *Type:* aws-cdk-lib.aws_iam.IGrantable

---

###### `actions`<sup>Required</sup> <a name="actions" id="athena-view.View.grantToUnderlyingResources.parameter.actions"></a>

- *Type:* string[]

---

##### `grantWrite` <a name="grantWrite" id="athena-view.View.grantWrite"></a>

```typescript
public grantWrite(grantee: IGrantable): Grant
```

###### `grantee`<sup>Required</sup> <a name="grantee" id="athena-view.View.grantWrite.parameter.grantee"></a>

- *Type:* aws-cdk-lib.aws_iam.IGrantable

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#athena-view.View.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="athena-view.View.isConstruct"></a>

```typescript
import { View } from 'athena-view'

View.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="athena-view.View.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#athena-view.View.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#athena-view.View.property.viewArn">viewArn</a></code> | <code>string</code> | ARN of this view. |
| <code><a href="#athena-view.View.property.viewName">viewName</a></code> | <code>string</code> | Name of this view. |

---

##### `node`<sup>Required</sup> <a name="node" id="athena-view.View.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `viewArn`<sup>Required</sup> <a name="viewArn" id="athena-view.View.property.viewArn"></a>

```typescript
public readonly viewArn: string;
```

- *Type:* string

ARN of this view.

---

##### `viewName`<sup>Required</sup> <a name="viewName" id="athena-view.View.property.viewName"></a>

```typescript
public readonly viewName: string;
```

- *Type:* string

Name of this view.

---


## Structs <a name="Structs" id="Structs"></a>

### ViewProps <a name="ViewProps" id="athena-view.ViewProps"></a>

ViewProps.

#### Initializer <a name="Initializer" id="athena-view.ViewProps.Initializer"></a>

```typescript
import { ViewProps } from 'athena-view'

const viewProps: ViewProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#athena-view.ViewProps.property.columns">columns</a></code> | <code>@aws-cdk/aws-glue-alpha.Column[]</code> | Columns of a view. |
| <code><a href="#athena-view.ViewProps.property.database">database</a></code> | <code>@aws-cdk/aws-glue-alpha.IDatabase</code> | Glue database where the view will be created. |
| <code><a href="#athena-view.ViewProps.property.queryString">queryString</a></code> | <code>string</code> | Query string that source of View. |
| <code><a href="#athena-view.ViewProps.property.viewName">viewName</a></code> | <code>string</code> | The view name. |

---

##### `columns`<sup>Required</sup> <a name="columns" id="athena-view.ViewProps.property.columns"></a>

```typescript
public readonly columns: Column[];
```

- *Type:* @aws-cdk/aws-glue-alpha.Column[]

Columns of a view.

---

##### `database`<sup>Required</sup> <a name="database" id="athena-view.ViewProps.property.database"></a>

```typescript
public readonly database: IDatabase;
```

- *Type:* @aws-cdk/aws-glue-alpha.IDatabase

Glue database where the view will be created.

---

##### `queryString`<sup>Required</sup> <a name="queryString" id="athena-view.ViewProps.property.queryString"></a>

```typescript
public readonly queryString: string;
```

- *Type:* string

Query string that source of View.

---

*Example*

```typescript
`SELECT orderkey, orderstatus, totalprice / 4 AS quarter FROM orders;`
```


##### `viewName`<sup>Optional</sup> <a name="viewName" id="athena-view.ViewProps.property.viewName"></a>

```typescript
public readonly viewName: string;
```

- *Type:* string
- *Default:* generated by CDK

The view name.

---



