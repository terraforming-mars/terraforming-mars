import {expect} from 'chai';
import {Generalist} from '../../src/server/milestones/Generalist';
import {ALL_RESOURCES} from '../../src/common/Resource';
import {testGame} from '../TestingUtils';

describe('Generalist', function() {
  let milestone: Generalist;

  beforeEach(function() {
    milestone = new Generalist();
  });

  it('Can claim with +1 of each production in game with corp era', function() {
    const [/* game */, player/* , player2 */] = testGame(2);
    ALL_RESOURCES.forEach((resource) => player.production.add(resource, 1));

    expect(milestone.canClaim(player)).is.true;
  });

  it('Cannot claim with +1 of each production in game without corp era', function() {
    const [/* game */, player/* , player2 */] = testGame(2, {corporateEra: false});

    ALL_RESOURCES.forEach((resource) => expect(player.production[resource]).to.eq(1));
    expect(milestone.canClaim(player)).is.not.true;
  });

  it('Can claim with +2 of each production in game without corp era', function() {
    const [/* game */, player/* , player2 */] = testGame(2, {corporateEra: false});
    ALL_RESOURCES.forEach((resource) => player.production.add(resource, 1));

    ALL_RESOURCES.forEach((resource) => expect(player.production[resource]).to.eq(2));
    expect(milestone.canClaim(player)).is.true;
  });
});
