import {CardName} from '../../../common/cards/CardName';
import {IPlayer} from '../../IPlayer';
import {CardRenderer} from '../render/CardRenderer';
import {AltSecondaryTag} from '../../../common/cards/render/AltSecondaryTag';
import {MoonHabitatStandardProject} from './MoonHabitatStandardProject';
import {MoonMineStandardProject} from './MoonMineStandardProject';
import {MoonRoadStandardProject} from './MoonRoadStandardProject';
import {TileType} from '../../../common/TileType';

export class MoonHabitatStandardProjectVariant1 extends MoonHabitatStandardProject {
  constructor() {
    super({
      name: CardName.MOON_HABITAT_STANDARD_PROJECT_VARIANT_1,
      cost: 23,
      reserveUnits: {titanium: 1},
      tr: {moonHabitat: 1},
      tilesBuilt: [TileType.MOON_HABITAT],

      metadata: {
        cardNumber: '',
        renderData: CardRenderer.builder((b) =>
          b.standardProject('Spend 23 M€ (titanium may be used) AND 1 titanium to place a habitat on The Moon and raise your M€ production 1 step.', (eb) => {
            eb.megacredits(23).super((b) => b.titanium(1)).titanium(1).startAction.moonHabitat({secondaryTag: AltSecondaryTag.MOON_HABITAT_RATE}).production((pb) => pb.megacredits(1));
          }),
        ),
      },
    });
  }

  public override canAct(player: IPlayer) {
    return player.game.gameOptions.moonStandardProjectVariant1 && super.canAct(player);
  }

  public override canPayWith() {
    return {titanium: true};
  }
}

export class MoonMineStandardProjectVariant1 extends MoonMineStandardProject {
  constructor() {
    super({
      name: CardName.MOON_MINE_STANDARD_PROJECT_VARIANT_1,
      cost: 21,
      reserveUnits: {titanium: 1},
      tr: {moonMining: 1},
      tilesBuilt: [TileType.MOON_MINE],

      metadata: {
        cardNumber: '',
        renderData: CardRenderer.builder((b) =>
          b.standardProject('Spend 21 M€ (titanium may be used) AND 1 titanium to place a mine on The Moon, raise the mining rate 1 step, and raise steel production 1 step.', (eb) => {
            eb.megacredits(21).super((b) => b.titanium(1)).titanium(1).startAction.moonMine({secondaryTag: AltSecondaryTag.MOON_MINING_RATE}).production((pb) => pb.steel(1));
          }),
        ),
      },
    });
  }

  public override canAct(player: IPlayer) {
    return player.game.gameOptions.moonStandardProjectVariant1 && super.canAct(player);
  }

  public override canPayWith() {
    return {titanium: true};
  }
}

export class MoonRoadStandardProjectVariant1 extends MoonRoadStandardProject {
  constructor() {
    super({
      name: CardName.MOON_ROAD_STANDARD_PROJECT_VARIANT_1,
      cost: 19,
      reserveUnits: {steel: 1},
      tr: {moonLogistics: 1},
      tilesBuilt: [TileType.MOON_ROAD],

      metadata: {
        cardNumber: '',
        renderData: CardRenderer.builder((b) =>
          b.standardProject('Spend 19 M€ (steel may be used) AND 1 steel to place a road on The Moon and raise the Logistics Rate 1 step.', (eb) => {
            eb.megacredits(19).super((b) => b.steel(1)).steel(1).startAction.moonRoad({secondaryTag: AltSecondaryTag.MOON_LOGISTICS_RATE});
          }),
        ),
      },
    });
  }

  public override canAct(player: IPlayer) {
    return player.game.gameOptions.moonStandardProjectVariant1 && super.canAct(player);
  }

  public override canPayWith() {
    return {steel: true};
  }
}
