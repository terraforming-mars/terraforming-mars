import {expect} from 'chai';
import {BuildingIndustries} from '../../../src/server/cards/base/BuildingIndustries';
import {Resource} from '../../../src/common/Resource';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

describe('BuildingIndustries', () => {
  let card: BuildingIndustries;
  let player: TestPlayer;

  beforeEach(() => {
    card = new BuildingIndustries();
    [/* game */, player] = testGame(1);
  });

  it('Can not play', () => {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', () => {
    player.production.add(Resource.ENERGY, 1);
    expect(card.canPlay(player)).is.true;

    card.play(player);
    expect(player.production.energy).to.eq(0);
    expect(player.production.steel).to.eq(2);
  });
});
