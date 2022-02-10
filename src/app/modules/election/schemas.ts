export const accountSchema = {
    $id: 'lisk/election/account',
    type: 'object',
    properties: {
        voted: {
            fieldNumber: 1,
            dataType: 'boolean',
        },
    },
    default: {
        voted: false,
    },
};

export const CHAIN_STATE_ELECTION = "election:election";
export const electionSchema = {
    $id: 'lisk/election/election',
	type: 'object',
    properties: {
        candidates: {
			type: 'array',
			fieldNumber: 1,
			items: {
				dataType: 'string',
			},
		},
        voteCount: {
        	type: 'array',
			fieldNumber: 2,
			items: {
				dataType: 'uint32',
			},
        },
    },
};

export const CHAIN_STATE_CANDIDATE_COUNTER = "election:candidateCounter";
export const candidateCounterSchema = {
    $id: 'lisk/election/candidateCounter',
    type: 'object',
    required: ['candidateCounter'],
    properties: {
        candidateCounter: {
            dataType: 'uint32',
            fieldNumber: 1,
        },
    },
};
export const CHAIN_STATE_VOTE_COUNTER = "election:voteCounter";
export const voteCounterSchema = {
    $id: 'lisk/election/voteCounter',
    type: 'object',
    required: ['voteCounter'],
    properties: {
        voteCounter: {
            dataType: 'uint32',
            fieldNumber: 1,
        },
    },
};

export const addCandidateAssetId = 0;
export const addCandidateAssetSchema = {
    $id: 'lisk/election/addCandidateAsset',
    title: 'AddCandidateAsset for election module',
	type: 'object',
    required: ['name'], 
    properties: {
        name: {
            dataType: 'string', 
            fieldNumber: 1, 
            minLength: 3, 
            maxLength: 64, 
        },
    }
};

export const voteAssetId = 1;
export const voteAssetSchema = {
    $id: 'lisk/election/voteAsset',
    title: 'voteAsset for election module',
    type: 'object',
    required: ['name'], 
    properties: {
        name: {
            dataType: 'string', 
            fieldNumber: 1, 
            minLength: 3, 
            maxLength: 64, 
        },
    }
};