import { supabase } from "../view/lib/supabase";
import { logInfo, logError } from "../utils/logger";

export const UploadImageModel = {
  async uploadAvatar(userId, localUri) {
    try {
      const folder = userId; // debe ser el auth.uid()
      const fileName = `${Date.now()}.jpg`;
      const path = `${folder}/${fileName}`;

      logInfo("[IMAGE] Subiendo avatar a Supabase vía REST:", path);

      let formData = new FormData();
      formData.append("file", {
        uri: localUri,
        name: fileName,
        type: "image/jpeg",
      });

      const { data, error } = await supabase.storage
        .from("avatars")
        .upload(path, formData, {   // <= AQUÍ EL FIX 🔥
          contentType: "image/jpeg",
          upsert: true,
        });

      if (error) {
        logError("[IMAGE] Error subiendo avatar vía REST", error);
        throw error;
      }

      const { data: publicUrl } = supabase.storage
        .from("avatars")
        .getPublicUrl(path);

      logInfo("[IMAGE] URL pública generada:", publicUrl.publicUrl);

      return publicUrl.publicUrl;

    } catch (err) {
      logError("[IMAGE] Error general en uploadAvatar() via REST", err);
      throw err;
    }
  },
};
