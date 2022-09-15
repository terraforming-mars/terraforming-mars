import {expect} from 'chai';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {EconomicHelp} from '../../../src/server/cards/pathfinders/EconomicHelp';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {Units} from '../../../src/common/Units';

describe('EconomicHelp', function() {
  let card: EconomicHelp;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new EconomicHelp();
    game = newTestGame(1, {pathfindersExpansion: true, venusNextExtension: true});
    player = getTestPlayer(game, 0);
  });

  it('Play - one lowest influence tracks', function() {
    expect(player.production.asUnits()).deep.eq(Units.EMPTY);
    game.pathfindersData = {
      venus: 0,
      earth: 1,
      mars: 1,
      jovian: 1,
      moon: -1,
      vps: [],
    };

    card.play(player);

    expect(player.production.asUnits()).deep.eq(Units.of({megacredits: 1}));
    expect(game.pathfindersData).deep.eq({
      venus: 3,
      earth: 1,
      mars: 1,
      jovian: 1,
      moon: -1,
      vps: [],
    });
  });

  it('Play - two lowest influence tracks', function() {
    game.pathfindersData = {
      venus: 2,
      earth: 1,
      mars: 1,
      jovian: 2,
      moon: -1,
      vps: [],
    };

    card.play(player);

    expect(game.pathfindersData).deep.eq({
      venus: 2,
      earth: 3,
      mars: 3,
      jovian: 2,
      moon: -1,
      vps: [],
    });
  });

  it('Play - all influence tracks tied', function() {
    expect(game.pathfindersData).deep.eq({
      venus: 0,
      earth: 0,
      mars: 0,
      jovian: 0,
      moon: -1,
      vps: [],
    });

    card.play(player);

    expect(game.pathfindersData).deep.eq({
      venus: 2,
      earth: 2,
      mars: 2,
      jovian: 2,
      moon: -1,
      vps: [],
    });
  });

  it('Play - ignore maximized tracks', function() {
    game.pathfindersData = {
      venus: 18,
      earth: 18,
      mars: 18,
      jovian: 15,
      moon: -1,
      vps: [],
    };

    card.play(player);

    expect(game.pathfindersData).deep.eq({
      venus: 18,
      earth: 21,
      mars: 18,
      jovian: 15,
      moon: -1,
      vps: [],
    });
  });
});
