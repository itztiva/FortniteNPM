import { Fortnite } from "../src";

export const fortnite = new Fortnite();

const code = 'authorizationcode'; // get from <https://www.epicgames.com/id/api/redirect?clientId=3f69e56c7649492c8cc29f1af08a8a12&responseType=code>

(async () => {
    try {
        const data = await fortnite.login(code);
        console.log('logged in:', data);
        const athena = await fortnite.getProfile();
        await Bun.write('profile.json', JSON.stringify(athena, null, 2));
    } catch (error) {
        console.error('login failed:', error);
    }
})();
