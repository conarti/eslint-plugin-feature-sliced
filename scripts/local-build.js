const path = require('path');
const prompts = require('prompts');
const c = require('picocolors');
const execa = require('execa');
const packageJson = require('../package.json');

/**
 * @description
 * Use this script if you want to test package in your local project.
 * This script compiles the files as they will be published via 'npm publish'
 * and copies them into the project's node_modules.
 * The package name will be taken from package.json (corresponds to the name as when published to npm).
 * Double-check the path to your local project
 * because the script uses 'rm -rf' to remove an already installed package with the same name.
 */

const run = (bin, args, opts = {}) =>
  execa(bin, args, {
    stdio: 'inherit',
    ...opts,
  });

const step = (message) => console.log(c.cyan(`\n${message}`));

const createDir = async (dirname) => {
  await run('mkdir', [dirname]);
};

const copy = async (from, to) => {
  const isRunningOnWin = process.platform === 'win32';

  if (isRunningOnWin) {
    await run('xcopy', ['/e', '/k', '/h', '/i', from, to]);
  } else {
    await run('cp', ['-a', from, to]);
  }
};

const deleteFiles = async (path) => {
  await run('rimraf', [path]);
};

const cleanCompiledFiles = async (buildDir, packedPackageFileName) => {
  step('Clean compiled files...');

  await deleteFiles(packedPackageFileName);
  await deleteFiles(buildDir);
};

const build = async (buildDir, packedPackageFileName) => {
  step('Compiling package...');

  await run('npm', ['run', 'build']);
  await run('npm', ['pack']);
  await createDir(buildDir);
  await run('tar', ['-xzf', packedPackageFileName, '-C', buildDir, '--strip-components', '1']);
};

const moveToProject = async (destinationDir, buildDir) => {
  step('Move compiled package to project...');

  await deleteFiles(destinationDir);
  await createDir(destinationDir);
  await copy(buildDir, destinationDir);
};

const getCompilationInfo = async () => {
  const packageName = packageJson.name;
  const packageVersion = packageJson.version;
  const packedPackageFileName = `${packageName}-${packageVersion}.tgz`;
  const buildDir = packageName;

  const targetProjectRoot = (
    await prompts({
      type: 'text',
      name: 'root',
      message: 'Input project root with node_modules',
    })
  ).root;

  const destinationDir = path.join(targetProjectRoot, 'node_modules', packageName);

  return {
    packedPackageFileName,
    buildDir,
    destinationDir,
  };
};

async function main() {
  const {
    packedPackageFileName,
    buildDir,
    destinationDir,
  } = await getCompilationInfo();

  await build(buildDir, packedPackageFileName);

  await moveToProject(destinationDir, buildDir);

  await cleanCompiledFiles(buildDir, packedPackageFileName);

  step(`Done. Compiled package and move it to "${destinationDir}"`);
}

main().catch(console.error);
