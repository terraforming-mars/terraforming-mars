import {expect} from 'chai';
import {SpecialDesign} from '../../../src/cards/base/SpecialDesign';
import {Game} from '../../../src/Game';
import {TestPlayers} from '../../TestPlayers';

describe('SpecialDesign', function() {
  it('Should play', function() {
    const card = new SpecialDesign();
    const player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, redPlayer], player);
    const action = card.play();
    expect(action).is.undefined;
    expect(card.getRequirementBonus(player)).to.eq(0);
  });
});
