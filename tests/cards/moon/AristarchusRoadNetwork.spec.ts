import {expect} from 'chai';
import {IGame} from '../../../src/server/IGame';
import {testGame} from '../../TestGame';
import {MoonData} from '../../../src/server/moon/MoonData';
import {MoonExpansion} from '../../../src/server/moon/MoonExpansion';
import {runAllActions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {AristarchusRoadNetwork} from '../../../src/server/cards/moon/AristarchusRoadNetwork';
import {assertPlaceMoonRoad} from '../../assertions';

describe('AristarchusRoadNetwork', () => {
  let game: IGame;
  let player: TestPlayer;
  let moonData: MoonData;
  let card: AristarchusRoadNetwork;

  beforeEach(() => {
    [game, player] = testGame(1, {moonExpansion: true});
    moonData = MoonExpansion.moonData(game);
    card = new AristarchusRoadNetwork();
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.steel = 1;
    player.megaCredits = card.cost;
    expect(player.getPlayableCards()).does.not.include(card);
    player.steel = 2;
    expect(player.getPlayableCards()).does.include(card);
  });

  it('play', () => {
    player.steel = 2;
    expect(player.production.megacredits).eq(0);
    expect(player.terraformRating).eq(14);
    expect(moonData.logisticRate).eq(0);

    card.play(player);

    expect(player.steel).eq(0);
    expect(player.production.megacredits).eq(2);

    runAllActions(game);
    expect(moonData.logisticRate).eq(0);
    assertPlaceMoonRoad(player, player.popWaitingFor());

    expect(player.terraformRating).eq(15);
    expect(moonData.logisticRate).eq(1);
  });
});

