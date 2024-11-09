export async function fetchHandled(url: string, options: RequestInit): Promise<any> {
    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            if (response.status === 400) {
                console.log(await response.json());
                throw new Error('Bad Request');
            }
            throw new Error(`Fetch Failed: ${response.statusText}`);
        }

        return await response.json();
    } catch (error: any) {
        throw new Error(`Request Error: ${error.message}`);
    }
}