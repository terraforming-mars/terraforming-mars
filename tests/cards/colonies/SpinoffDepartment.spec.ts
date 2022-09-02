import {expect} from 'chai';
import {EarthCatapult} from '../../../src/server/cards/base/EarthCatapult';
import {SpinoffDepartment} from '../../../src/server/cards/colonies/SpinoffDepartment';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';

describe('SpinoffDepartment', function() {
  it('Should play', function() {
    const card = new SpinoffDepartment();
    const card2 = new EarthCatapult();
    const player = TestPlayer.BLUE.newPlayer();
    const player2 = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, player2], player);
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.production.megacredits).to.eq(2);
    card.onCardPlayed(player, card2);
    expect(player.cardsInHand).has.lengthOf(1);
  });
});
