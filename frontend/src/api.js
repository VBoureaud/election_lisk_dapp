const { apiClient } = require('@liskhq/lisk-client');
const RPC_ENDPOINT = 'ws://localhost:8080/ws';

let clientCache;

export const getClient = async () => {
    try {
        if (!clientCache) {
            clientCache = await apiClient.createWSClient(RPC_ENDPOINT);
        }
    } catch (error) {
        console.log({ error });
    }
    return clientCache;
};

export const fetchCandidateCounter = async () => {
    const client = await getClient();
    if (client) {
        const res = await client.invoke('election:totalCandidates');
        return res && res.candidateCounter ? res.candidateCounter : 0;
    }
    return false;
};
export const fetchVoteCounter = async () => {
    const client = await getClient();
    if (client) {
        const res = await client.invoke('election:totalVotes');
        return res && res.voteCounter ? res.voteCounter : 0;
    }
    return false;
};
export const fetchElection = async () => {
    const client = await getClient();
    if (client) {
        const res = await client.invoke('election:election');
        return res;
    }
    return false;
};
