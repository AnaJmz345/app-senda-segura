import { getLocalProfileById } from "../models/BikerProfileModel";

export async function loadUserProfile(userId) {
  if (!userId) return null;

  const profile = await getLocalProfileById(userId);
  return profile; // si existe lo mandamos al View
}
