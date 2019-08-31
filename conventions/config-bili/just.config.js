/* eslint-disable @typescript-eslint/no-var-requires  */
const {
  task,
  prettierTask,
  eslintTask,
  jestTask,
  resolveCwd,
  option,
  argv,
  defaultCleanPaths,
  cleanTask,
} = require('just-scripts');

/**
 * This replicates pretty much just-scripts at src/task-presets/lib.ts
 *
 * But we want to bring in:
 * - @microsoft/eslint-config-scalable-ts
 * - our own prettier config
 * - our own jest config
 */

/**
 * Notice the following CLI flags ONLY WORK if we call them directly
 * `npx just-scripts test --snapshots`, not when we use `rushx test --snapshots`,
 * nor when we do globally `rush test --snapshots`.
 * Gota figure why. @TODO
 */

option('snapshots');
option('fix');

const eslintTaskOptions = {
  // No need to put a global one, each project could have only flags to toggle off
  // configPath: resolveCwd('./node_modules/@microsoft/eslint-config-scalable-ts'),
  // configPath: resolveCwd(
  //   './node_modules/@frontend-bindings/conventions-config-eslint/typescript',
  // ),
  ignorePath: resolveCwd(
    './node_modules/@frontend-bindings/conventions-config-eslint/.eslintignore',
  ),
  fix: argv().fix ? true : false,
};
task('lint', eslintTask(eslintTaskOptions));

const jestTaskOptions = {
  runInBand: true,
  config: resolveCwd('./jest.config'),
  /**
   * To update snapshots, you can't use `rushx test --snapshots`, but rather
   * use `rush test --snapshots` and all package snapshots will be updated.
   * That is because rushx runner does not pass argv.
   * Alternatively, you can use `rushx test:snapshots`.
   */
  updateSnapshot: argv().snapshots ? true : false,
  _: ['--detectOpenHandles'],
};
task('test', jestTask(jestTaskOptions));

const prettierTaskOptions = {
  ignorePath: resolveCwd(
    './node_modules/@frontend-bindings/conventions-config-prettier/.prettierignore',
  ),
};
task('fix', prettierTask(prettierTaskOptions));

task('clean', cleanTask([...defaultCleanPaths(), '.rpt2_cache']));