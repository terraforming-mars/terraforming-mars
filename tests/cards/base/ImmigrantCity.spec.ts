import {expect} from 'chai';
import {ImmigrantCity} from '../../../src/server/cards/base/ImmigrantCity';
import {TharsisRepublic} from '../../../src/server/cards/corporation/TharsisRepublic';
import {IGame} from '../../../src/server/IGame';
import {Resource} from '../../../src/common/Resource';
import {cast, runAllActions, runNextAction} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {testGame} from '../../TestGame';

describe('ImmigrantCity', function() {
  let card: ImmigrantCity;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(function() {
    card = new ImmigrantCity();
    [game, player] = testGame(2);
  });

  it('Can not play without energy production', function() {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    player.production.add(Resource.ENERGY, 1);
    const action = cast(card.play(player), SelectSpace);
    action.cb(action.spaces[0]);
    runAllActions(game);

    expect(player.production.energy).to.eq(0);
    expect(player.production.megacredits).to.eq(-2);
    player.playedCards.push(card);

    game.addCity(player, game.board.getAvailableSpacesOnLand(player)[0]);
    runNextAction(game);
    expect(player.production.megacredits).to.eq(-1);
  });

  it('Can play at -4 M€ production', function() {
    player.production.add(Resource.ENERGY, 1);
    player.production.add(Resource.MEGACREDITS, -4);
    expect(card.canPlay(player)).is.true;

    const action = cast(card.play(player), SelectSpace);
    action.cb(action.spaces[0]);
    runAllActions(game);

    expect(player.production.energy).to.eq(0);
    expect(player.production.megacredits).to.eq(-5);
    player.playedCards.push(card);

    // add another city tile
    game.addCity(player, game.board.getAvailableSpacesOnLand(player)[0]);
    runNextAction(game);
    expect(player.production.megacredits).to.eq(-4);
  });

  it('Tharsis can play at -5 M€ production', function() {
    player.corporations.push(new TharsisRepublic());
    player.production.add(Resource.ENERGY, 1);
    player.production.add(Resource.MEGACREDITS, -5);
    expect(card.canPlay(player)).is.true;

    const action = cast(card.play(player), SelectSpace);
    action.cb(action.spaces[0]);
    runAllActions(game);

    expect(player.production.energy).to.eq(0);
    expect(player.production.megacredits).to.eq(-5); // should not increase
    player.playedCards.push(card);

    // add another city tile - MC prod should increase by 2 (1 from Tharsis, 1 from IC)
    game.addCity(player, game.board.getAvailableSpacesOnLand(player)[0]);
    runAllActions(game);
    expect(player.production.megacredits).to.eq(-3);
  });
});
