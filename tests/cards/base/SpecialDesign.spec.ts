
import {expect} from 'chai';
import {SpecialDesign} from '../../../src/cards/base/SpecialDesign';
import {Game} from '../../../src/Game';
import {TestPlayers} from '../../TestingUtils';

describe('SpecialDesign', function() {
  it('Should play', function() {
    const card = new SpecialDesign();
    const player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    const game = Game.newInstance('foobar', [player, redPlayer], player);
    const action = card.play();
    expect(action).is.undefined;
    expect(card.getRequirementBonus(player, game)).to.eq(0);
  });
});
