const {
  readFileSync,
  writeFileSync,
} = require('fs');
const { resolve } = require('path');
const c = require('picocolors');
const prompts = require('prompts');
const execa = require('execa');
const semver = require('semver');
const packageJson = require('../package.json');

const { version: currentVersion } = packageJson;
const {
  inc, valid,
} = semver;

const versionIncrements = ['patch', 'minor', 'major'];

const incrementCurrentVersion = (versionType) => inc(currentVersion, versionType);
const run = (bin, args, opts = {}) =>
  execa(bin, args, {
    stdio: 'inherit',
    ...opts,
  });
const step = (message) => console.log(c.cyan(`\n${message}`));

const updatePackageVersion = (newVersion) => {
  const getJsonPath = (filename) => resolve(resolve(__dirname, '..'), filename);

  const readJson = (filename) => {
    return JSON.parse(readFileSync(getJsonPath(filename), 'utf-8'));
  };

  const writeJson = (filename, data) => {
    writeFileSync(getJsonPath(filename), JSON.stringify(data, null, 2) + '\n');
  };

  const packageJson = readJson('package.json');
  const packageLockJson = readJson('package-lock.json');

  packageJson.version = newVersion;
  packageLockJson.version = newVersion;
  packageLockJson.packages[''].version = newVersion;

  writeJson('package.json', packageJson);
  writeJson('package-lock.json', packageLockJson);
};

async function main() {
  let targetVersion;

  const versions = versionIncrements
    .map((versionType) => `${versionType} (${incrementCurrentVersion(versionType)})`)
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

  // Update the package version.
  step('Updating the package version...');
  updatePackageVersion(targetVersion);

  // Generate the changelog.
  step('Generating the changelog...');
  await run('npm', ['run', 'changelog']);

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
  await run('git', ['add', 'CHANGELOG.md', 'package.json', 'package-lock.json']);
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

main().catch((err) => console.error(err));
