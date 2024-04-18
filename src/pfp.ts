import bot from ".";
import { BASE_API } from "./constants";

export default async function changePfp(): Promise<boolean> {
  try {
    await bot.user?.setAvatar(`${BASE_API}/api/v3/random`);
    return true;
  } catch (e) {
    return false;
  }
}
