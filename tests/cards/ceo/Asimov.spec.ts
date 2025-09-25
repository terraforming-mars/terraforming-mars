import {expect} from 'chai';
import {IGame} from '../../../src/server/IGame';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {ASIMOV_AWARD_BONUS} from '../../../src/common/constants';
import {cast, forceGenerationEnd} from '../../TestingUtils';
import {Asimov} from '../../../src/server/cards/ceos/Asimov';
import {FundedAwardModel} from '../../../src/common/models/FundedAwardModel';
import {Server} from '../../../src/server/models/ServerModel';

describe('Asimov', () => {
  let card: Asimov;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new Asimov();
    [game, player, player2] = testGame(2);
  });

  it('Asimov award bonuses', () => {
    // Sanity check that the number of awards in the game is not-0
    expect(game.awards).length.greaterThan(0);

    function score(model: FundedAwardModel, p: TestPlayer): number {
      return model.scores.find((s) => s.playerColor === p.color)!.playerScore;
    }

    const awardModel = Server.getAwards(game);
    // Sanity check that there are no bonuses before we playing Asimov
    awardModel.forEach((award) => {
      expect(score(award, player), 'for ' + award.name).eq(0);
      expect(score(award, player2), 'for ' + award.name).eq(0);
    });

    // Play Asimov, get a bonus
    player.playedCards.push(card);
    const awardModel2 = Server.getAwards(game);
    awardModel2.forEach((award) => {
      expect(score(award, player), 'for ' + award.name).eq(ASIMOV_AWARD_BONUS);
      expect(score(award, player2), 'for ' + award.name).eq(0);
    });
  });

  it('Can only act once per game', () => {
    expect(card.canAct(player)).is.true;

    const orOptions = cast(card.action(player), OrOptions);
    orOptions.options[0].cb();
    expect(card.isDisabled).is.true;
    expect(player.megaCredits).eq(0);

    forceGenerationEnd(game);
    expect(card.canAct(player)).is.false;
  });

  it('Takes action in Generation 4', () => {
    game.generation = 4;
    const orOptions = cast(card.action(player), OrOptions);
    expect(orOptions.options).has.length(10-4+1); // The +1 here is for the "Do Nothing" option
  });

  it('Takes action in Generation 15', () => {
    game.generation = 15;
    const orOptions = cast(card.action(player), OrOptions);
    expect(orOptions.options).has.length(1+1); // The +1 here is for the "Do Nothing" option
  });

  it('Number of awards increases after play, and the new award is funded', () => {
    // Sanity check that the last award is not funded
    expect(game.hasBeenFunded(game.awards[game.awards.length - 1])).is.false;
    game.generation = 1;
    const preActionAwardCount = game.awards.length;
    const action = cast(card.action(player), OrOptions);
    action.options[0].cb();
    // Make sure there's a new award, and that it has been funded
    expect(game.awards).has.length(preActionAwardCount + 1);
    expect(game.hasBeenFunded(game.awards[game.awards.length - 1])).is.true;
  });

  it('Cannot act if 3 awards are already funded', () => {
    game.fundAward(player2, game.awards[0]);
    game.fundAward(player2, game.awards[1]);
    game.fundAward(player2, game.awards[2]);

    expect(card.canAct(player)).is.false;
  });
});
