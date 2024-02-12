const createProjectRules = {
    'name': "min:3|max:250|required",
    "githubUsername": "required|min:3|max:250",
    "githubEmail": "required|email|max:250",
    "haveBackend": "boolean",
    "environmentId" : "required"
};

module.exports = createProjectRules;