
async function getLogin(req, res, next) {
    res.render('forms/login');
};

async function getRegister(req, res, next) {
    res.render('forms/register');
};

module.exports = { getLogin, getRegister };

