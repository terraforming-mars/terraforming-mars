import {expect} from 'chai';
import {Resource} from '../../src/common/Resource';
import {Player} from '../../src/server/Player';
import {Color} from '../../src/common/Color';
import {formatMessage, testGame} from '../TestingUtils';
import {Units} from '../../src/common/Units';
import {GlobalEventName} from '../../src/common/turmoil/globalEvents/GlobalEventName';

describe('Stock', function() {
  it('has units', () => {
    const player = new Player('blue', Color.BLUE, false, 0, 'p-blue');
    const stock = player.stock;

    const units: Units = Units.of({});
    expect(stock.has(units)).is.true;

    units.megacredits = 1;
    expect(stock.has(units)).is.false;
    stock.megacredits = 1;
    expect(stock.has(units)).is.true;

    units.steel = 1;
    expect(stock.has(units)).is.false;
    stock.steel = 1;
    expect(stock.has(units)).is.true;

    units.titanium = 1;
    expect(stock.has(units)).is.false;
    stock.titanium = 1;
    expect(stock.has(units)).is.true;

    units.plants = 1;
    expect(stock.has(units)).is.false;
    stock.plants = 1;
    expect(stock.has(units)).is.true;

    units.energy = 1;
    expect(stock.has(units)).is.false;
    stock.energy = 1;
    expect(stock.has(units)).is.true;

    units.heat = 1;
    expect(stock.has(units)).is.false;
    stock.heat = 1;
    expect(stock.has(units)).is.true;
  });


  it('addUnits', () => {
    const player = new Player('blue', Color.BLUE, false, 0, 'p-blue');

    expect(player.stock.asUnits()).deep.eq({
      megacredits: 0,
      steel: 0,
      titanium: 0,
      plants: 0,
      energy: 0,
      heat: 0,
    });

    player.megaCredits = 20;
    player.steel = 19;
    player.titanium = 18;
    player.plants = 17;
    player.energy = 16;
    player.heat = 15;

    player.stock.addUnits(Units.of({megacredits: 10}));
    expect(player.stock.asUnits()).deep.eq({
      megacredits: 30,
      steel: 19,
      titanium: 18,
      plants: 17,
      energy: 16,
      heat: 15,
    });

    player.stock.addUnits(Units.of({steel: 10}));
    expect(player.stock.asUnits()).deep.eq({
      megacredits: 30,
      steel: 29,
      titanium: 18,
      plants: 17,
      energy: 16,
      heat: 15,
    });

    player.stock.addUnits(Units.of({titanium: 10}));
    expect(player.stock.asUnits()).deep.eq({
      megacredits: 30,
      steel: 29,
      titanium: 28,
      plants: 17,
      energy: 16,
      heat: 15,
    });

    player.stock.addUnits(Units.of({plants: 10}));
    expect(player.stock.asUnits()).deep.eq({
      megacredits: 30,
      steel: 29,
      titanium: 28,
      plants: 27,
      energy: 16,
      heat: 15,
    });

    player.stock.addUnits(Units.of({energy: 10}));
    expect(player.stock.asUnits()).deep.eq({
      megacredits: 30,
      steel: 29,
      titanium: 28,
      plants: 27,
      energy: 26,
      heat: 15,
    });

    player.stock.addUnits(Units.of({heat: 10}));
    expect(player.stock.asUnits()).deep.eq({
      megacredits: 30,
      steel: 29,
      titanium: 28,
      plants: 27,
      energy: 26,
      heat: 25,
    });
  });

  it('deduct units', () => {
    const player = new Player('blue', Color.BLUE, false, 0, 'p-blue');

    expect(player.stock.asUnits()).deep.eq({
      megacredits: 0,
      steel: 0,
      titanium: 0,
      plants: 0,
      energy: 0,
      heat: 0,
    });

    player.megaCredits = 20;
    player.steel = 19;
    player.titanium = 18;
    player.plants = 17;
    player.energy = 16;
    player.heat = 15;

    player.stock.deductUnits(Units.of({megacredits: 10}));
    expect(player.stock.asUnits()).deep.eq({
      megacredits: 10,
      steel: 19,
      titanium: 18,
      plants: 17,
      energy: 16,
      heat: 15,
    });

    player.stock.deductUnits(Units.of({steel: 10}));
    expect(player.stock.asUnits()).deep.eq({
      megacredits: 10,
      steel: 9,
      titanium: 18,
      plants: 17,
      energy: 16,
      heat: 15,
    });

    player.stock.deductUnits(Units.of({titanium: 10}));
    expect(player.stock.asUnits()).deep.eq({
      megacredits: 10,
      steel: 9,
      titanium: 8,
      plants: 17,
      energy: 16,
      heat: 15,
    });

    player.stock.deductUnits(Units.of({plants: 10}));
    expect(player.stock.asUnits()).deep.eq({
      megacredits: 10,
      steel: 9,
      titanium: 8,
      plants: 7,
      energy: 16,
      heat: 15,
    });

    player.stock.deductUnits(Units.of({energy: 10}));
    expect(player.stock.asUnits()).deep.eq({
      megacredits: 10,
      steel: 9,
      titanium: 8,
      plants: 7,
      energy: 6,
      heat: 15,
    });

    player.stock.deductUnits(Units.of({heat: 10}));
    expect(player.stock.asUnits()).deep.eq({
      megacredits: 10,
      steel: 9,
      titanium: 8,
      plants: 7,
      energy: 6,
      heat: 5,
    });
  });

  it('adds resources', () => {
    const [/* game */, player] = testGame(1);
    player.megaCredits = 10;
    // adds any positive amount
    player.stock.add(Resource.MEGACREDITS, 12);
    expect(player.megaCredits).eq(22);
    // removes more than we have
    player.stock.add(Resource.MEGACREDITS, -23);
    expect(player.megaCredits).eq(0);
    // adds any positive amount
    player.stock.add(Resource.MEGACREDITS, 5);
    expect(player.megaCredits).eq(5);
    // removes less than we have
    player.stock.add(Resource.MEGACREDITS, -4);
    expect(player.megaCredits).eq(1);
    // makes no change
    player.stock.add(Resource.MEGACREDITS, 0);
    expect(player.megaCredits).eq(1);
  });

  it('addResource logging', () => {
    const [game, player] = testGame(1);

    const log = game.gameLog;
    log.length = 0; // Empty it out.

    player.stock.add(Resource.MEGACREDITS, 12, {log: false});
    expect(log).is.empty;

    player.stock.add(Resource.MEGACREDITS, 12, {log: true});
    const logEntry = log[0];
    expect(formatMessage(logEntry)).eq('blue\'s megacredits amount increased by 12');
  });

  it('addResource logging from player', () => {
    const [game, player, player2] = testGame(2);

    player.megaCredits = 5;
    player.stock.add(Resource.MEGACREDITS, -5, {log: true, from: player2});

    const log = game.gameLog;
    const logEntry = log[log.length - 1];
    expect(formatMessage(logEntry)).eq('blue\'s megacredits amount decreased by 5 by red');
  });

  it('addResource logging from global event', () => {
    const [game, player] = testGame(1);

    player.stock.add(Resource.MEGACREDITS, 12, {log: true, from: GlobalEventName.ASTEROID_MINING});

    const log = game.gameLog;
    const logEntry = log[log.length - 1];
    expect(formatMessage(logEntry)).eq('blue\'s megacredits amount increased by 12 by Asteroid Mining');
  });

  it('addResource logs error when deducting too much', () => {
    const [/* game */, player] = testGame(1);

    player.megaCredits = 10;
    const warn = console.warn;
    const consoleLog: Array<Array<any>> = [];
    console.warn = (message?: any, ...optionalParams: any[]) => {
      consoleLog.push([message, optionalParams]);
    };
    player.stock.add(Resource.MEGACREDITS, -12);
    console.warn = warn;

    expect(consoleLog.length).eq(1);
    expect(consoleLog[0][0]).eq('Illegal state: Adjusting -12 megacredits when player has 10');
    expect(JSON.parse(consoleLog[0][1])).deep.eq(
      {
        'gameId': 'game-id',
        'lastSaveId': 0,
        'logAge': 7,
        'currentPlayer': 'p-player1-id',
        'metadata': {
          'player': {
            'color': 'blue',
            'id': 'p-player1-id',
            'name': 'player1',
          },
          'resource': 'megacredits',
          'amount': -12,
        },
      });
  });
});
