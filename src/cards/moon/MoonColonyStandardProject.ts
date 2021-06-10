import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {StandardProjectCard} from '../StandardProjectCard';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {PlaceMoonColonyTile} from '../../moon/PlaceMoonColonyTile';
import {Units} from '../../Units';
import {Resources} from '../../Resources';
import {IMoonCard} from './IMoonCard';
import {TileType} from '../../TileType';
import {AltSecondaryTag} from '../render/CardRenderItem';

export class MoonColonyStandardProject extends StandardProjectCard implements IMoonCard {
  constructor() {
    super({
      name: CardName.MOON_COLONY_STANDARD_PROJECT,
      cost: 22,
      reserveUnits: Units.of({titanium: 1}),

      metadata: {
        cardNumber: '',
        renderData: CardRenderer.builder((b) =>
          b.standardProject('Spend 22 M€ and 1 titanium to place a colony on the moon and raise your M€ production 1 step.', (eb) => {
            eb.megacredits(22).titanium(1).startAction.moonColony().secondaryTag(AltSecondaryTag.MOON_COLONY_RATE).production((pb) => pb.megacredits(1));
          }),
        ),
      },
    });
  }

  public tilesBuilt = [TileType.MOON_COLONY];

  protected discount(player: Player): number {
    if (player.playedCards.find((card) => card.name === CardName.MOONCRATE_BLOCK_FACTORY)) {
      return 4;
    }
    return super.discount(player);
  }

  public canAct(player: Player): boolean {
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
    player.game.defer(new PlaceMoonColonyTile(player));
    player.addProduction(Resources.MEGACREDITS, 1, {log: true});
  }
}
