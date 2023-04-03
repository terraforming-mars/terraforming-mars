import {expect} from 'chai';
import {ImportedGHG} from '../../../src/server/cards/base/ImportedGHG';
import {testGame} from '../../TestGame';

describe('ImportedGHG', function() {
  it('Should play', function() {
    const card = new ImportedGHG();
    const [, player] = testGame(2);
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.production.heat).to.eq(1);
    expect(player.heat).to.eq(3);
  });
});
