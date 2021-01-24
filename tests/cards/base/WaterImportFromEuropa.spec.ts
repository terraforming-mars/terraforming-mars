import {expect} from 'chai';
import {WaterImportFromEuropa} from '../../../src/cards/base/WaterImportFromEuropa';
import {Game} from '../../../src/Game';
import {SelectSpace} from '../../../src/inputs/SelectSpace';
import {Player} from '../../../src/Player';
import * as utils from '../../TestingUtils';

describe('WaterImportFromEuropa', function() {
  let card : WaterImportFromEuropa; let player : Player; let game : Game;

  beforeEach(function() {
    card = new WaterImportFromEuropa();
    player = utils.TestPlayers.BLUE.newPlayer();
    const redPlayer = utils.TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Can\'t act', function() {
    expect(card.canAct(player)).is.not.true;
  });

  it('Should play', function() {
    card.play();
    player.playedCards.push(card);
    expect(card.getVictoryPoints(player)).to.eq(1);
  });

  it('Should act', function() {
    player.megaCredits = 13;

    const action = card.action(player);
    expect(action).is.undefined;

    utils.runNextAction(game); // HowToPay
    expect(player.megaCredits).to.eq(1);

    expect(game.deferredActions).has.lengthOf(1);
    const selectOcean = game.deferredActions.peek()!.execute() as SelectSpace;
    selectOcean.cb(selectOcean.availableSpaces[0]);
    expect(player.getTerraformRating()).to.eq(21);
  });

  it('Can act if can pay even after oceans are maxed', function() {
    utils.maxOutOceans(player, game);
    player.megaCredits = 12;

    expect(card.canAct(player)).is.true;
  });
});
