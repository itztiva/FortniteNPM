import Fortnite from "../src";

export const fortnite = new Fortnite();

(async () => {
    const code = 'ce2d8a247288425098508cde7ae9220e';

    try {
        const authData = await fortnite.login(code);
        console.log('logged in:', authData);
    } catch (error) {
        console.error('Login failed:', error);
    }
})();
