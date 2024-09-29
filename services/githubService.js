require("dotenv").config();
const fs = require("fs");
const path = require("path");
const archiver = require("archiver");
const stream = require("stream");

module.exports.createRepository = async (name, description, private = false) => {
  try {
    const { Octokit } = await import("@octokit/rest");
    const octokit = new Octokit({ auth: process.env.GITHUB_ACCESS_TOKEN });
    const response = await octokit.rest.repos.createForAuthenticatedUser({
      name: name,
      description: description,
      private: private,
    });

    console.log("Repository created successfully:", response.data);
    return response.status == 201;
  } catch (error) {
    console.error("Error creating repository:", error);
    return false;
  }
};

module.exports.deleteRepo = async (repo, owner = process.env.GITHUB_USERNAME) => {
  try {
    const { Octokit } = await import("@octokit/rest");
    const octokit = new Octokit({ auth: process.env.GITHUB_ACCESS_TOKEN });
    await octokit.rest.repos.delete({
      owner,
      repo,
    });
    console.log(`Repository ${owner}/${repo} has been deleted.`);
    return true;
  } catch (error) {
    console.error(`Failed to delete repository: ${error.message}`);
    return false;
  }
};

module.exports.listRepos = async (owner = process.env.GITHUB_USERNAME) => {
  try {
    const { Octokit } = await import("@octokit/rest");
    const octokit = new Octokit({ auth: process.env.GITHUB_ACCESS_TOKEN });

    const response = await octokit.rest.repos.listForUser({
      username: owner,
    });

    return response.data.map((repo) => ({
      name: repo.name,
      owner: repo.owner.login,
      html_url: repo.html_url,
      full_name: repo.full_name,
      description: repo.description,
      created_at: repo.created_at,
      size: repo.size,
    }));
  } catch (error) {
    console.error(`Failed to list repositories: ${error.message}`);
    return false;
  }
};

module.exports.downloadRepoAsZip = async (repo, owner = process.env.GITHUB_USERNAME) => {
  try {
    const { Octokit } = await import("@octokit/rest");
    const octokit = new Octokit({ auth: process.env.GITHUB_ACCESS_TOKEN });

    const response = await octokit.rest.repos.downloadZipballArchive({
      owner,
      repo,
    });

    const filePath = path.join(__dirname, `${repo}.zip`);
    fs.writeFileSync(filePath, Buffer.from(response.data));
    console.log(`Repository ${repo} downloaded as a ZIP file.`);

    return filePath;
  } catch (error) {
    console.error(`Failed to download repository: ${error.message}`);
    return false;
  }
};

module.exports.getRepo = async (repo, owner = process.env.GITHUB_USERNAME) => {
  const { Octokit } = await import("@octokit/rest");
  const octokit = new Octokit({ auth: process.env.GITHUB_ACCESS_TOKEN });

  try {
    const res = await octokit.rest.repos.get({
      owner,
      repo,
    });

    return res.data ? true : false;
  } catch (error) {
    console.error(`Failed to list repository: ${error.message}`);
    return false;
  }
};

module.exports.downloadMultipleReposAsZip = async (repoNames, owner = process.env.GITHUB_USERNAME) => {
  try {
    const { Octokit } = await import("@octokit/rest");
    const octokit = new Octokit({ auth: process.env.GITHUB_ACCESS_TOKEN });

    // Create a ZIP file
    const zipFilePath = path.join(__dirname, "repositories.zip");
    const output = fs.createWriteStream(zipFilePath);
    const archive = archiver("zip", { zlib: { level: 9 } });

    archive.pipe(output);

    // Add each repository to the ZIP file
    for (const repo of repoNames) {
      const response = await octokit.rest.repos.downloadZipballArchive({
        owner,
        repo,
      });

      // Create a readable stream from the response data
      const bufferStream = new stream.PassThrough();
      bufferStream.end(Buffer.from(response.data));

      // Append the stream to the archive
      archive.append(bufferStream, { name: `${repo}.zip` });
    }

    await archive.finalize();

    console.log(`Repositories zipped into ${zipFilePath}`);

    return zipFilePath;
  } catch (error) {
    console.error(`Failed to download and zip repositories: ${error.message}`);
    return false;
  }
};

module.exports.listReposByTag = async (tag, owner = process.env.GITHUB_USERNAME) => {
  const { Octokit } = await import("@octokit/rest");
  const octokit = new Octokit({ auth: process.env.GITHUB_ACCESS_TOKEN });

  try {
    // Search repositories based on the tag (topic)
    const response = await octokit.search.repos({
      q: `user:${owner} topic:${tag}`,
    });

    return response.data?.items?.map((repo) => ({
      name: repo.name,
      owner: repo.owner.login,
      html_url: repo.html_url,
      full_name: repo.full_name,
      description: repo.description,
      created_at: repo.created_at,
      size: repo.size,
    }));
  } catch (error) {
    console.error(`Failed to list repository: ${error.message}`);
    return false;
  }
};

module.exports.listReposByFileName = async (tag, owner = process.env.GITHUB_USERNAME) => {
  const { Octokit } = await import("@octokit/rest");
  const octokit = new Octokit({ auth: process.env.GITHUB_ACCESS_TOKEN });

  try {
    // Search repositories based on the tag (topic)
    const response = await octokit.search.code({
      q: `${filename} in:path`,
    });

    return response.data?.items?.map((repo) => ({
      name: repo.name,
      owner: repo.owner.login,
      html_url: repo.html_url,
      full_name: repo.full_name,
      description: repo.description,
      created_at: repo.created_at,
      size: repo.size,
    }));
  } catch (error) {
    console.error(`Failed to list repository: ${error.message}`);
    return false;
  }
};

module.exports.getReadmeFile = async (repo, owner = process.env.GITHUB_USERNAME) => {
  const { Octokit } = await import("@octokit/rest");
  const octokit = new Octokit({ auth: process.env.GITHUB_ACCESS_TOKEN });

  try {
    const response = await octokit.repos.getReadme({
      owner: owner,
      repo,
    });

    return atob(response.data.content);
  } catch (error) {
    console.error(`Failed to list repository: ${error.message}`);
    return false;
  }
};
