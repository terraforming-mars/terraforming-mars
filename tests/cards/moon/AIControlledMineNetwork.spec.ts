import {testGame} from '../../TestGame';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {AIControlledMineNetwork} from '../../../src/server/cards/moon/AIControlledMineNetwork';
import {expect} from 'chai';
import {MoonExpansion} from '../../../src/server/moon/MoonExpansion';
import {MoonData} from '../../../src/server/moon/MoonData';

describe('AIControlledMineNetwork', () => {
  let game: IGame;
  let player: TestPlayer;
  let card: AIControlledMineNetwork;
  let moonData: MoonData;

  beforeEach(() => {
    [game, player] = testGame(1, {moonExpansion: true});
    card = new AIControlledMineNetwork();
    moonData = MoonExpansion.moonData(game);
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.megaCredits = card.cost;

    moonData.logisticRate = 1;
    expect(player.getPlayableCardsForTest()).does.not.include(card);

    moonData.logisticRate = 2;
    expect(player.getPlayableCardsForTest()).does.include(card);
  });

  it('play', () => {
    expect(moonData.logisticRate).eq(0);
    expect(player.getTerraformRating()).eq(14);

    card.play(player);

    expect(moonData.logisticRate).eq(1);
    expect(player.getTerraformRating()).eq(15);
  });
});

