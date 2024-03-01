import { init, fetchQuery } from "@airstack/node";

export interface LensProfile {
    dappName: string;
    profileTokenId: string;
    profileName: string;
}

export async function fetchLensProfile(walletAddress: string): Promise<string> {
    if (typeof process.env.AIRSTACK_API_KEY !== 'string') {
        throw new Error('AIRSTACK_API_KEY is not set.');
    }
    init(process.env.AIRSTACK_API_KEY);

     const query = `
        query MyQuery {
            Socials(
                input: {
                    filter: {
                        userAssociatedAddresses: {_eq: "${walletAddress}"},
                        dappName: {_eq: "lens"}
                    },
                    blockchain: ethereum
                }
            ) {
                Social {
                    dappName
                    profileTokenId
                    profileName
                }
            }
        }
    `;

    try {
        const { data, error } = await fetchQuery(query);

        if (error) {
            console.error("Error:", error);
            throw new Error('Failed to fetch Lens profile');
        }

        const profiles: LensProfile[] = data.Socials.Social.map((profile: LensProfile) => ({
            dappName: profile.dappName,
            profileTokenId: profile.profileTokenId,
            profileName: profile.profileName,
        }));

        console.log("Fetched profiles:", profiles);

        return profiles[0].profileTokenId;
    } catch (error) {
        console.error('Error fetching Lens profile:', error);
        throw error;
    }
}
