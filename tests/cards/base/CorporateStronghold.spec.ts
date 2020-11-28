import {expect} from 'chai';
import {CorporateStronghold} from '../../../src/cards/base/CorporateStronghold';
import {Color} from '../../../src/Color';
import {Player} from '../../../src/Player';
import {Game} from '../../../src/Game';
import {SelectSpace} from '../../../src/inputs/SelectSpace';
import {TileType} from '../../../src/TileType';
import {Resources} from '../../../src/Resources';

describe('CorporateStronghold', function() {
  let card : CorporateStronghold; let player : Player; let game : Game;

  beforeEach(function() {
    card = new CorporateStronghold();
    player = new Player('test', Color.BLUE, false);
    game = new Game('foobar', [player, player], player);
  });

  it('Can\'t play', function() {
    expect(card.canPlay(player, game)).is.not.true;
  });

  it('Should play', function() {
    player.addProduction(Resources.ENERGY);
    expect(card.canPlay(player, game)).is.true;

    const action = card.play(player, game);
    expect(action instanceof SelectSpace).is.true;
    action.cb(action.availableSpaces[0]);

    expect(action.availableSpaces[0].tile && action.availableSpaces[0].tile.tileType).to.eq(TileType.CITY);
    expect(player.getProduction(Resources.ENERGY)).to.eq(0);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(3);

    player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
    expect(player.victoryPointsBreakdown.victoryPoints).to.eq(-2);
  });
});
