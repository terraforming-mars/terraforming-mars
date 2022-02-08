import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {CardType} from '../../common/cards/CardType';
import {Player} from '../../Player';
import {CardName} from '../../common/cards/CardName';
import {Resources} from '../../common/Resources';
import {ColonyName} from '../../common/colonies/ColonyName';
import {BuildColony} from '../../deferredActions/BuildColony';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';

export class MinorityRefuge extends Card implements IProjectCard {
  constructor() {
    super({
      cost: 5,
      tags: [Tags.SPACE],
      name: CardName.MINORITY_REFUGE,
      cardType: CardType.AUTOMATED,

      metadata: {
        cardNumber: 'C26',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.megacredits(-2)).colonies(1);
        }),
        description: 'Decrease your M€ production 2 steps. Place a colony.',
      },
    });
  }

  public warning?: string;

  public override canPlay(player: Player): boolean {
    if (player.hasAvailableColonyTileToBuildOn() === false) {
      return false;
    }

    const megaCreditsProduction = player.getProduction(Resources.MEGACREDITS);
    if (megaCreditsProduction === -4 && player.isCorporation(CardName.POSEIDON)) {
      return true;
    } else if (megaCreditsProduction <= -4) {
      const lunaIsAvailable = player.game.colonies.some((colony) =>
        colony.name === ColonyName.LUNA &&
        colony.isColonyFull() === false &&
        colony.colonies.includes(player.id) === false);

      if (lunaIsAvailable === false) {
        return false;
      }
      this.warning = 'You will only be able to build the colony on Luna.';
    }

    return true;
  }

  public play(player: Player) {
    const openColonies = player.getProduction(Resources.MEGACREDITS) <= -4 ?
      player.game.colonies.filter((colony) => colony.name === ColonyName.LUNA) :
      undefined;
    player.game.defer(new BuildColony(player, false, 'Select colony for Minority Refuge', openColonies));
    player.addProduction(Resources.MEGACREDITS, -2);
    return undefined;
  }
}
