import { Fortnite } from "../src";

export const fortnite = new Fortnite();

const args = process.argv;

const arg = args.find(arg => arg.startsWith('-c='));

if (!arg) { 
    console.error('Please provide a code, e.g. -c=code');
    process.exit(1);
}

const code = arg.split('=')[1]; 

// const code = '1234';

(async () => {
    try {
        const data = await fortnite.login(code);
        console.log('logged in:', data);
        const shop = await fortnite.catalog();
        await Bun.write('shop.json', JSON.stringify(shop, null, 2));
    } catch (error) {
        console.error('Login failed:', error);
    }
})();
