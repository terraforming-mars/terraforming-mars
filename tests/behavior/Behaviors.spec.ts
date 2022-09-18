import {expect} from 'chai';
import {Game} from '../../src/server/Game';
import {Player} from '../../src/server/Player';
import {TestPlayer} from '../TestPlayer';
import {getTestPlayer, newTestGame} from '../TestGame';
import {Behaviors} from '../../src/server/behavior/Behaviors';
import {Units} from '../../src/common/Units';
import {Payment} from '../../src/common/inputs/Payment';
import {Resources} from '../../src/common/Resources';

function asUnits(player: Player): Units {
  return {
    megacredits: player.megaCredits,
    steel: player.steel,
    titanium: player.titanium,
    plants: player.plants,
    energy: player.energy,
    heat: player.heat,
  };
}

describe('Behaviors', () => {
  let game: Game;
  let player: TestPlayer;
  // let player2: TestPlayer;

  beforeEach(() => {
    game = newTestGame(2);
    player = getTestPlayer(game, 0);
    // player2 = getTestPlayer(game, 1);
  });

  it('production - simple', () => {
    expect(player.production.asUnits()).deep.eq(Units.EMPTY);
    Behaviors.execute({production: {megacredits: 2}}, player);
    expect(player.production.asUnits()).deep.eq(Units.of({megacredits: 2}));
  });

  it('production - negative', () => {
    const behavior = {production: {megacredits: 2, steel: -1}};
    expect(player.production.asUnits()).deep.eq(Units.EMPTY);

    expect(Behaviors.canExecute(behavior, player)).is.false;

    player.production.add(Resources.STEEL, 1);

    expect(Behaviors.canExecute(behavior, player)).is.true;

    Behaviors.execute(behavior, player);
    expect(player.production.asUnits()).deep.eq(Units.of({megacredits: 2, steel: 0}));
  });

  it('production - simple', () => {
    expect(player.production.asUnits()).deep.eq(Units.EMPTY);
    Behaviors.execute({production: {megacredits: 2}}, player);
    expect(player.production.asUnits()).deep.eq(Units.of({megacredits: 2}));
  });

  it('stock - simple', () => {
    player.steel = 2;
    player.heat = 5;
    Behaviors.execute({stock: {steel: 3, heat: 2}}, player);
    expect(asUnits(player)).deep.eq(Units.of({steel: 5, heat: 7}));
  });

  it('steelValue', () => {
    expect(player.payingAmount(Payment.of({steel: 4}), {steel: true})).eq(8);
    Behaviors.execute({steelValue: 1}, player);
    expect(player.payingAmount(Payment.of({steel: 4}), {steel: true})).eq(12);
    Behaviors.onDiscard({steelValue: 1}, player);
    expect(player.payingAmount(Payment.of({steel: 4}), {steel: true})).eq(8);
  });

  it('titaniumValue', () => {
    expect(player.payingAmount(Payment.of({titanium: 4}), {titanium: true})).eq(12);
    Behaviors.execute({titanumValue: 1}, player);
    expect(player.payingAmount(Payment.of({titanium: 4}), {titanium: true})).eq(16);
    Behaviors.onDiscard({titanumValue: 1}, player);
    expect(player.payingAmount(Payment.of({titanium: 4}), {titanium: true})).eq(12);
  });

  it('greeneryDiscount', () => {
    player.plants = 8;
    expect(game.canPlaceGreenery(player)).is.true;

    player.plants = 7;
    expect(game.canPlaceGreenery(player)).is.false;

    Behaviors.execute({greeneryDiscount: 1}, player);
    expect(game.canPlaceGreenery(player)).is.true;

    player.plants = 6;
    expect(game.canPlaceGreenery(player)).is.false;

    Behaviors.execute({greeneryDiscount: 1}, player);
    expect(game.canPlaceGreenery(player)).is.true;

    Behaviors.onDiscard({greeneryDiscount: 1}, player);
    expect(game.canPlaceGreenery(player)).is.false;

    player.plants = 7;
    expect(game.canPlaceGreenery(player)).is.true;
  });
});
