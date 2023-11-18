import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {RoverDriversUnion} from '../../../src/server/cards/moon/RoverDriversUnion';
import {MoonExpansion} from '../../../src/server/moon/MoonExpansion';
import {MoonData} from '../../../src/server/moon/MoonData';

describe('RoverDriversUnion', () => {
  let game: IGame;
  let player: TestPlayer;
  let card: RoverDriversUnion;
  let moonData: MoonData;

  beforeEach(() => {
    [game, player] = testGame(1, {moonExpansion: true});
    card = new RoverDriversUnion();
    moonData = MoonExpansion.moonData(game);
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.megaCredits = card.cost;

    moonData.logisticRate = 2;
    expect(player.getPlayableCardsForTest()).does.include(card);

    moonData.logisticRate = 1;
    expect(player.getPlayableCardsForTest()).does.not.include(card);
  });

  it('play', () => {
    moonData.logisticRate = 2;
    expect(player.getTerraformRating()).eq(14);
    player.production.override({megacredits: 0});

    card.play(player);

    expect(moonData.logisticRate).eq(3);
    expect(player.getTerraformRating()).eq(15);
    expect(player.production.megacredits).eq(3);

    player.production.override({megacredits: 0});

    card.play(player);

    expect(moonData.logisticRate).eq(4);
    expect(player.getTerraformRating()).eq(16);
    expect(player.production.megacredits).eq(4);
  });
});

