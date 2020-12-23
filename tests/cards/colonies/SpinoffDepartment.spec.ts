import {expect} from 'chai';
import {EarthCatapult} from '../../../src/cards/base/EarthCatapult';
import {SpinoffDepartment} from '../../../src/cards/colonies/SpinoffDepartment';
import {Game} from '../../../src/Game';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestingUtils';

describe('SpinoffDepartment', function() {
  it('Should play', function() {
    const card = new SpinoffDepartment();
    const card2 = new EarthCatapult();
    const player = TestPlayers.BLUE.newPlayer();
    const player2 = TestPlayers.RED.newPlayer();
    const game = Game.newInstance('foobar', [player, player2], player);
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(2);
    card.onCardPlayed(player, game, card2);
    expect(player.cardsInHand).has.lengthOf(1);
  });
});
