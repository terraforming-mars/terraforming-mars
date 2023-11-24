import {expect} from 'chai';
import {StagedProtests} from '../../../src/server/cards/underworld/StagedProtests';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {finishGeneration} from '../../TestingUtils';
import {testGame} from '../../TestGame';
import {IMilestone} from '../../../src/server/milestones/IMilestone';

describe('StagedProtests', () => {
  let card: StagedProtests;
  let game: Game;
  let player: TestPlayer;
  let terraformer: IMilestone;

  beforeEach(() => {
    card = new StagedProtests();
    [game, player/* , player2 */] = testGame(2);
    terraformer = game.milestones.find((milestone) => milestone.name === 'Terraformer')!;
  });

  it('canPlay', () => {
    player.underworldData.corruption = 0;
    expect(card.canPlay(player)).is.false;
    player.underworldData.corruption = 1;
    expect(card.canPlay(player)).is.true;
  });

  it('Should play', () => {
    player.underworldData.corruption = 1;
    card.play(player);
    expect(player.underworldData.corruption).eq(2);
  });

  it('Milestone costs', () => {
    card.play(player);
    player.playedCards.push(card);
    player.setTerraformRating(35); // Can claim Terraformer milestone
    player.megaCredits = 15;
    expect(player.claimableMilestones()).is.empty;
    player.megaCredits = 16;

    expect(player.claimableMilestones()).to.have.members([terraformer]);

    finishGeneration(game);
    player.megaCredits = 8;

    expect(player.claimableMilestones()).to.have.members([terraformer]);
  });

  it('Award costs', () => {
    expect(player.awardFundingCost()).eq(8);
    card.play(player);
    player.playedCards.push(card);

    expect(player.awardFundingCost()).eq(16);

    finishGeneration(game);

    expect(player.awardFundingCost()).eq(8);
  });
});
