import {expect} from 'chai';
import {BlackPolarDust} from '../../../src/server/cards/base/BlackPolarDust';
import {Game} from '../../../src/server/Game';
import {cast, maxOutOceans} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {Resources} from '../../../src/common/Resources';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {testGame} from '../../TestGame';

describe('BlackPolarDust', function() {
  let card: BlackPolarDust;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new BlackPolarDust();
    [game, player] = testGame(2);
  });

  it('Can not play', function() {
    player.production.add(Resources.MEGACREDITS, -4);
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    card.play(player);
    expect(player.production.megacredits).to.eq(-2);
    expect(player.production.heat).to.eq(3);

    expect(game.deferredActions).has.lengthOf(1);
    const selectSpace = cast(game.deferredActions.peek()!.execute(), SelectSpace);
    selectSpace.cb(selectSpace.availableSpaces[0]);
    expect(player.getTerraformRating()).to.eq(21);
  });

  it('Cannot place ocean if no oceans left', function() {
    maxOutOceans(player);
    card.play(player);
  });
});
