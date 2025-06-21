import {expect} from 'chai';
import {ImportedGHG} from '../../../src/server/cards/base/ImportedGHG';
import {testGame} from '../../TestGame';
import {cast} from '../../TestingUtils';

describe('ImportedGHG', () => {
  it('Should play', () => {
    const card = new ImportedGHG();
    const [/* game */, player] = testGame(2);
    cast(card.play(player), undefined);
    expect(player.production.heat).to.eq(1);
    expect(player.heat).to.eq(3);
  });
});
