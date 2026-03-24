const { supabase } = require("../lib/services/supabase");
const jwt = require('jsonwebtoken');

function validateFormData(email, password) {
  var result = "";
  var error = false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  
  if(!email || !password){
    result = "Email y contraseña son requeridos.";
    error = true;
  }
  if (!emailRegex.test(email)) {
    result = "Formato de email inválido.";
    error = true;
  }
  if (!passwordRegex.test(password)) {
    result = "La contraseña debe tener al menos 8 caracteres, incluyendo una letra y un número.";
    error = true;
  }
  return { error, result };
}

// === Registro === //
exports.register = async (req, res) => {
  try {
      const { email, password, name } = req.body;
      const { error: validationError, result: validationMessage } = validateFormData(email, password);
      
      if (validationError) {
        return res.status(400).render('forms/register', {
          error: validationMessage
        });
      }
      // Verificar si ya existe un usuario
      const { data: existing } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      if (existing) {
        return res.status(400).render('forms/register', {
          error: "El email ya está registrado."
        });
      }
      // Crear usuario en auth.users
      const { data: user, error: signUpError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true
      });

      if (signUpError) {
        console.error(signUpError);
        return res.status(500).render('forms/register', { error: signUpError.message });
      }

      // Si llegamos acá, el usuario ya existe en Auth. 
      // Ahora creamos el perfil manualmente.
      const { error: profileError } = await supabase
        .from("profiles")
        .insert({
          id: user.user.id,
          email: email,
          full_name: name || 'Usuario', // Evitamos que sea null
          plan_type: 'free',
          url: '',
          subscription_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        });

        if (profileError) {
          console.error("DETALLE DEL ERROR DE PERFIL:", profileError);
          return res.status(500).json({ error: profileError.message });
        }

      return res.redirect('/users/Login');

    } catch (err) {
      console.error(err);
      return res.status(500).render('/', { error: "Error interno." });
    }
};

// === Login === //
exports.login = async (req, res) => {
  try {
      const { email, password } = req.body;
      const { error: validationError, result: validationMessage } = validateFormData(email, password);
      
      if (validationError) {
        return res.status(400).render('forms/login', {
          error: validationMessage,
          oldEmail: email
        });
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error || !data?.user) {
        return res.render('forms/login', {
            title: 'Login',
            error: 'El correo o la contraseña son incorrectos.', // Mensaje amigable
            oldEmail: email // Opcional: para no borrarle el email que ya escribió
        });
      }

      const token = jwt.sign(
        { 
          id: data.user.id,
          email: data.user.email
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      res.cookie("auth_token", token, {
        httpOnly: true,
        secure: false,
        maxAge: 24 * 60 * 60 * 1000
      });

      return res.redirect('/dashboard');

    } catch (err) {
      console.error(err);
      return res.status(500).render('forms/login', {
        error: "Error interno."
      });
    }
};

// === Logout === //
exports.logout = async (req, res) => {
  try {
      await supabase.auth.signOut();
      res.clearCookie("auth_token");
      res.clearCookie("cookieDataInfo");
      res.redirect("/"); 
  } catch (error) {
      console.error('Error al cerrar sesión:', error);
      res.redirect('/dashboard');
  }
};