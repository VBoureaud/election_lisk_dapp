export interface ElectionModuleType {
    election: AccountSchemaType;
    address: Buffer;
}

export interface AccountSchemaType {
    voted: boolean;
}

export interface ElectionChainType {
    candidates: string[];
    voteCount: number[];
};

export interface VoteAssetType {
    name: string;
}
export interface VoteCounterType {
    voteCounter: number;
}


export interface AddCandidateAssetType {
    name: string;
}
export interface CandidateCounterType {
    candidateCounter: number;
}