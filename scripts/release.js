const {
  readFileSync,
  writeFileSync,
} = require('fs');
const { resolve } = require('path');
const execa = require('execa');
const c = require('picocolors');
const prompts = require('prompts');
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
  step('Updating the package version...');

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

const generateChangelog = async () => {
  step('Generating the changelog...');

  await run('npm', ['run', 'changelog']);

  const { yes: isChangelogOk } = await prompts({
    type: 'confirm',
    name: 'yes',
    message: 'Changelog generated. Does it look good?',
  });

  return isChangelogOk;
};

const commit = async (targetVersion) => {
  step('Committing changes...');

  await run('git', ['add', 'CHANGELOG.md', 'package.json', 'package-lock.json']);
  await run('git', ['commit', '-m', targetVersion]);
  await run('git', ['tag', `v${targetVersion}`]);
};

const publish = async () => {
  step('Publishing the package...');

  await run('npm', ['publish']);
};

const push = async (targetVersion) => {
  step('Pushing to GitHub...');

  await run('git', ['push', 'origin', `refs/tags/v${targetVersion}`]);
  await run('git', ['push']);
};

const selectVersion = async () => {
  let targetVersion;

  const versions = versionIncrements
    .map((versionType) => `${versionType} (${incrementCurrentVersion(versionType)})`)
    .concat(['custom']);

  const customVersionIndex = versions.length - 1;

  const { release } = await prompts({
    type: 'select',
    name: 'release',
    message: 'Select release type',
    choices: versions,
  });

  const isSelectedCustom = release === customVersionIndex;

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

  return targetVersion;
};

const build = async () => {
  step('Building package...');
  await run('npm', ['run', 'build']);
};

async function main() {
  const targetVersion = await selectVersion();

  await build();

  updatePackageVersion(targetVersion);

  const isChangelogOk = await generateChangelog();

  if (!isChangelogOk) {
    return;
  }

  await commit(targetVersion);

  await publish();

  await push(targetVersion);
}

main().catch((err) => console.error(err));
