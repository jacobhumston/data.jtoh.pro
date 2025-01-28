const fs = require('fs');
const path = require('path');
const jsonc = require('jsonc-parser');
const { Octokit } = require('@octokit/rest');

// const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const octokit = new Octokit({ auth: GITHUB_TOKEN });

const directoryPath = path.join(__dirname, '../lists');
const warningFilePath = path.join(__dirname, '../duplicate-warnings.txt');

function loadJsoncFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  return jsonc.parse(content);
}

function checkForDuplicates(jsonObject) {
  const warnings = [];
  for (const key in jsonObject) {
    if (Array.isArray(jsonObject[key])) {
      const duplicates = findDuplicates(jsonObject[key]);
      if (duplicates.length > 0) {
        warnings.push(`Duplicate entries found in array "${key}": ${duplicates.join(', ')}`);
      }
    }
  }
  return warnings;
}

function findDuplicates(array) {
  const seen = new Set();
  const duplicates = new Set();
  for (const item of array) {
    if (seen.has(item)) {
      duplicates.add(item);
    } else {
      seen.add(item);
    }
  }
  return Array.from(duplicates);
}

function logWarnings(warnings) {
  if (warnings.length > 0) {
    fs.writeFileSync(warningFilePath, warnings.join('\n'), 'utf8');
    console.warn(warnings.join('\n'));
  }
}

async function createGitHubIssue(warnings) {
  if (warnings.length > 0) {
    const issueContent = warnings.join('\n');
    await octokit.issues.create({
      owner: 'jacobhumston',
      repo: 'data.jtoh.pro',
      title: 'Duplicate Entries Found',
      body: issueContent,
      labels: ['bug'],
    });
  }
}

function main() {
  const files = fs.readdirSync(directoryPath);
  let allWarnings = [];
  files.forEach((file) => {
    if (path.extname(file) === '.jsonc') {
      const jsonObject = loadJsoncFile(path.join(directoryPath, file));
      const warnings = checkForDuplicates(jsonObject);
      if (warnings.length > 0) {
        allWarnings = allWarnings.concat(warnings.map(warning => `${file}: ${warning}`));
      }
    }
  });
  logWarnings(allWarnings);
  createGitHubIssue(allWarnings);
}

main();
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const octokit = new Octokit({ auth: GITHUB_TOKEN });

const directoryPath = path.join(__dirname, '../lists');
const warningFilePath = path.join(__dirname, '../duplicate-warnings.txt');

function loadJsoncFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  return jsonc.parse(content);
}

function checkForDuplicates(jsonObject) {
  const warnings = [];
  for (const key in jsonObject) {
    if (Array.isArray(jsonObject[key])) {
      const duplicates = findDuplicates(jsonObject[key]);
      if (duplicates.length > 0) {
        warnings.push(`Duplicate entries found in array "${key}": ${duplicates.join(', ')}`);
      }
    }
  }
  return warnings;
}

function findDuplicates(array) {
  const seen = new Set();
  const duplicates = new Set();
  for (const item of array) {
    if (seen.has(item)) {
      duplicates.add(item);
    } else {
      seen.add(item);
    }
  }
  return Array.from(duplicates);
}

function logWarnings(warnings) {
  if (warnings.length > 0) {
      title: 'Duplicate Entries Found',
      body: issueContent,
      labels: ['bug'],
    });
  }
}

function main() {
      const jsonObject = loadJsoncFile(path.join(directoryPath, file));
      const warnings = checkForDuplicates(jsonObject);
      if (warnings.length > 0) {
        allWarnings = allWarnings.concat(warnings.map(warning => `${file}: ${warning}`));
      }
    }
  });
  logWarnings(allWarnings);
  createGitHubIssue(allWarnings);
}

main();
