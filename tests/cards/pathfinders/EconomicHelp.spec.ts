import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {EconomicHelp} from '../../../src/server/cards/pathfinders/EconomicHelp';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {Units} from '../../../src/common/Units';

describe('EconomicHelp', function() {
  let card: EconomicHelp;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(function() {
    card = new EconomicHelp();
    [game, player] = testGame(1, {pathfindersExpansion: true, venusNextExtension: true});
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
      venus: 17, // At the maximum
      earth: 18, // Max is 22
      mars: 17, // At the maximmum
      jovian: 14, // At the maximum
      moon: -1,
      vps: [],
    };

    card.play(player);

    expect(game.pathfindersData).deep.eq({
      venus: 17,
      earth: 21,
      mars: 17,
      jovian: 14,
      moon: -1,
      vps: [],
    });
  });

  // Economic Help does not correctly raise a planetary influence track when
  // the relevant (lowest) non-completed track is higher than any other already
  // completed track. Example: A non-completed Moon track will not be raised
  // if it is higher than a completed Jovian track.
});
