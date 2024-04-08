import {expect} from 'chai';
import {IGame} from '../../../src/server/IGame';
import {testGame} from '../../TestGame';
import {TestPlayer} from '../../TestPlayer';
import {LunaStagingStation} from '../../../src/server/cards/moon/LunaStagingStation';
import {MoonExpansion} from '../../../src/server/moon/MoonExpansion';
import {MoonData} from '../../../src/server/moon/MoonData';

describe('LunaStagingStation', () => {
  let game: IGame;
  let player: TestPlayer;
  let card: LunaStagingStation;
  let moonData: MoonData;

  beforeEach(() => {
    [game, player] = testGame(1, {moonExpansion: true});
    card = new LunaStagingStation();
    moonData = MoonExpansion.moonData(game);
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.megaCredits = card.cost;

    player.titanium = 1;
    moonData.logisticRate = 2;
    expect(player.getPlayableCardsForTest()).does.include(card);

    player.titanium = 0;
    moonData.logisticRate = 2;
    expect(player.getPlayableCardsForTest()).does.not.include(card);

    player.titanium = 1;
    moonData.logisticRate = 1;
    expect(player.getPlayableCardsForTest()).does.not.include(card);
  });

  it('play', () => {
    player.titanium = 1;
    moonData.logisticRate = 2;
    expect(player.getTerraformRating()).eq(14);

    card.play(player);

    expect(player.titanium).eq(0);
    expect(moonData.logisticRate).eq(4);
    expect(player.getTerraformRating()).eq(16);
  });
});

