import {expect} from 'chai';
import {IGame} from '../../../src/server/IGame';
import {testGame} from '../../TestGame';
import {MoonData} from '../../../src/server/moon/MoonData';
import {MoonExpansion} from '../../../src/server/moon/MoonExpansion';
import {TestPlayer} from '../../TestPlayer';
import {MiningRobotsManufCenter} from '../../../src/server/cards/moon/MiningRobotsManufCenter';

describe('MiningRobotsManufCenter', () => {
  let game: IGame;
  let player: TestPlayer;
  let moonData: MoonData;
  let card: MiningRobotsManufCenter;

  beforeEach(() => {
    [game, player] = testGame(1, {moonExpansion: true});
    moonData = MoonExpansion.moonData(game);
    card = new MiningRobotsManufCenter();
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.titanium = 0;
    player.megaCredits = card.cost;
    expect(player.getPlayableCardsForTest()).does.not.include(card);
    player.titanium = 1;
    expect(player.getPlayableCardsForTest()).does.include(card);
  });

  it('play', () => {
    player.titanium = 3;
    expect(player.getTerraformRating()).eq(14);
    expect(moonData.miningRate).eq(0);

    card.play(player);

    expect(player.titanium).eq(2);
    expect(player.getTerraformRating()).eq(16);
    expect(moonData.miningRate).eq(2);
  });
});

