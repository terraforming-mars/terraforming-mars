import {expect} from 'chai';
import {ImmigrantCity} from '../../../src/cards/base/ImmigrantCity';
import {TharsisRepublic} from '../../../src/cards/corporation/TharsisRepublic';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';

describe('ImmigrantCity', function() {
  let card : ImmigrantCity; let player : Player; let player2 : Player; let game : Game;

  beforeEach(function() {
    card = new ImmigrantCity();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, player2], player);
  });

  it('Can\'t play without energy production', function() {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    player.addProduction(Resources.ENERGY, 1);
    const action = card.play(player);
    action.cb(action.availableSpaces[0]);
    TestingUtils.runAllActions(game);

    expect(player.getProduction(Resources.ENERGY)).to.eq(0);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(-2);
    player.playedCards.push(card);

    game.addCityTile(player, game.board.getAvailableSpacesOnLand(player)[0].id);
    TestingUtils.runNextAction(game);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(-1);
  });

  it('Can play at -4 M€ production', function() {
    player.addProduction(Resources.ENERGY, 1);
    player.addProduction(Resources.MEGACREDITS, -4);
    expect(card.canPlay(player)).is.true;

    const action = card.play(player);
    action.cb(action.availableSpaces[0]);
    TestingUtils.runAllActions(game);

    expect(player.getProduction(Resources.ENERGY)).to.eq(0);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(-5);
    player.playedCards.push(card);

    // add another city tile
    game.addCityTile(player, game.board.getAvailableSpacesOnLand(player)[0].id);
    TestingUtils.runNextAction(game);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(-4);
  });

  it('Tharsis can play at -5 M€ production', function() {
    player.corporationCard = new TharsisRepublic();
    player.addProduction(Resources.ENERGY, 1);
    player.addProduction(Resources.MEGACREDITS, -5);
    expect(card.canPlay(player)).is.true;

    const action = card.play(player);
    action.cb(action.availableSpaces[0]);
    TestingUtils.runAllActions(game);

    expect(player.getProduction(Resources.ENERGY)).to.eq(0);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(-5); // should not increase
    player.playedCards.push(card);

    // add another city tile - MC prod should increase by 2 (1 from Tharsis, 1 from IC)
    game.addCityTile(player, game.board.getAvailableSpacesOnLand(player)[0].id);
    TestingUtils.runAllActions(game);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(-3);
  });
});
