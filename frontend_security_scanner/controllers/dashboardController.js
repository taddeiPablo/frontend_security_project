//const { supabase } = require("../lib/services/supabase");
const { lists_of_scans, getProfile } = require('../lib/supabaseActions');

async function LoadProfileData(request, userId){
    var profile_data = {};
    if(!request.cookies.cookieDataInfo){
        profile_data = await getProfile(userId);
    }else{
        profile_data = JSON.parse(request.cookies.cookieDataInfo).profile;
    }
    return profile_data;
};
async function getDashboard(req, res, next) {
    try {
        const cookieData = {};
        // El ID viene del token que decodificamos en el middleware (res.locals.user)
        const userId = res.locals.user.id;
        const profile = await LoadProfileData(req, userId);
        res.locals.profile = profile; // Guardamos el perfil en res.locals para usarlo en la vista
        cookieData.profile = profile;
        cookieData.user = res.locals.user;
        res.cookie('cookieDataInfo', JSON.stringify(cookieData), { maxAge: 24 * 60 * 60 * 1000 });
        res.render('dashboard/scan');
    } catch (error) {
        console.error('Error en el servidor:', error);
        res.redirect('/users/login');
    }
};
async function getListScan(req, res, next) {
    try {
        //TODO : REALIZAR LO MISMO QUE EN GETDASHBOARD ACA YA QUE TIENE LA MISMA LOGICA
        const cookieData = {};
        var profile = {};
        //const userId = res.locals.user.id;
        // El ID viene del token que decodificamos en el middleware (res.locals.user)
        const userId = res.locals.user.id;
        profile = await LoadProfileData(req, userId);
        const scans = await lists_of_scans(userId);
        res.locals.profile = profile;
        cookieData.profile = profile;
        cookieData.user = res.locals.user;
        res.cookie('cookieDataInfo', JSON.stringify(cookieData), { maxAge: 24 * 60 * 60 * 1000 });
        res.render('dashboard/lists', { scans });
    } catch (error) {
        console.error('Error recuperando escaneos:', error.message);
        res.render('dashboard/lists', { scans: [] });
    }
};
async function getPlans(req, res, next) {
    //TODO : REALIZAR LO MISMO QUE EN GETDASHBOARD ACA YA QUE TIENE LA MISMA LOGICA
    const cookieData = {};
    //const userId = res.locals.user.id;
    // El ID viene del token que decodificamos en el middleware (res.locals.user)
    const userId = res.locals.user.id;
    profile = await LoadProfileData(req, userId);
    res.locals.profile = profile;
    cookieData.profile = profile;
    cookieData.user = res.locals.user;
    res.cookie('cookieDataInfo', JSON.stringify(cookieData), { maxAge: 24 * 60 * 60 * 1000 });

    res.render('dashboard/plans');
};

module.exports = { getDashboard, getListScan, getPlans };