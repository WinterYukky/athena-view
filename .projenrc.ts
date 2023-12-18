import { awscdk } from "projen";
import { JobPermission } from "projen/lib/github/workflows-model";
import { ReleaseTrigger } from "projen/lib/release";
const cdkVersion = "2.115.0";
const project = new awscdk.AwsCdkConstructLibrary({
  releaseTrigger: ReleaseTrigger.manual({
    gitPushCommand: "",
    changelog: false,
  }),
  author: "WinterYukky",
  authorAddress: "49480575+WinterYukky@users.noreply.github.com",
  cdkVersion,
  defaultReleaseBranch: "main",
  jsiiVersion: "~5.0.0",
  name: "athena-view",
  keywords: ["athena", "view"],
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

// Integ test
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

// release
const releaseDrafter = project.github?.addWorkflow("release-drafter");
releaseDrafter?.on({
  push: {
    branches: ["main"],
  },
  pullRequest: {
    types: ["opened", "reopened", "synchronize"],
  },
});
releaseDrafter?.addJobs({
  update_release_draft: {
    runsOn: ["ubuntu-latest"],
    permissions: {
      contents: JobPermission.WRITE,
      pullRequests: JobPermission.WRITE,
    },
    steps: [
      {
        name: "Create release",
        id: "create-release",
        uses: "release-drafter/release-drafter@v5",
        env: {
          GITHUB_TOKEN: "${{ secrets.GITHUB_TOKEN }}",
        },
      },
    ],
  },
});
const release = project.github?.addWorkflow("release");
release?.on({
  release: {
    types: ["released"],
  },
});
release?.addJobs({
  release: {
    runsOn: ["ubuntu-latest"],
    permissions: {
      contents: JobPermission.WRITE,
    },
    outputs: {
      latest_commit: {
        stepId: "git_remote",
        outputName: "latest_commit",
      },
    },
    env: {
      CI: "true",
      RELEASE_VERSION: "${{ github.ref_name }}",
    },
    steps: [
      {
        id: "package_version",
        run: `echo "package_version=$RELEASE_VERSION" | sed 's/=v/=/' >> $GITHUB_OUTPUT`,
      },
      {
        name: "Checkout",
        uses: "actions/checkout@v3",
        with: {
          "fetch-depth": 0,
        },
      },
      {
        name: "Set git identity",
        run: 'git config user.name "github-actions"\ngit config user.email "github-actions@github.com"',
      },
      {
        name: "Setup Node.js",
        uses: "actions/setup-node@v3",
        with: {
          "node-version": "18.x",
        },
      },
      {
        name: "Install dependencies",
        run: "yarn install --check-files --frozen-lockfile",
      },
      {
        name: "Remove dist",
        run: "rm -fr dist",
      },
      {
        name: "bump",
        run: 'sed -i "s/\\"version\\": \\"0.0.0\\"/\\"version\\": \\"${PACKAGE_VERSION}\\"/" package.json',
        env: {
          PACKAGE_VERSION:
            "${{ steps.package_version.outputs.package_version }}",
        },
      },
      {
        name: "build",
        run: "npx projen build",
      },
      // {
      //   name: "unbump",
      //   run: 'sed -i "s/\\"version\\": \\"${PACKAGE_VERSION}\\"/\\"version\\": \\"0.0.0\\"/" package.json',
      //   env: {
      //     PACKAGE_VERSION:
      //       "${{ steps.package_version.outputs.package_version }}",
      //   },
      // },
      {
        name: "Check for new commits",
        id: "git_remote",
        run: 'echo "latest_commit=$(git ls-remote origin -h ${{ github.ref }} | cut -f1)" >> $GITHUB_OUTPUT',
      },
      {
        name: "Backup artifact permissions",
        if: "${{ steps.git_remote.outputs.latest_commit == github.sha }}",
        run: "cd dist && getfacl -R . > permissions-backup.acl",
        continueOnError: true,
      },
      {
        name: "Upload artifact",
        if: "${{ steps.git_remote.outputs.latest_commit == github.sha }}",
        uses: "actions/upload-artifact@v3",
        with: {
          name: "build-artifact",
          path: "dist",
        },
      },
    ],
  },
  release_npm: {
    name: "Publish to npm",
    needs: ["release"],
    runsOn: ["ubuntu-latest"],
    permissions: {
      contents: JobPermission.READ,
    },
    if: "needs.release.outputs.latest_commit == github.sha",
    steps: [
      {
        uses: "actions/setup-node@v3",
        with: {
          "node-version": "18.x",
        },
      },
      {
        name: "Download build artifacts",
        uses: "actions/download-artifact@v3",
        with: {
          name: "build-artifact",
          path: "dist",
        },
      },
      {
        name: "Restore build artifact permissions",
        run: "cd dist && setfacl --restore=permissions-backup.acl",
        continueOnError: true,
      },
      {
        name: "Prepare Repository",
        run: "mv dist .repo",
      },
      {
        name: "Install Dependencies",
        run: "cd .repo && yarn install --check-files --frozen-lockfile",
      },
      {
        name: "Create js artifact",
        run: "cd .repo && npx projen package:js",
      },
      {
        name: "Collect js Artifact",
        run: "mv .repo/dist dist",
      },
      {
        name: "Release",
        env: {
          NPM_DIST_TAG: "latest",
          NPM_REGISTRY: "registry.npmjs.org",
          NPM_TOKEN: "${{ secrets.NPM_TOKEN }}",
        },
        run: "npx -p publib@latest publib-npm",
      },
    ],
  },
});
project.synth();
