import {expect} from 'chai';
import {Ants} from '../../../src/server/cards/base/Ants';
import {BuildingIndustries} from '../../../src/server/cards/base/BuildingIndustries';
import {CheungShingMARS} from '../../../src/server/cards/prelude/CheungShingMARS';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestingUtils';

describe('CheungShingMARS', () => {
  let card: CheungShingMARS;
  let player: TestPlayer;

  beforeEach(() => {
    card = new CheungShingMARS();
    [/* game */, player] = testGame(1);
  });

  it('Gets card discount', () => {
    const ants = new Ants();
    const buildingIndustries = new BuildingIndustries();
    expect(card.getCardDiscount(player, ants)).to.eq(0);
    expect(card.getCardDiscount(player, buildingIndustries)).to.eq(2);
  });

  it('Should play', () => {
    card.play(player);
    expect(player.production.megacredits).to.eq(3);
  });
});
