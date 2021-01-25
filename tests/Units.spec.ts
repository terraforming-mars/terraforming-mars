import {expect} from 'chai';
import {Player} from '../src/Player';
import {Resources} from '../src/Resources';
import {Units} from '../src/Units';
import {TestPlayers} from './TestingUtils';

describe('Units', () => {
  it('of', () => {
    expect(Units.of({})).deep.eq({
      megacredits: 0,
      steel: 0,
      titanium: 0,
      plants: 0,
      energy: 0,
      heat: 0,
    });

    expect(Units.of({megacredits: 1})).deep.eq({
      megacredits: 1,
      steel: 0,
      titanium: 0,
      plants: 0,
      energy: 0,
      heat: 0,
    });

    expect(Units.of({steel: 1})).deep.eq({
      megacredits: 0,
      steel: 1,
      titanium: 0,
      plants: 0,
      energy: 0,
      heat: 0,
    });

    expect(Units.of({titanium: 1})).deep.eq({
      megacredits: 0,
      steel: 0,
      titanium: 1,
      plants: 0,
      energy: 0,
      heat: 0,
    });

    expect(Units.of({plants: 1})).deep.eq({
      megacredits: 0,
      steel: 0,
      titanium: 0,
      plants: 1,
      energy: 0,
      heat: 0,
    });

    expect(Units.of({energy: 1})).deep.eq({
      megacredits: 0,
      steel: 0,
      titanium: 0,
      plants: 0,
      energy: 1,
      heat: 0,
    });

    expect(Units.of({heat: 1})).deep.eq({
      megacredits: 0,
      steel: 0,
      titanium: 0,
      plants: 0,
      energy: 0,
      heat: 1,
    });
  });

  it('has units', () => {
    const player = TestPlayers.BLUE.newPlayer();

    const units: Units = Units.of({});
    expect(Units.hasUnits(units, player)).is.true;

    units.megacredits = 1;
    expect(Units.hasUnits(units, player)).is.false;
    player.megaCredits = 1;
    expect(Units.hasUnits(units, player)).is.true;

    units.steel = 1;
    expect(Units.hasUnits(units, player)).is.false;
    player.steel = 1;
    expect(Units.hasUnits(units, player)).is.true;

    units.titanium = 1;
    expect(Units.hasUnits(units, player)).is.false;
    player.titanium = 1;
    expect(Units.hasUnits(units, player)).is.true;

    units.plants = 1;
    expect(Units.hasUnits(units, player)).is.false;
    player.plants = 1;
    expect(Units.hasUnits(units, player)).is.true;

    units.energy = 1;
    expect(Units.hasUnits(units, player)).is.false;
    player.energy = 1;
    expect(Units.hasUnits(units, player)).is.true;

    units.heat = 1;
    expect(Units.hasUnits(units, player)).is.false;
    player.heat = 1;
    expect(Units.hasUnits(units, player)).is.true;
  });


  it('deduct units', () => {
    function asUnits(player: Player): Units {
      return {
        megacredits: player.megaCredits,
        steel: player.steel,
        titanium: player.titanium,
        plants: player.plants,
        energy: player.energy,
        heat: player.heat,
      };
    };

    const player = TestPlayers.BLUE.newPlayer();

    expect(asUnits(player)).deep.eq({
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

    Units.deductUnits(Units.of({megacredits: 10}), player);
    expect(asUnits(player)).deep.eq({
      megacredits: 10,
      steel: 19,
      titanium: 18,
      plants: 17,
      energy: 16,
      heat: 15,
    });

    Units.deductUnits(Units.of({steel: 10}), player);
    expect(asUnits(player)).deep.eq({
      megacredits: 10,
      steel: 9,
      titanium: 18,
      plants: 17,
      energy: 16,
      heat: 15,
    });

    Units.deductUnits(Units.of({titanium: 10}), player);
    expect(asUnits(player)).deep.eq({
      megacredits: 10,
      steel: 9,
      titanium: 8,
      plants: 17,
      energy: 16,
      heat: 15,
    });

    Units.deductUnits(Units.of({plants: 10}), player);
    expect(asUnits(player)).deep.eq({
      megacredits: 10,
      steel: 9,
      titanium: 8,
      plants: 7,
      energy: 16,
      heat: 15,
    });

    Units.deductUnits(Units.of({energy: 10}), player);
    expect(asUnits(player)).deep.eq({
      megacredits: 10,
      steel: 9,
      titanium: 8,
      plants: 7,
      energy: 6,
      heat: 15,
    });

    Units.deductUnits(Units.of({heat: 10}), player);
    expect(asUnits(player)).deep.eq({
      megacredits: 10,
      steel: 9,
      titanium: 8,
      plants: 7,
      energy: 6,
      heat: 5,
    });
  });

  it('deduct production', () => {
    function asProductionUnits(player: Player): Units {
      return {
        megacredits: player.getProduction(Resources.MEGACREDITS),
        steel: player.getProduction(Resources.STEEL),
        titanium: player.getProduction(Resources.TITANIUM),
        plants: player.getProduction(Resources.PLANTS),
        energy: player.getProduction(Resources.ENERGY),
        heat: player.getProduction(Resources.HEAT),
      };
    };

    const player = TestPlayers.BLUE.newPlayer();

    expect(asProductionUnits(player)).deep.eq({
      megacredits: 0,
      steel: 0,
      titanium: 0,
      plants: 0,
      energy: 0,
      heat: 0,
    });

    player.setProductionForTest({
      megacredits: 20,
      steel: 19,
      titanium: 18,
      plants: 17,
      energy: 16,
      heat: 15,
    });

    Units.adjustProduction(Units.of({megacredits: -10}), player);
    expect(asProductionUnits(player)).deep.eq({
      megacredits: 10,
      steel: 19,
      titanium: 18,
      plants: 17,
      energy: 16,
      heat: 15,
    });

    Units.adjustProduction(Units.of({steel: -10}), player);
    expect(asProductionUnits(player)).deep.eq({
      megacredits: 10,
      steel: 9,
      titanium: 18,
      plants: 17,
      energy: 16,
      heat: 15,
    });

    Units.adjustProduction(Units.of({titanium: -10}), player);
    expect(asProductionUnits(player)).deep.eq({
      megacredits: 10,
      steel: 9,
      titanium: 8,
      plants: 17,
      energy: 16,
      heat: 15,
    });

    Units.adjustProduction(Units.of({plants: -10}), player);
    expect(asProductionUnits(player)).deep.eq({
      megacredits: 10,
      steel: 9,
      titanium: 8,
      plants: 7,
      energy: 16,
      heat: 15,
    });

    Units.adjustProduction(Units.of({energy: -10}), player);
    expect(asProductionUnits(player)).deep.eq({
      megacredits: 10,
      steel: 9,
      titanium: 8,
      plants: 7,
      energy: 6,
      heat: 15,
    });

    Units.adjustProduction(Units.of({heat: -10}), player);
    expect(asProductionUnits(player)).deep.eq({
      megacredits: 10,
      steel: 9,
      titanium: 8,
      plants: 7,
      energy: 6,
      heat: 5,
    });
  });
});
