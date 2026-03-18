const { supabase } = require("../services/supabase");


const lists_of_scans = async (user_id) => {
  try {
      const { data, error } = await supabase
        .from('scans')
        .select('id, user_id, url, score, findings, created_at')
        .eq('user_id', user_id)
        .order('created_at', { ascending: false });

      if (error) throw error; 
      return data;
  } catch (error) {
    console.error("Error en lists_of_scans:", error.message);
    return [];
  }
};

const insertScan = async (userid, url, score, findings) => {
    try {
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
    }
};

const deleteScan = async (scanId, userId) => {
  try {
    const { error } = await supabase
        .from('scans')
        .delete()
        .eq('id', scanId)
        .eq('user_id', userId); // Doble validación de seguridad

    if (error) {
        return res.status(500).json({ error: "No se pudo borrar el escaneo" });
    }
  } catch (error) {
    console.error("Error en deleteScan:", error.message);
  }
};

module.exports = {
  insertScan,
  lists_of_scans,
  deleteScan
};