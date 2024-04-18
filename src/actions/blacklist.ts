import authenticatedRequest from "../utils/authenticatedRequest";

export default async function Blacklist(shiggy: string) {
  try {
    await authenticatedRequest("/api/v0/blacklist", "POST", {
      id: shiggy,
    });
    return true;
  } catch (e) {
    return false;
  }
}
