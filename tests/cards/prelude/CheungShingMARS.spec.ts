import {expect} from 'chai';
import {Ants} from '../../../src/server/cards/base/Ants';
import {BuildingIndustries} from '../../../src/server/cards/base/BuildingIndustries';
import {CheungShingMARS} from '../../../src/server/cards/prelude/CheungShingMARS';
import {Game} from '../../../src/server/Game';
import {Player} from '../../../src/server/Player';
import {TestPlayer} from '../../TestPlayer';

describe('CheungShingMARS', function() {
  let card: CheungShingMARS;
  let player: Player;

  beforeEach(function() {
    card = new CheungShingMARS();
    player = TestPlayer.BLUE.newPlayer();
    Game.newInstance('gameid', [player], player);
  });

  it('Gets card discount', function() {
    const ants = new Ants();
    const buildingIndustries = new BuildingIndustries();
    expect(card.getCardDiscount(player, ants)).to.eq(0);
    expect(card.getCardDiscount(player, buildingIndustries)).to.eq(2);
  });

  it('Should play', function() {
    card.play(player);
    expect(player.production.megacredits).to.eq(3);
  });
});
