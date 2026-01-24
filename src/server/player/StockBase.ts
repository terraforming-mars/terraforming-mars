import {Resource} from '../../common/Resource';
import {Units} from '../../common/Units';
import {IPlayer} from '../IPlayer';
import {From} from '../logs/From';

export abstract class BaseStock {
  public megacredits: number = 0;
  public steel: number = 0;
  public titanium: number = 0;
  public plants: number = 0;
  public energy: number = 0;
  public heat: number = 0;

  protected player: IPlayer;
  protected minMegacredits: number;

  constructor(player: IPlayer, minMegacredits: number = 0) {
    this.player = player;
    this.minMegacredits = minMegacredits;
  }

  public get(resource: Resource): number {
    return this[resource];
  }

  public override(units: Partial<Units>) {
    this.megacredits = units.megacredits ?? 0;
    this.steel = units.steel ?? 0;
    this.titanium = units.titanium ?? 0;
    this.plants = units.plants ?? 0;
    this.energy = units.energy ?? 0;
    this.heat = units.heat ?? 0;
  }

  public asUnits(): Units {
    return Units.of(this);
  }

  /**
   * Almost the opposite of |canAdjust| but the units here are negatives of units for canAdjust.
   */
  public has(units: Units): boolean {
    return this.megacredits >= units.megacredits &&
      this.steel >= units.steel &&
      this.titanium >= units.titanium &&
      this.plants >= units.plants &&
      this.energy >= units.energy &&
      this.heat >= units.heat;
  }

  /**
   * Almost the opposite of |has| but takes into account that min megacredits can be -5
   * and that the units here are negatives of units for has.
   */
  public canAdjust(units: Units): boolean {
    return this.megacredits + units.megacredits >= this.minMegacredits &&
      this.steel + units.steel >= 0 &&
      this.titanium + units.titanium >= 0 &&
      this.plants + units.plants >= 0 &&
      this.energy + units.energy >= 0 &&
      this.heat + units.heat >= 0;
  }

  public deduct(
    resource: Resource,
    amount: number,
    options? : {
      log?: boolean,
      from? : From,
      stealing?: boolean
    }) {
    this.add(resource, -amount, options);
  }

  public abstract add(
    resource: Resource,
    amount : number,
    options? : {log?: boolean, from? : From, stealing?: boolean},
  ): void;

  public adjust(units: Units, options?: {log?: boolean, from?: From}) {
    if (units.megacredits !== undefined) {
      this.add(Resource.MEGACREDITS, units.megacredits, options);
    }

    if (units.steel !== undefined) {
      this.add(Resource.STEEL, units.steel, options);
    }

    if (units.titanium !== undefined) {
      this.add(Resource.TITANIUM, units.titanium, options);
    }

    if (units.plants !== undefined) {
      this.add(Resource.PLANTS, units.plants, options);
    }

    if (units.energy !== undefined) {
      this.add(Resource.ENERGY, units.energy, options);
    }

    if (units.heat !== undefined) {
      this.add(Resource.HEAT, units.heat, options);
    }
  }

  public deductUnits(units: Units) {
    this.deduct(Resource.MEGACREDITS, units.megacredits);
    this.deduct(Resource.STEEL, units.steel);
    this.deduct(Resource.TITANIUM, units.titanium);
    this.deduct(Resource.PLANTS, units.plants);
    this.deduct(Resource.ENERGY, units.energy);
    this.deduct(Resource.HEAT, units.heat);
  }

  protected logUnitDelta(
    resource: Resource,
    amount: number,
    production: boolean,
    from: From | undefined,
    stealing = false,
  ) {
    if (amount === 0) {
      // Logging zero units doesn't seem to happen
      return;
    }

    // 1. Peter gained 5 MC
    // 2. Peter gained 5 MC from Robotic Workforce
    // 3. Peter gained 5 MC production
    // 4. Peter gained 5 MC production beacuse of Robotic Workforce

    // 5. Peter lost 5 MC
    // 6. Peter lost 5 MC from Robotic Workforce
    // 7. Peter lost 5 MC production
    // 8. Peter lost 5 MC production beacuse of Robotic Workforce

    // 9. Peter lost 1 MC production, stolen by Alan

    const singular: Record<Resource, string> = {
      [Resource.MEGACREDITS]: 'M€',
      [Resource.STEEL]: 'steel',
      [Resource.TITANIUM]: 'titanium',
      [Resource.PLANTS]: 'plant',
      [Resource.ENERGY]: 'energy',
      [Resource.HEAT]: 'heat',
    };

    let resourceString = singular[resource];
    if (resource === Resource.PLANTS && production === false && Math.abs(amount) > 1) {
      resourceString = 'plants';
    }
    const modifier = amount > 0 ? 'gained' : 'lost';
    let message = production ?
      '${0} ' + modifier + ' ${1} ${2} production' :
      '${0} ' + modifier + ' ${1} ${2}';
      //  You   lost           1   plant production

    if (from !== undefined) {
      if (stealing === true) {
        message = production ?
          '${3} stole ${1} ${2} production from ${0}' :
          '${3} stole ${1} ${2} from ${0}';
      } else {
        message = message + ' because of ${3}';
      }
    }

    this.player.game.log(message, (b) => {
      b.player(this.player)
        .number(Math.abs(amount))
        .string(resourceString);

      if (from !== undefined) {
        b.from(from);
      }
    });
  }
}
