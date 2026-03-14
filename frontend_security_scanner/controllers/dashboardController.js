const { supabase } = require("../services/supabase");


async function getDashboard(req, res, next) {
    try {
        const cookieData = {};
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

module.exports = { getDashboard };