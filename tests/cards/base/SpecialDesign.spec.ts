
import {expect} from 'chai';
import {SpecialDesign} from '../../../src/cards/base/SpecialDesign';
import {Color} from '../../../src/Color';
import {Player} from '../../../src/Player';
import {Game} from '../../../src/Game';

describe('SpecialDesign', function() {
  it('Should play', function() {
    const card = new SpecialDesign();
    const player = new Player('test', Color.BLUE, false);
    const game = new Game('foobar', [player, player], player);
    const action = card.play();
    expect(action).is.undefined;
    expect(card.getRequirementBonus(player, game)).to.eq(0);
  });
});
