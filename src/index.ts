import querystring from "querystring";
import { Endpoints } from "./HTTP/Endpoints";
import { fetchHandled } from "./Utilities/fetchHandled";

export class Fortnite {
    private static readonly Basic_Header = "Basic M2Y2OWU1NmM3NjQ5NDkyYzhjYzI5ZjFhZjA4YThhMTI6YjUxZWU5Y2IxMjIzNGY1MGE2OWVmYTY3ZWY1MzgxMmU=";
    public static Bearer = "";
    public static accountId = "";

    constructor(bearer?: string) {
        Fortnite.Bearer = bearer || Fortnite.Bearer;
     }

    public async login(authcode: string): Promise<any> {
        try {
            const authTokenRes = await fetchHandled(Endpoints.OAUTH_TOKEN_CREATE, {
                method: "POST",
                headers: {
                    Authorization: Fortnite.Basic_Header,
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: querystring.stringify({
                    grant_type: "authorization_code",
                    code: authcode,
                }),
            });

            const dAuthRes = await fetchHandled(
                Endpoints.ACCOUNT_PUBLIC_DEVICEAUTH.replace("{#}", authTokenRes.account_id),
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${authTokenRes.access_token}`,
                    },
                }
            );

            Fortnite.accountId = dAuthRes.accountId;

            const aTokenRes = await fetchHandled(Endpoints.OAUTH_TOKEN_CREATE, {
                method: "POST",
                headers: {
                    Authorization: Fortnite.Basic_Header,
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: querystring.stringify({
                    grant_type: "device_auth",
                    device_id: dAuthRes.deviceId,
                    secret: dAuthRes.secret,
                    account_id: dAuthRes.accountId,
                }),
            });

            Fortnite.Bearer = `bearer ${aTokenRes.access_token}`;

            return {
                username: aTokenRes.displayName,
                accountId: dAuthRes.accountId,
                bearer: `bearer ${aTokenRes.access_token}`
            };
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

    public async getProfile(): Promise<any> {
        try {
            const athena = await fetchHandled(
                `${Endpoints.MCP}/${Fortnite.accountId}/client/QueryProfile?profileId=athena`,
                {
                    method: "POST",
                    headers: {
                        Authorization: Fortnite.Bearer,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({})
                }
            );

            const common_core = await fetchHandled(
                `${Endpoints.MCP}/${Fortnite.accountId}/client/QueryProfile?profileId=common_core`,
                {
                    method: "POST",
                    headers: {
                        Authorization: Fortnite.Bearer,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({})
                }
            );

            const athenaprofile = athena.profileChanges[0].profile;
            const common_coreprofile = common_core.profileChanges[0].profile;

            const profile = {
                athena: athenaprofile,
                common_core: common_coreprofile
            }

            return profile;
        } catch (error: any) {
            throw new Error(`Error fetching profiles: ${error}`);
        }
    }
}
