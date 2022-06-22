import {CardName} from '../../common/cards/CardName';
import {Player} from '../../Player';
import {Units} from '../../common/Units';
import {CardRenderer} from '../render/CardRenderer';
import {AltSecondaryTag} from '../../common/cards/render/AltSecondaryTag';
import {MoonColonyStandardProject} from './MoonColonyStandardProject';
import {MoonMineStandardProject} from './MoonMineStandardProject';
import {MoonRoadStandardProject} from './MoonRoadStandardProject';

export class MoonColonyStandardProjectVariant2 extends MoonColonyStandardProject {
  constructor() {
    super({
      name: CardName.MOON_COLONY_STANDARD_PROJECT_V2,
      cost: 26,
      reserveUnits: Units.EMPTY,
      tr: {moonColony: 1},

      metadata: {
        cardNumber: '',
        renderData: CardRenderer.builder((b) =>
          b.standardProject('Spend 26 M€ place a colony on the moon and raise your M€ production 1 step.', (eb) => {
            eb.megacredits(26).startAction.moonColony({secondaryTag: AltSecondaryTag.MOON_COLONY_RATE}).production((pb) => pb.megacredits(1));
          }),
        ),
      },
    });
  }

  public override canAct(player: Player) {
    return player.game.gameOptions.moonStandardProjectVariant && super.canAct(player);
  }
}

export class MoonMineStandardProjectVariant2 extends MoonMineStandardProject {
  constructor() {
    super({
      name: CardName.MOON_MINE_STANDARD_PROJECT_V2,
      cost: 23,
      reserveUnits: Units.EMPTY,
      tr: {moonMining: 1},

      metadata: {
        cardNumber: '',
        renderData: CardRenderer.builder((b) =>
          b.standardProject('Spend 23 M€ to place a mine on the moon, raise the Mining Rate 1 step, and raise steel production 1 step.', (eb) => {
            eb.megacredits(23).startAction.moonMine({secondaryTag: AltSecondaryTag.MOON_MINING_RATE}).production((pb) => pb.steel(1));
          }),
        ),
      },
    });
  }

  public override canAct(player: Player) {
    return player.game.gameOptions.moonStandardProjectVariant && super.canAct(player);
  }
}

export class MoonRoadStandardProjectVariant2 extends MoonRoadStandardProject {
  constructor() {
    super({
      name: CardName.MOON_ROAD_STANDARD_PROJECT_V2,
      cost: 21,
      reserveUnits: Units.EMPTY,
      tr: {moonLogistics: 1},

      metadata: {
        cardNumber: '',
        renderData: CardRenderer.builder((b) =>
          b.standardProject('Spend 21 M€ place a road on the moon and raise the Logistics Rate 1 step.', (eb) => {
            eb.megacredits(21).startAction.moonRoad({secondaryTag: AltSecondaryTag.MOON_LOGISTICS_RATE});
          }),
        ),
      },
    });
  }

  public override canAct(player: Player) {
    return player.game.gameOptions.moonStandardProjectVariant && super.canAct(player);
  }
}
