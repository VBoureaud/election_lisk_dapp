import { BaseAsset, ApplyAssetContext, ValidateAssetContext } from 'lisk-sdk';
import { codec } from '@liskhq/lisk-codec';
import {
    CHAIN_STATE_ELECTION,
    voteCounterSchema,
    CHAIN_STATE_VOTE_COUNTER,
    electionSchema,
    voteAssetId,
    voteAssetSchema,
} from '../schemas';

import {
    ElectionChainType,
    ElectionModuleType,
    VoteAssetType,
    VoteCounterType,
} from '../types';

export class VoteAsset extends BaseAsset {
	public name = 'vote';
  public id = voteAssetId;
	public schema = voteAssetSchema;

  public validate(context: ValidateAssetContext<VoteAssetType>): void {
    // Validate your asset
    if (!context.asset.name) {
	      throw new Error(
	          'Name cannot be empty'
	      );
	  }
  }

	// eslint-disable-next-line @typescript-eslint/require-await
  public async apply(context: ApplyAssetContext<VoteAssetType>): Promise<void> {
  	// Get account data of the sender of the vote transaction
    const senderAddress = context.transaction.senderAddress;
    const senderAccount:ElectionModuleType = await context.stateStore.account.get(senderAddress);
    if (senderAccount && senderAccount.election && senderAccount.election.voted)
    	throw new Error('This account has already voted');

    // Check if candidate exist & update
    const electionBuffer = await context.stateStore.chain.get(
      CHAIN_STATE_ELECTION
    );
    if (electionBuffer) {
      const election:ElectionChainType = codec.decode(
        electionSchema,
        electionBuffer
      );
      const posCandidate = election.candidates ? election.candidates.indexOf(context.asset.name) : -1;
      if (posCandidate === -1)
        throw new Error('This candidate do not exist.');
      // update candidate vote
      election.voteCount[posCandidate] = election.voteCount[posCandidate] + 1;
      await context.stateStore.chain.set(
        CHAIN_STATE_ELECTION,
        codec.encode(electionSchema, election)
      );
    }

    // save account voted
    senderAccount.election.voted = true;
    context.stateStore.account.set(senderAccount.address, senderAccount);

  	// Update vote counter on chain
		const counterBuffer = await context.stateStore.chain.get(
        CHAIN_STATE_VOTE_COUNTER
    );
    if (counterBuffer) {
      const counter:VoteCounterType = codec.decode(
          voteCounterSchema,
          counterBuffer
      );
      counter.voteCounter = counter.voteCounter + 1;
      await context.stateStore.chain.set(
          CHAIN_STATE_VOTE_COUNTER,
          codec.encode(voteCounterSchema, counter)
      );
    }

	}
}
