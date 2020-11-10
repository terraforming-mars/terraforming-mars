import {expect} from 'chai';
import {TerraformingContract} from '../../../src/cards/venusNext/TerraformingContract';
import {Color} from '../../../src/Color';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';

describe('TerraformingContract', function() {
  it('Should play', function() {
    const card = new TerraformingContract();
    const player = new Player('test', Color.BLUE, false);
    expect(card.canPlay(player)).is.not.true;
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(4);
  });
});
