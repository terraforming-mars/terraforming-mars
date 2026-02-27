import {expect} from 'chai';
import {Ants} from '../../../src/server/cards/base/Ants';
import {BuildingIndustries} from '../../../src/server/cards/base/BuildingIndustries';
import {CheungShingMARS} from '../../../src/server/cards/prelude/CheungShingMARS';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestingUtils';
import {Virus} from '../../../src/server/cards/base/Virus';

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

  it('Gains 3 MC when playing a building tag', () => {
    player.playedCards.push(card);
    player.megaCredits = 0;

    card.onCardPlayedForCorps(player, new BuildingIndustries());
    expect(player.megaCredits).to.eq(3);
  });

  it('Does not gain MC for non-building tags', () => {
    player.playedCards.push(card);
    player.megaCredits = 0;

    card.onCardPlayedForCorps(player, new Virus());
    expect(player.megaCredits).to.eq(0);
  });
});
