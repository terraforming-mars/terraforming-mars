import {expect} from 'chai';
import {IGame} from '../../../src/server/IGame';
import {testGame} from '../../TestGame';
import {MoonData} from '../../../src/server/moon/MoonData';
import {MoonExpansion} from '../../../src/server/moon/MoonExpansion';
import {runAllActions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {TychoRoadNetwork} from '../../../src/server/cards/moon/TychoRoadNetwork';
import {assertPlaceTile} from '../../assertions';
import {TileType} from '../../../src/common/TileType';

describe('TychoRoadNetwork', () => {
  let game: IGame;
  let player: TestPlayer;
  let moonData: MoonData;
  let card: TychoRoadNetwork;

  beforeEach(() => {
    [game, player] = testGame(1, {moonExpansion: true});
    moonData = MoonExpansion.moonData(game);
    card = new TychoRoadNetwork();
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.steel = 0;
    player.megaCredits = card.cost;
    expect(player.getPlayableCardsForTest()).does.not.include(card);
    player.steel = 1;
    expect(player.getPlayableCardsForTest()).does.include(card);
  });

  it('play', () => {
    player.steel = 1;
    expect(player.production.megacredits).eq(0);
    expect(player.getTerraformRating()).eq(14);
    expect(moonData.logisticRate).eq(0);

    card.play(player);

    expect(player.steel).eq(0);
    expect(player.production.megacredits).eq(1);

    runAllActions(game);

    assertPlaceTile(player, player.popWaitingFor(), TileType.MOON_ROAD);

    expect(player.getTerraformRating()).eq(15);
    expect(moonData.logisticRate).eq(1);
  });
});

