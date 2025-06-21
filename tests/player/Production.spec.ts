import {expect} from 'chai';
import {Resource} from '../../src/common/Resource';
import {Player} from '../../src/server/Player';
import {Units} from '../../src/common/Units';

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
});
