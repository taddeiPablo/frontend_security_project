const { supabase } = require("../services/supabase");
const jwt = require('jsonwebtoken');

// === Registro === //
exports.register = async (req, res) => {
  try {
      const { email, password, name } = req.body;

      if (!email || !password) {
        return res.status(400).render('register', {
          error: "Email y contraseña son requeridos."
        });
      }
      // Verificar si ya existe un usuario
      const { data: existing } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      if (existing) {
        return res.status(400).render('register', {
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
        return res.status(500).render('register', { error: signUpError.message });
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
      return res.status(500).render('register', { error: "Error interno." });
    }
};

// === Login === //
exports.login = async (req, res) => {
  try {
      const { email, password } = req.body;

      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error || !data?.user) {
        console.log("ingreso aqui");
        return res.status(401).render('login', {
          error: "Credenciales inválidas."
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

      return res.redirect('/users/dashboard');

    } catch (err) {
      console.error(err);
      return res.status(500).render('login', {
        error: "Error interno."
      });
    }
};

// === Logout === //
exports.logout = async (req, res) => {
  res.clearCookie("auth_token");
  res.redirect("/");
};