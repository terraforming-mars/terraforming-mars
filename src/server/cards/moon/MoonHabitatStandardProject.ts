import {Player} from '../../Player';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {StandardProjectCard} from '../StandardProjectCard';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {PlaceMoonHabitatTile} from '../../moon/PlaceMoonHabitatTile';
import {Resources} from '../../../common/Resources';
import {TileType} from '../../../common/TileType';
import {AltSecondaryTag} from '../../../common/cards/render/AltSecondaryTag';


export class MoonHabitatStandardProject extends StandardProjectCard {
  constructor(properties = {
    name: CardName.MOON_HABITAT_STANDARD_PROJECT,
    cost: 22,
    reserveUnits: {titanium: 1},
    tr: {moonHabitat: 1},
    tilesBuilt: [TileType.MOON_HABITAT],

    metadata: {
      cardNumber: '',
      renderData: CardRenderer.builder((b) =>
        b.standardProject('Spend 22 M€ and 1 titanium to place a habitat on The Moon and raise your M€ production 1 step.', (eb) => {
          eb.megacredits(22).titanium(1).startAction.moonHabitat({secondaryTag: AltSecondaryTag.MOON_HABITAT_RATE}).production((pb) => pb.megacredits(1));
        }),
      ),
    },
  }) {
    super(properties);
  }

  protected override discount(player: Player): number {
    if (player.playedCards.find((card) => card.name === CardName.MOONCRATE_BLOCK_FACTORY)) {
      return 4;
    }
    return super.discount(player);
  }

  public override canAct(player: Player): boolean {
    const moonData = MoonExpansion.moonData(player.game);
    const spaces = moonData.moon.getAvailableSpacesOnLand(player);

    if (spaces.length === 0) {
      return false;
    }

    return super.canAct(player);
  }

  // TODO(kberg): subclass MoonCard? This is starting to show the problems with just using subclassing.
  actionEssence(player: Player): void {
    const adjustedReserveUnits = MoonExpansion.adjustedReserveCosts(player, this);
    player.deductUnits(adjustedReserveUnits);
    player.game.defer(new PlaceMoonHabitatTile(player));
    player.production.add(Resources.MEGACREDITS, 1, {log: true});
  }
}
