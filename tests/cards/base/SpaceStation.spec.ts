import {expect} from 'chai';
import {Bushes} from '../../../src/server/cards/base/Bushes';
import {SpaceStation} from '../../../src/server/cards/base/SpaceStation';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';

describe('SpaceStation', function() {
  it('Should play', function() {
    const card = new SpaceStation();
    const player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, redPlayer], player);
    const action = card.play(player);
    expect(action).is.undefined;
    expect(card.getVictoryPoints()).to.eq(1);
    expect(card.getCardDiscount(player, card)).to.eq(2);
    expect(card.getCardDiscount(player, new Bushes())).to.eq(0);
  });
});
