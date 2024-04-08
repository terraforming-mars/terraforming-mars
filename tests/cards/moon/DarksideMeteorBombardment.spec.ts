import {expect} from 'chai';
import {IGame} from '../../../src/server/IGame';
import {testGame} from '../../TestGame';
import {TestPlayer} from '../../TestPlayer';
import {DarksideMeteorBombardment} from '../../../src/server/cards/moon/DarksideMeteorBombardment';
import {MoonExpansion} from '../../../src/server/moon/MoonExpansion';
import {MoonData} from '../../../src/server/moon/MoonData';

describe('DarksideMeteorBombardment', () => {
  let game: IGame;
  let player: TestPlayer;
  let card: DarksideMeteorBombardment;
  let moonData: MoonData;

  beforeEach(() => {
    [game, player] = testGame(1, {moonExpansion: true});
    card = new DarksideMeteorBombardment();
    moonData = MoonExpansion.moonData(game);
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.megaCredits = card.cost;
    expect(player.getPlayableCardsForTest()).does.include(card);
  });

  it('play', () => {
    player.titanium = 0;
    player.steel = 0;
    moonData.miningRate = 0;
    expect(player.getTerraformRating()).eq(14);

    card.play(player);

    expect(player.titanium).eq(2);
    expect(player.titanium).eq(2);
    expect(moonData.miningRate).eq(2);
    expect(player.getTerraformRating()).eq(16);
  });
});

