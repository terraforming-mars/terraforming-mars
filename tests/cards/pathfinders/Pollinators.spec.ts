import {expect} from 'chai';
import {Pollinators} from '../../../src/server/cards/pathfinders/Pollinators';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {Units} from '../../../src/common/Units';
import {runAllActions} from '../../TestingUtils';

describe('Pollinators', function() {
  let card: Pollinators;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(function() {
    card = new Pollinators();
    [game, player] = testGame(1);
  });

  it('canPlay', function() {
    player.megaCredits = card.cost;
    player.tagsForTest = {plant: 2};
    expect(player.canPlay(card)).is.false;
    player.tagsForTest = {plant: 3};
    expect(player.canPlay(card)).is.true;
  });

  it('play', () => {
    card.play(player);
    expect(player.production.asUnits()).deep.eq(Units.of({plants: 1, megacredits: 2}));
  });

  it('act', () => {
    expect(card.resourceCount).eq(0);
    card.action(player);
    runAllActions(game);
    expect(card.resourceCount).eq(1);
  });
});
