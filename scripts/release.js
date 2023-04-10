const {
  readFileSync,
  writeFileSync,
} = require('fs');
const { resolve } = require('path');
const c = require('picocolors');
const prompts = require('prompts');
const execa = require('execa');
const semver = require('semver');
const pkg = require('../package.json');

const { version: currentVersion } = pkg;
const {
  inc: _inc, valid,
} = semver;

const versionIncrements = ['patch', 'minor', 'major'];

const tags = ['latest', 'next'];

const inc = (i) => _inc(currentVersion, i);
const run = (bin, args, opts = {}) =>
  execa(bin, args, {
    stdio: 'inherit',
    ...opts,
  });
const step = (msg) => console.log(c.cyan(`\n${msg}`));

async function main() {
  let targetVersion;

  const versions = versionIncrements
    .map((i) => `${i} (${inc(i)})`)
    .concat(['custom']);

  const { release } = await prompts({
    type: 'select',
    name: 'release',
    message: 'Select release type',
    choices: versions,
  });

  const isSelectedCustom = release === 3;

  if (isSelectedCustom) {
    targetVersion = (
      await prompts({
        type: 'text',
        name: 'version',
        message: 'Input custom version',
        initial: currentVersion,
      })
    ).version;
  } else {
    targetVersion = versions[release].match(/\((.*)\)/)[1];
  }

  if (!valid(targetVersion)) {
    throw new Error(`Invalid target version: ${targetVersion}`);
  }

  const { tag } = await prompts({
    type: 'select',
    name: 'tag',
    message: 'Select tag type',
    choices: tags,
  });

  const { yes: tagOk } = await prompts({
    type: 'confirm',
    name: 'yes',
    message: `Releasing v${targetVersion} on ${tags[tag]}. Confirm?`,
  });

  if (!tagOk) {
    return;
  }

  // Update the package version.
  step('Updating the package version...');
  await updatePackage(targetVersion);

  // Generate the changelog.
  step('Generating the changelog...');
  await run('npm', ['run', 'changelog']);
  await run('npx', ['prettier', '--write', 'CHANGELOG.md']);

  const { yes: changelogOk } = await prompts({
    type: 'confirm',
    name: 'yes',
    message: `Changelog generated. Does it look good?`,
  });

  if (!changelogOk) {
    return;
  }

  // Commit changes to the Git and create a tag.
  step('Committing changes...');
  await run('git', ['add', 'CHANGELOG.md', 'package.json']);
  await run('git', ['commit', '-m', targetVersion]);
  await run('git', ['tag', `v${targetVersion}`]);

  // Publish the package.
  step('Publishing the package...');
  await run('npm', ['publish']);

  // Push to GitHub.
  step('Pushing to GitHub...');
  await run('git', ['push', 'origin', `refs/tags/v${targetVersion}`]);
  await run('git', ['push']);
}

async function updatePackage(version) {
  const pkgPath = resolve(resolve(__dirname, '..'), 'package.json');
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));

  pkg.version = version;

  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
  await run('npm', ['i']);
}

main().catch((err) => console.error(err));
