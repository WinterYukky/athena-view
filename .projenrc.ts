import { awscdk } from "projen";
const cdkVersion = "2.95.0";
const project = new awscdk.AwsCdkConstructLibrary({
  author: "WinterYukky",
  authorAddress: "49480575+WinterYukky@users.noreply.github.com",
  cdkVersion,
  defaultReleaseBranch: "main",
  jsiiVersion: "~5.0.0",
  name: "athena-view",
  projenrcTs: true,
  repositoryUrl: "https://github.com/WinterYukky/athena-view.git",
  prettier: true,
  deps: [
    `@aws-cdk/aws-glue-alpha@${cdkVersion}-alpha.0`,
  ] /* Runtime dependencies of this module. */,
  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  devDeps: [
    `@aws-cdk/integ-runner@${cdkVersion}-alpha.0`,
    `@aws-cdk/integ-tests-alpha@${cdkVersion}-alpha.0`,
  ] /* Build dependencies for this module. */,
  // packageName: undefined,  /* The "name" in package.json. */
});
project.addTask("integ", {
  description: "Run integ tests",
  steps: [
    {
      exec: "integ-runner",
      receiveArgs: true,
    },
  ],
});
project.testTask.exec("integ-runner");
project.synth();
