import {expect} from 'chai';
import {SpinoffDepartment} from '../../../src/cards/colonies/SpinoffDepartment';
import {Color} from '../../../src/Color';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';
import {EarthCatapult} from '../../../src/cards/base/EarthCatapult';
import {Game} from '../../../src/Game';

describe('SpinoffDepartment', function() {
  it('Should play', function() {
    const card = new SpinoffDepartment();
    const card2 = new EarthCatapult();
    const player = new Player('test', Color.BLUE, false);
    const player2 = new Player('test2', Color.RED, false);
    const game = new Game('foobar', [player, player2], player);
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(2);
    card.onCardPlayed(player, game, card2);
    expect(player.cardsInHand).has.lengthOf(1);
  });
});
