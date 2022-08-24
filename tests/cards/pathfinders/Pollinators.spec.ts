import {expect} from 'chai';
import {Pollinators} from '../../../src/server/cards/pathfinders/Pollinators';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {Units} from '../../../src/common/Units';

describe('Pollinators', function() {
  let card: Pollinators;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new Pollinators();
    game = newTestGame(1);
    player = getTestPlayer(game, 0);
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
    expect(card.resourceCount).eq(1);
  });
});
