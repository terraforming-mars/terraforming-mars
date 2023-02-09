import {CardName} from '../../common/cards/CardName';
import {GlobalEventName} from '../../common/turmoil/globalEvents/GlobalEventName';
import {LawSuit} from '../cards/promo/LawSuit';
import {Manutech} from '../cards/venusNext/Manutech';
import {Player} from '../Player';
import {Resources} from '../../common/Resources';
import {Units} from '../../common/Units';

export class Production {
  private units: Units;
  private player: Player;

  constructor(player: Player, units: Units = Units.EMPTY) {
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

  public get(resource: Resources): number {
    return this.units[resource];
  }

  public override(units: Partial<Units>) {
    this.units = Units.of({...units});
  }

  public asUnits(): Units {
    return {...this.units};
  }

  public add(
    resource: Resources,
    amount : number,
    options? : { log: boolean, from? : Player | GlobalEventName, stealing?: boolean},
  ) {
    const adj = resource === Resources.MEGACREDITS ? -5 : 0;
    const delta = (amount >= 0) ? amount : Math.max(amount, -(this.units[resource] - adj));
    this.units[resource] += delta;

    if (options?.log === true) {
      this.player.logUnitDelta(resource, amount, 'production', options.from, options.stealing);
    }

    if (options?.from instanceof Player) {
      LawSuit.resourceHook(this.player, resource, delta, options.from);
    }

    // Mons Insurance hook
    if (options?.from !== undefined && delta < 0 && (options.from instanceof Player && options.from.id !== this.player.id)) {
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

  public adjust(units: Units, options?: {log: boolean, from?: Player}) {
    if (units.megacredits !== undefined) {
      this.add(Resources.MEGACREDITS, units.megacredits, options);
    }

    if (units.steel !== undefined) {
      this.add(Resources.STEEL, units.steel, options);
    }

    if (units.titanium !== undefined) {
      this.add(Resources.TITANIUM, units.titanium, options);
    }

    if (units.plants !== undefined) {
      this.add(Resources.PLANTS, units.plants, options);
    }

    if (units.energy !== undefined) {
      this.add(Resources.ENERGY, units.energy, options);
    }

    if (units.heat !== undefined) {
      this.add(Resources.HEAT, units.heat, options);
    }
  }
}
