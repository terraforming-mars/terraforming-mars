import {expect} from 'chai';
import {IGame} from '../../../src/server/IGame';
import {testGame} from '../../TestGame';
import {TestPlayer} from '../../TestPlayer';
import {MicrosingularityPlant} from '../../../src/server/cards/moon/MicrosingularityPlant';
import {MoonExpansion} from '../../../src/server/moon/MoonExpansion';
import {MoonData} from '../../../src/server/moon/MoonData';
import {TileType} from '../../../src/common/TileType';

describe('MicrosingularityPlant', () => {
  let game: IGame;
  let player: TestPlayer;
  let card: MicrosingularityPlant;
  let moonData: MoonData;

  beforeEach(() => {
    [game, player] = testGame(1, {moonExpansion: true});
    card = new MicrosingularityPlant();
    moonData = MoonExpansion.moonData(game);
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.megaCredits = card.cost;

    const space1 = moonData.moon.getAvailableSpacesOnLand(player)[0];
    const space2 = moonData.moon.getAvailableSpacesOnLand(player)[1];

    space1.tile = {tileType: TileType.MOON_HABITAT};
    space2.tile = {tileType: TileType.MOON_HABITAT};
    expect(player.getPlayableCardsForTest()).does.include(card);

    space2.tile = {tileType: TileType.MOON_ROAD};
    expect(player.getPlayableCardsForTest()).does.not.include(card);
  });

  it('play', () => {
    expect(player.production.energy).eq(0);

    card.play(player);

    expect(player.production.energy).eq(2);
  });
});

