import { BaseAsset, ApplyAssetContext, ValidateAssetContext } from 'lisk-sdk';
import { codec } from '@liskhq/lisk-codec';
import {
    addCandidateAssetId,
    addCandidateAssetSchema,
    electionSchema,
    candidateCounterSchema,
    CHAIN_STATE_CANDIDATE_COUNTER,
    CHAIN_STATE_ELECTION,
} from '../schemas';

import {
    ElectionChainType,
    AddCandidateAssetType,
    CandidateCounterType,
} from '../types';

export class AddCandidateAsset extends BaseAsset {
  public name = 'addCandidate';
  public id = addCandidateAssetId;
  public schema = addCandidateAssetSchema;

  public validate(context: ValidateAssetContext<AddCandidateAssetType>): void {
    // Validate your asset
    if (!context.asset.name) {
	      throw new Error(
	          'Name cannot be empty'
	      );
	  }
	}

  // eslint-disable-next-line @typescript-eslint/require-await
  public async apply(context: ApplyAssetContext<AddCandidateAssetType>): Promise<void> {
    // Update election on chain
    const electionBuffer = await context.stateStore.chain.get(
      CHAIN_STATE_ELECTION
    );
    if (electionBuffer) {
      const election:ElectionChainType = codec.decode(
        electionSchema,
        electionBuffer
      );
      if (!election || !election.candidates || !election.voteCount)
        throw new Error('Fail to get Election.');
      if (election.candidates.indexOf(context.asset.name) !== -1)
        throw new Error('This candidate is already added.');
      election.candidates.push(context.asset.name);
      election.voteCount.push(0);
      await context.stateStore.chain.set(
        CHAIN_STATE_ELECTION,
        codec.encode(electionSchema, election)
      );
    }

    // Update candidateCounter on chain
    const counterBuffer = await context.stateStore.chain.get(
        CHAIN_STATE_CANDIDATE_COUNTER
    );
    if (counterBuffer) {
      const counter:CandidateCounterType = codec.decode(
          candidateCounterSchema,
          counterBuffer
      );
      counter.candidateCounter = counter.candidateCounter + 1;
      await context.stateStore.chain.set(
          CHAIN_STATE_CANDIDATE_COUNTER,
          codec.encode(candidateCounterSchema, counter)
      );
    }
  }
}
