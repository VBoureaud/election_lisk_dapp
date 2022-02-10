import { BaseAsset, ApplyAssetContext, ValidateAssetContext } from 'lisk-sdk';
import { codec } from '@liskhq/lisk-codec';
import {
    CHAIN_STATE_ELECTION,
    voteCounterSchema,
    CHAIN_STATE_VOTE_COUNTER,
    electionSchema,
    voteAssetId,
    voteAssetSchema,
    voteAssetType,
} from '../schemas';

export class VoteAsset extends BaseAsset {
	public name = 'vote';
  public id = voteAssetId;
	public schema = voteAssetSchema;

  public validate(context: ValidateAssetContext<voteAssetType>): void {
    // Validate your asset
    if (!context.asset.name) {
	      throw new Error(
	          'Name cannot be empty'
	      );
	  }
  }

	// eslint-disable-next-line @typescript-eslint/require-await
  public async apply({ asset, transaction, stateStore }: ApplyAssetContext<{}>): Promise<void> {
  	// Get account data of the sender of the vote transaction
    const senderAddress = transaction.senderAddress;
    const senderAccount = await stateStore.account.get(senderAddress);
    if (senderAccount.election.voted)
    	throw new Error('This account has already voted');

    // Check if candidate exist & update
    const electionBuffer = await stateStore.chain.get(
      CHAIN_STATE_ELECTION
    );
    const election = codec.decode(
      electionSchema,
      electionBuffer
    );
    const posCandidate = election.candidates ? election.candidates.indexOf(asset.name) : -1;
    if (posCandidate === -1)
      throw new Error('This candidate do not exist.');
    // update candidate vote
    election.voteCount[posCandidate] = election.voteCount[posCandidate] + 1;
    await stateStore.chain.set(
      CHAIN_STATE_ELECTION,
      codec.encode(electionSchema, election)
    );

    // save account voted
    senderAccount.election.voted = true;
    stateStore.account.set(senderAccount.address, senderAccount);

  	// Update vote counter on chain
		const counterBuffer = await stateStore.chain.get(
        CHAIN_STATE_VOTE_COUNTER
    );
    const counter = codec.decode(
        voteCounterSchema,
        counterBuffer
    );
    counter.voteCounter = counter.voteCounter + 1;
    await stateStore.chain.set(
        CHAIN_STATE_VOTE_COUNTER,
        codec.encode(voteCounterSchema, counter)
    );

	}
}
