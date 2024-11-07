import querystring from "querystring";
import { Endpoints } from "./HTTP/Endpoints";
import { fetchHandled } from "./Utilities/fetchHandled";

export class Fortnite {
    private static readonly Basic_Header = "Basic M2Y2OWU1NmM3NjQ5NDkyYzhjYzI5ZjFhZjA4YThhMTI6YjUxZWU5Y2IxMjIzNGY1MGE2OWVmYTY3ZWY1MzgxMmU=";
    public static Bearer = "";

    constructor() { }

    public async login(authcode: string): Promise<any> {
        try {
            const formData = querystring.stringify({
                grant_type: "authorization_code",
                code: authcode,
            });

            const authTokenRes = await fetchHandled(Endpoints.OAUTH_TOKEN_CREATE, {
                method: "POST",
                headers: {
                    Authorization: Fortnite.Basic_Header,
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: formData,
            });

            const bearer = `Bearer ${authTokenRes.access_token}`;
            const accountId = authTokenRes.account_id;

            const dAuthRes = await fetchHandled(
                Endpoints.ACCOUNT_PUBLIC_DEVICEAUTH.replace("{#}", accountId),
                {
                    method: "POST",
                    headers: {
                        Authorization: bearer,
                    },
                }
            );

            const tData = querystring.stringify({
                grant_type: "device_auth",
                device_id: dAuthRes.deviceId,
                secret: dAuthRes.secret,
                account_id: dAuthRes.accountId,
            });

            const aTokenRes = await fetchHandled(Endpoints.OAUTH_TOKEN_CREATE, {
                method: "POST",
                headers: {
                    Authorization: Fortnite.Basic_Header,
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: tData,
            });

            Fortnite.Bearer = `bearer ${aTokenRes.access_token}`;

            return aTokenRes;
        } catch (error: any) {
            throw new Error(`Error in login: ${error.message}`);
        }
    }

    public async catalog(): Promise<any> {
        try {
            const res = await fetchHandled(Endpoints.BR_STORE, {
                method: "GET",
                headers: {
                    Authorization: Fortnite.Bearer,
                    "Content-Type": "application/json",
                },
            });

            return res;
        } catch (error: any) {
            throw new Error(`Error fetching today's Catalog: ${error.message}`);
        }
    }

}
