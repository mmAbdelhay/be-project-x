require("dotenv").config();

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
