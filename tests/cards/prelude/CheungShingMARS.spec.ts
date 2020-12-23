import {expect} from 'chai';
import {Ants} from '../../../src/cards/base/Ants';
import {BuildingIndustries} from '../../../src/cards/base/BuildingIndustries';
import {CheungShingMARS} from '../../../src/cards/prelude/CheungShingMARS';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestingUtils';

describe('CheungShingMARS', function() {
  let card : CheungShingMARS; let player : Player; let game : Game;

  beforeEach(function() {
    card = new CheungShingMARS();
    player = TestPlayers.BLUE.newPlayer();
    game = Game.newInstance('foobar', [player], player);
  });

  it('Gets card discount', function() {
    const ants = new Ants();
    const buildingIndustries = new BuildingIndustries();
    expect(card.getCardDiscount(player, game, ants)).to.eq(0);
    expect(card.getCardDiscount(player, game, buildingIndustries)).to.eq(2);
  });

  it('Should play', function() {
    card.play(player);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(3);
  });
});
