import {expect} from 'chai';
import {ImportOfAdvancedGHG} from '../../../src/server/cards/base/ImportOfAdvancedGHG';
import {testGame} from '../../TestGame';

describe('ImportOfAdvancedGHG', function() {
  it('Should play', function() {
    const card = new ImportOfAdvancedGHG();
    const [, player] = testGame(2);
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.production.heat).to.eq(2);
  });
});
