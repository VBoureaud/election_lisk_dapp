/* eslint-disable class-methods-use-this */

import { codec } from '@liskhq/lisk-codec';
import {
    AfterBlockApplyContext,
    AfterGenesisBlockApplyContext,
    BaseModule,
    BeforeBlockApplyContext,
    TransactionApplyContext
} from 'lisk-sdk';
import { AddCandidateAsset } from "./assets/add_candidate_asset";
import { VoteAsset } from "./assets/vote_asset";
import {
    accountSchema,
    voteAssetId,
    voteAssetSchema,
    addCandidateAssetId,
    addCandidateAssetSchema,
    candidateCounterSchema,
    CHAIN_STATE_CANDIDATE_COUNTER,
    voteCounterSchema,
    CHAIN_STATE_VOTE_COUNTER,
    electionSchema,
    CHAIN_STATE_ELECTION,
} from './schemas';

import {
    AccountSchemaType
} from './types';

export class ElectionModule extends BaseModule {
    public accountSchema:AccountSchemaType = accountSchema;

    public actions = {
        totalCandidates: async () => {
          const res = await this._dataAccess.getChainState(CHAIN_STATE_CANDIDATE_COUNTER);
          const count = codec.decode(
              candidateCounterSchema,
              res
          );
          return count;
        },
        totalVotes: async () => {
          const res = await this._dataAccess.getChainState(CHAIN_STATE_VOTE_COUNTER);
          const count = codec.decode(
              voteCounterSchema,
              res
          );
          return count;
        },
        election: async () => {
          const res = await this._dataAccess.getChainState(CHAIN_STATE_ELECTION);
          const election = codec.decode(
              electionSchema,
              res
          );
          return election;
        }
    };
    public reducers = {
      // Example below
      // getBalance: async (
  		// 	params: Record<string, unknown>,
  		// 	stateStore: StateStore,
  		// ): Promise<bigint> => {
  		// 	const { address } = params;
  		// 	if (!Buffer.isBuffer(address)) {
  		// 		throw new Error('Address must be a buffer');
  		// 	}
  		// 	const account = await stateStore.account.getOrDefault<TokenAccount>(address);
  		// 	return account.token.balance;
  		// },
    };
    public name = 'election';
    public transactionAssets = [
        new AddCandidateAsset(),
        new VoteAsset()
    ];
    public events = [
        'addCandidate',
        'vote'
    ];
    public id = 1001;

    // public constructor(genesisConfig: GenesisConfig) {
    //     super(genesisConfig);
    // }

    // Lifecycle hooks
    public async beforeBlockApply(_input: BeforeBlockApplyContext) {
        // Get any data from stateStore using block info, below is an example getting a generator
        // const generatorAddress = getAddressFromPublicKey(_input.block.header.generatorPublicKey);
		// const generator = await _input.stateStore.account.get<TokenAccount>(generatorAddress);
    }

    public async afterBlockApply(_input: AfterBlockApplyContext) {
        // Get any data from stateStore using block info, below is an example getting a generator
        // const generatorAddress = getAddressFromPublicKey(_input.block.header.generatorPublicKey);
		// const generator = await _input.stateStore.account.get<TokenAccount>(generatorAddress);
    }

    public async beforeTransactionApply(_input: TransactionApplyContext) {
        // Get any data from stateStore using transaction info, below is an example
        // const sender = await _input.stateStore.account.getOrDefault<TokenAccount>(_input.transaction.senderAddress);
    }

    public afterTransactionApply(_input: TransactionApplyContext) {
        if (_input.transaction.moduleID === this.id && _input.transaction.assetID === addCandidateAssetId) {
          const addCandidateAsset = codec.decode(
            addCandidateAssetSchema,
            _input.transaction.asset
          );

          this._channel.publish('election:addCandidate', {
            sender: _input.transaction._senderAddress.toString('hex'),
            election: addCandidateAsset.name
          });
        }
        else if (_input.transaction.moduleID === this.id && _input.transaction.assetID === voteAssetId) {
          const voteAsset = codec.decode(
            voteAssetSchema,
            _input.transaction.asset
          );

          this._channel.publish('election:vote', {
            sender: _input.transaction._senderAddress.toString('hex'),
            election: voteAsset.name
          });
        }
    }


    public async afterGenesisBlockApply(_input: AfterGenesisBlockApplyContext) {
        // Get any data from genesis block, for example get all genesis accounts
        // const genesisAccounts = genesisBlock.header.asset.accounts;
        await _input.stateStore.chain.set(
            CHAIN_STATE_CANDIDATE_COUNTER,
            codec.encode(candidateCounterSchema, { candidateCounter: 0 })
        );
        await _input.stateStore.chain.set(
            CHAIN_STATE_VOTE_COUNTER,
            codec.encode(voteCounterSchema, { voteCounter: 0 })
        );
        await _input.stateStore.chain.set(
            CHAIN_STATE_ELECTION,
            codec.encode(electionSchema, { 
                candidates: [],
                voteCount: []
            })
        );
    }
}
