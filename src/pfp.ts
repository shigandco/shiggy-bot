import bot from ".";

export default async function changePfp(): Promise<boolean> {
  try {
    await bot.user?.setAvatar("https://shiggy.fun/api/v1/random");
    return true;
  } catch (e) {
    return false;
  }
}
