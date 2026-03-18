const { supabase } = require("../services/supabase");
const { lists_of_scans } = require('../lib/supabaseCrud');


async function getDashboard(req, res, next) {
    try {
        const cookieData = {};
        //NOTA:TODO: AQUI EVALUAR LA EXISTENCIA DE LA COOKIE Y PARA NO VOLVER A LLAMAR LA BASE DE DATOS.
        //NOTA: TODO: LUEGO EVALUAR EL ARMAR DIFERENTE EL OBJECTO USER PARA NO MOSTRAR INFO SENSIBLE EN LA COOKIE.
        console.log("datos en cookie" + JSON.stringify(req.cookies.cookieDataInfo));
        // El ID viene del token que decodificamos en el middleware (res.locals.user)
        const userId = res.locals.user.id;
        // NOTA: TODO: este bloque pasarlo a supabaseactions.js 
        // Consultamos la tabla profiles
        const { data: profile, error } = await supabase
            .from('profiles')
            .select('full_name, plan_type, email')
            .eq('id', userId)
            .single();
        
        if (error) {
            console.error('Error recuperando perfil:', error.message);
            // Si hay error, enviamos datos vacíos para que no rompa la vista
            return res.render('dashboard', { 
                title: 'Dashboard',
                profile: { full_name: 'Usuario' } 
            });
        }
        res.locals.profile = profile; // Guardamos el perfil en res.locals para usarlo en la vista
        cookieData.profile = profile;
        cookieData.user = res.locals.user;
        res.cookie('cookieDataInfo', JSON.stringify(cookieData), { maxAge: 24 * 60 * 60 * 1000 });
        res.render('dashboard/scan');
        
    } catch (error) {
        console.error('Error en el servidor:', err);
        res.redirect('/users/login');
    }
};
async function getListScan(req, res, next) {
    try {
        //TODO : REALIZAR LO MISMO QUE EN GETDASHBOARD ACA YA QUE TIENE LA MISMA LOGICA
        const cookieData = {};
        //const userId = res.locals.user.id;
        // El ID viene del token que decodificamos en el middleware (res.locals.user)
        const userId = res.locals.user.id;
        // Consultamos la tabla profiles
        const { data: profile, error } = await supabase
            .from('profiles')
            .select('full_name, plan_type, email')
            .eq('id', userId)
            .single();
        
        if (error) {
            console.error('Error recuperando perfil:', error.message);
            // Si hay error, enviamos datos vacíos para que no rompa la vista
            return res.render('dashboard', { 
                title: 'Dashboard',
                profile: { full_name: 'Usuario' } 
            });
        }
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
    // Consultamos la tabla profiles
    const { data: profile, error } = await supabase
        .from('profiles')
        .select('full_name, plan_type, email')
        .eq('id', userId)
        .single();
        
    if (error) {
        console.error('Error recuperando perfil:', error.message);
        // Si hay error, enviamos datos vacíos para que no rompa la vista
        return res.render('dashboard', { 
            title: 'Dashboard',
            profile: { full_name: 'Usuario' } 
        });
    }

    res.locals.profile = profile;
    cookieData.profile = profile;
    cookieData.user = res.locals.user;
    res.cookie('cookieDataInfo', JSON.stringify(cookieData), { maxAge: 24 * 60 * 60 * 1000 });

    res.render('dashboard/plans');
};

module.exports = { getDashboard, getListScan, getPlans };