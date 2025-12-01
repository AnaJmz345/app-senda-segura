import { supabase } from "../view/lib/supabase";
import { logInfo, logError } from "../utils/logger";

export const UploadImageModel = {
  async uploadAvatar(userId, localUri) {
    try {
      const fileName = `avatars/${userId}_${Date.now()}.jpg`;

      logInfo("[IMAGE] Subiendo avatar a Supabase:", fileName);

      const response = await fetch(localUri);
      const blob = await response.blob();

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, blob, { upsert: true });

      if (uploadError) {
        logError("[IMAGE] Error subiendo avatar", uploadError);
        throw uploadError;
      }

      const { data: publicUrl } = supabase.storage
        .from("avatars")
        .getPublicUrl(fileName);

      logInfo("[IMAGE] URL pública generada:", publicUrl.publicUrl);

      return publicUrl.publicUrl;

    } catch (err) {
      logError("[IMAGE] Error general en uploadAvatar()", err);
      throw err;
    }
  }
};
