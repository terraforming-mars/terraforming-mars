import {expect} from 'chai';
import {MartianIndustries} from '../../../src/server/cards/prelude/MartianIndustries';
import {testGame} from '../../TestGame';
import {cast} from '../../TestingUtils';

describe('MartianIndustries', function() {
  it('Should play', function() {
    const card = new MartianIndustries();
    const [/* game */, player] = testGame(1);
    cast(card.play(player), undefined);
    expect(player.production.energy).to.eq(1);
    expect(player.production.steel).to.eq(1);
    expect(player.megaCredits).to.eq(6);
  });
});
