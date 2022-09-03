import {expect} from 'chai';
import {ImmigrantCity} from '../../../src/server/cards/base/ImmigrantCity';
import {TharsisRepublic} from '../../../src/server/cards/corporation/TharsisRepublic';
import {Game} from '../../../src/server/Game';
import {Resources} from '../../../src/common/Resources';
import {cast, runAllActions, runNextAction} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';

describe('ImmigrantCity', function() {
  let card: ImmigrantCity;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new ImmigrantCity();
    player = TestPlayer.BLUE.newPlayer();
    player2 = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, player2], player);
  });

  it('Can not play without energy production', function() {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    player.production.add(Resources.ENERGY, 1);
    const action = cast(card.play(player), SelectSpace);
    action.cb(action.availableSpaces[0]);
    runAllActions(game);

    expect(player.production.energy).to.eq(0);
    expect(player.production.megacredits).to.eq(-2);
    player.playedCards.push(card);

    game.addCityTile(player, game.board.getAvailableSpacesOnLand(player)[0].id);
    runNextAction(game);
    expect(player.production.megacredits).to.eq(-1);
  });

  it('Can play at -4 M€ production', function() {
    player.production.add(Resources.ENERGY, 1);
    player.production.add(Resources.MEGACREDITS, -4);
    expect(card.canPlay(player)).is.true;

    const action = cast(card.play(player), SelectSpace);
    action.cb(action.availableSpaces[0]);
    runAllActions(game);

    expect(player.production.energy).to.eq(0);
    expect(player.production.megacredits).to.eq(-5);
    player.playedCards.push(card);

    // add another city tile
    game.addCityTile(player, game.board.getAvailableSpacesOnLand(player)[0].id);
    runNextAction(game);
    expect(player.production.megacredits).to.eq(-4);
  });

  it('Tharsis can play at -5 M€ production', function() {
    player.setCorporationForTest(new TharsisRepublic());
    player.production.add(Resources.ENERGY, 1);
    player.production.add(Resources.MEGACREDITS, -5);
    expect(card.canPlay(player)).is.true;

    const action = cast(card.play(player), SelectSpace);
    action.cb(action.availableSpaces[0]);
    runAllActions(game);

    expect(player.production.energy).to.eq(0);
    expect(player.production.megacredits).to.eq(-5); // should not increase
    player.playedCards.push(card);

    // add another city tile - MC prod should increase by 2 (1 from Tharsis, 1 from IC)
    game.addCityTile(player, game.board.getAvailableSpacesOnLand(player)[0].id);
    runAllActions(game);
    expect(player.production.megacredits).to.eq(-3);
  });
});
