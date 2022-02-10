import { BaseAsset, ApplyAssetContext, ValidateAssetContext } from 'lisk-sdk';
import { codec } from '@liskhq/lisk-codec';
import {
    candidateCounterSchema,
    CHAIN_STATE_CANDIDATE_COUNTER,
    addCandidateAssetSchema,
    addCandidateAssetId,
    CHAIN_STATE_ELECTION,
    electionSchema,
    addCandidateAssetType,
    electionType,
    candidateCounterType,
} from '../schemas';

export class AddCandidateAsset extends BaseAsset {
  public name = 'addCandidate';
  public id = addCandidateAssetId;
  public schema = addCandidateAssetSchema;

  public validate(context: ValidateAssetContext<addCandidateAssetType>): void {
    // Validate your asset
    if (!context.asset.name) {
	      throw new Error(
	          'Name cannot be empty'
	      );
	  }
	}

  // eslint-disable-next-line @typescript-eslint/require-await
  public async apply({ asset, transaction, stateStore }: ApplyAssetContext<{}>): Promise<void> {
    // Update election on chain
    const electionBuffer = await stateStore.chain.get(
      CHAIN_STATE_ELECTION
    );
    const election:electionType = codec.decode(
      electionSchema,
      electionBuffer
    );
    if (!election || !election.candidates || !election.voteCount)
      throw new Error('Fail to get Election.');
    if (election.candidates.indexOf(asset.name) !== -1)
      throw new Error('This candidate is already added.');
    election.candidates.push(asset.name);
    election.voteCount.push(0);
    await stateStore.chain.set(
      CHAIN_STATE_ELECTION,
      codec.encode(electionSchema, election)
    );

    // Update candidateCounter on chain
    const counterBuffer = await stateStore.chain.get(
        CHAIN_STATE_CANDIDATE_COUNTER
    );
    const counter:candidateCounterType = codec.decode(
        candidateCounterSchema,
        counterBuffer
    );
    counter.candidateCounter = counter.candidateCounter + 1;
    await stateStore.chain.set(
        CHAIN_STATE_CANDIDATE_COUNTER,
        codec.encode(candidateCounterSchema, counter)
    );
  }
}
