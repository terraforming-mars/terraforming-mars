import {expect} from 'chai';
import {Resource} from '../../src/common/Resource';
import {Player} from '../../src/server/Player';
import {Units} from '../../src/common/Units';
import {testGame} from '../TestGame';
import {formatMessage} from '../TestingUtils';
import {GlobalEventName} from '../../src/common/turmoil/globalEvents/GlobalEventName';

describe('Production', () => {
  it('deduct production', () => {
    const player = new Player('blue', 'blue', false, 0, 'p-blue');

    expect(player.production.asUnits()).deep.eq({
      megacredits: 0,
      steel: 0,
      titanium: 0,
      plants: 0,
      energy: 0,
      heat: 0,
    });

    player.production.add(Resource.MEGACREDITS, 20);
    player.production.add(Resource.STEEL, 19);
    player.production.add(Resource.TITANIUM, 18);
    player.production.add(Resource.PLANTS, 17);
    player.production.add(Resource.ENERGY, 16);
    player.production.add(Resource.HEAT, 15);

    player.production.adjust(Units.of({megacredits: -10}));
    expect(player.production.asUnits()).deep.eq({
      megacredits: 10,
      steel: 19,
      titanium: 18,
      plants: 17,
      energy: 16,
      heat: 15,
    });

    player.production.adjust(Units.of({steel: -10}));
    expect(player.production.asUnits()).deep.eq({
      megacredits: 10,
      steel: 9,
      titanium: 18,
      plants: 17,
      energy: 16,
      heat: 15,
    });

    player.production.adjust(Units.of({titanium: -10}));
    expect(player.production.asUnits()).deep.eq({
      megacredits: 10,
      steel: 9,
      titanium: 8,
      plants: 17,
      energy: 16,
      heat: 15,
    });

    player.production.adjust(Units.of({plants: -10}));
    expect(player.production.asUnits()).deep.eq({
      megacredits: 10,
      steel: 9,
      titanium: 8,
      plants: 7,
      energy: 16,
      heat: 15,
    });

    player.production.adjust(Units.of({energy: -10}));
    expect(player.production.asUnits()).deep.eq({
      megacredits: 10,
      steel: 9,
      titanium: 8,
      plants: 7,
      energy: 6,
      heat: 15,
    });

    player.production.adjust(Units.of({heat: -10}));
    expect(player.production.asUnits()).deep.eq({
      megacredits: 10,
      steel: 9,
      titanium: 8,
      plants: 7,
      energy: 6,
      heat: 5,
    });
  });

  it('add logging', () => {
    const [game, player] = testGame(1);

    const log = game.gameLog;
    log.length = 0; // Empty it out.

    player.production.add(Resource.MEGACREDITS, 12, {log: false});
    expect(log).is.empty;

    player.production.add(Resource.MEGACREDITS, 12, {log: true});
    const logEntry = log[0];
    expect(formatMessage(logEntry)).eq('blue gained 12 M€ production');
  });

  it('add logging from player', () => {
    const [game, player, player2] = testGame(2);

    player.megaCredits = 5;
    player.production.add(Resource.MEGACREDITS, -5, {log: true, from: {player: player2}});

    const log = game.gameLog;
    const logEntry = log[log.length - 1];
    expect(formatMessage(logEntry)).eq('blue lost 5 M€ production because of red');
  });

  it('add logging from global event', () => {
    const [game, player] = testGame(1);

    player.production.add(Resource.MEGACREDITS, 12, {log: true, from: {globalEvent: GlobalEventName.ASTEROID_MINING}});

    const log = game.gameLog;
    const logEntry = log[log.length - 1];
    expect(formatMessage(logEntry)).eq('blue gained 12 M€ production because of Asteroid Mining');
  });

  it('add logging, stolen', () => {
    const [game, player, player2] = testGame(2);

    player.production.add(Resource.MEGACREDITS, -5, {log: true, from: {player: player2}, stealing: true});

    const log = game.gameLog;
    const logEntry = log[log.length - 1];
    expect(formatMessage(logEntry)).eq('red stole 5 M€ production from blue');
  });
});
