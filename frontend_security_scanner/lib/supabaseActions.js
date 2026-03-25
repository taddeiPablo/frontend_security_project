const { supabase } = require("./services/supabase");


const lists_of_scans = async (user_id) => {
  const { data, error } = await supabase
    .from('scans')
    .select('id, user_id, url, score, findings, created_at')
    .eq('user_id', user_id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  
  return data;
};
const insertScan = async (userid, url, score, findings) => {
  // Suponiendo que ya tienes los resultados listos en variables
  const { data, error } = await supabase
    .from('scans')
    .insert([
      {
        user_id: userid,
        url: url,
        score: score,
        findings: findings,
        created_at: new Date().toISOString()
      }
    ])
    .select(); // Esto te devuelve el 'id' generado por Postgres
    
  if(error) throw error;

  return data; // Devuelve el resultado de la inserción, incluyendo el 'id' generado
    /*try {
        // Suponiendo que ya tienes los resultados listos en variables
        const { data, error } = await supabase
          .from('scans')
          .insert([
            {
              user_id: userid,
              url: url,
              score: score,
              findings: findings,
              created_at: new Date().toISOString()
            }
          ])
          .select(); // Esto te devuelve el 'id' generado por Postgres
        
        if (error) {
          console.error("Error guardando escaneo:", error.message);
        }
        return data; // Devuelve el resultado de la inserción, incluyendo el 'id' generado
    } catch (error) {
        console.error("Error en insertScan:", error.message);
    }*/
};
const deleteScan = async (scanId, userId) => {
  const {data, error } = await supabase
        .from('scans')
        .delete()
        .eq('id', scanId)
        .eq('user_id', userId); // Doble validación de seguridad

  if (error) throw error;

  return data; // Devuelve el resultado de la eliminación
  /*try {
    
  } catch (error) {
    console.error("Error en deleteScan:", error.message);
    return { error: "Error al eliminar el escaneo" };
  }*/
};
const showScan = async (scanId, userId) => {
  // Query para recuperar el escaneo específico
  const { data: scan, error } = await supabase
    .from('scans')
    .select('*') // Traemos todos los campos: id, url, score, findings, etc.
    .eq('id', scanId)
    .eq('user_id', userId) // Seguridad: solo el dueño puede verlo
    .single();

  if (error || !scan) throw error;
         
  return scan;
  
  /*try { 

  } catch (error) {
    console.error("Error en showScan:", error.message);
    return { error: "Error al mostrar el escaneo" };
  }*/
};
const getProfile = async (userId) => {
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('full_name, plan_type, email')
    .eq('id', userId)
    .single();
        
  if (error || !profile) throw error;

    return profile;
};

module.exports = {
  getProfile,
  insertScan,
  lists_of_scans,
  deleteScan,
  showScan
};