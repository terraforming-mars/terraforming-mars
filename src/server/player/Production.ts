import {CardName} from '../../common/cards/CardName';
import {GlobalEventName} from '../../common/turmoil/globalEvents/GlobalEventName';
import {LawSuit} from '../cards/promo/LawSuit';
import {Manutech} from '../cards/venusNext/Manutech';
import {IPlayer} from '../IPlayer';
import {Resource} from '../../common/Resource';
import {Units} from '../../common/Units';

export class Production {
  private units: Units;
  private player: IPlayer;

  constructor(player: IPlayer, units: Units = Units.EMPTY) {
    this.player = player;
    this.units = Units.of(units);
  }
  public get megacredits() {
    return this.units.megacredits;
  }
  public get steel() {
    return this.units.steel;
  }
  public get titanium() {
    return this.units.titanium;
  }
  public get plants() {
    return this.units.plants;
  }
  public get energy() {
    return this.units.energy;
  }
  public get heat() {
    return this.units.heat;
  }

  public get(resource: Resource): number {
    return this.units[resource];
  }

  public override(units: Partial<Units>) {
    this.units = Units.of({...units});
  }

  public asUnits(): Units {
    return {...this.units};
  }

  public add(
    resource: Resource,
    amount : number,
    options? : { log: boolean, from? : IPlayer | GlobalEventName, stealing?: boolean},
  ) {
    const adj = resource === Resource.MEGACREDITS ? -5 : 0;
    const delta = (amount >= 0) ? amount : Math.max(amount, -(this.units[resource] - adj));
    this.units[resource] += delta;

    if (options?.log === true) {
      this.player.logUnitDelta(resource, amount, 'production', options.from, options.stealing);
    }

    const from = options?.from;
    if (typeof(from) === 'object') {
      LawSuit.resourceHook(this.player, resource, delta, from);
    }

    // Mons Insurance hook
    if (options?.from !== undefined && delta < 0 && (typeof(from) === 'object' && from.id !== this.player.id)) {
      this.player.resolveInsurance();
    }

    // Manutech hook
    if (this.player.isCorporation(CardName.MANUTECH)) {
      Manutech.onProductionGain(this.player, resource, amount);
    }
  }

  public canAdjust(units: Units): boolean {
    return this.units.megacredits + units.megacredits >= -5 &&
      this.units.steel + units.steel >= 0 &&
      this.units.titanium + units.titanium >= 0 &&
      this.units.plants + units.plants >= 0 &&
      this.units.energy + units.energy >= 0 &&
      this.units.heat + units.heat >= 0;
  }

  public adjust(units: Units, options?: {log: boolean, from?: IPlayer}) {
    if (units.megacredits !== 0) {
      this.add(Resource.MEGACREDITS, units.megacredits, options);
    }

    if (units.steel !== 0) {
      this.add(Resource.STEEL, units.steel, options);
    }

    if (units.titanium !== 0) {
      this.add(Resource.TITANIUM, units.titanium, options);
    }

    if (units.plants !== 0) {
      this.add(Resource.PLANTS, units.plants, options);
    }

    if (units.energy !== 0) {
      this.add(Resource.ENERGY, units.energy, options);
    }

    if (units.heat !== 0) {
      this.add(Resource.HEAT, units.heat, options);
    }
  }
}
