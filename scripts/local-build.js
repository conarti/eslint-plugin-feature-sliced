const prompts = require('prompts');
const c = require('picocolors');
const execa = require('execa');
const packageJson = require('../package.json');
const path = require('path');

const run = (bin, args, opts = {}) =>
  execa(bin, args, {
    stdio: 'inherit',
    ...opts,
  });

const step = (message) => console.log(c.cyan(`\n${message}`));

async function main() {
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

  const cleanCompiledFiles = async () => {
    await run('rm', [packedPackageFileName]);
    await run('rm', ['-rf', buildDir]);
  };

  step('Compiling package...');
  await run('npm', ['pack']);
  await run('mkdir', [buildDir]);
  await run('tar', ['-xzf', packedPackageFileName, '-C', buildDir, '--strip-components', '1']);

  step('Move compiled package to project...');
  await run('rm', ['-rf', destinationDir]);
  await run('mkdir', ['-p', destinationDir]);
  await run('cp', ['-a', `./${buildDir}/`, destinationDir]);

  step('Clean compiled files...');
  await cleanCompiledFiles();

  step(`Done. Compiled package and move it to "${destinationDir}"`);
}

main().catch(console.error);
