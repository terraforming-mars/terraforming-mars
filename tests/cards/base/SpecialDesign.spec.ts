import {expect} from 'chai';
import {SpecialDesign} from '../../../src/cards/base/SpecialDesign';
import {Game} from '../../../src/Game';
import {TestPlayer} from '../../TestPlayer';

describe('SpecialDesign', function() {
  it('Should play', function() {
    const card = new SpecialDesign();
    const player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, redPlayer], player);
    const action = card.play();
    expect(action).is.undefined;
    expect(card.getRequirementBonus(player)).to.eq(0);
  });
});
