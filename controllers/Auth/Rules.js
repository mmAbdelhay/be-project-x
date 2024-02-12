const validationRules = {
    name: "required|min:3|max:150",
    email: "required|email",
    password: "required|min:6|max:16"
};

module.exports = validationRules;
