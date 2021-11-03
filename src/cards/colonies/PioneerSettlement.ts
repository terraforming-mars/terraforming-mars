import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {Resources} from '../../Resources';
import {ColonyName} from '../../colonies/ColonyName';
import {BuildColony} from '../../deferredActions/BuildColony';
import {CardRenderer} from '../render/CardRenderer';
import {CardRequirements} from '../CardRequirements';
import {Card} from '../Card';
import {max} from '../Options';

export class PioneerSettlement extends Card implements IProjectCard {
  constructor() {
    super({
      cost: 13,
      tags: [Tags.SPACE],
      name: CardName.PIONEER_SETTLEMENT,
      cardType: CardType.AUTOMATED,
      requirements: CardRequirements.builder((b) => b.colonies(1, {max})),
      victoryPoints: 2,

      metadata: {
        cardNumber: 'C29',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.megacredits(-2));
          b.nbsp.colonies(1);
        }),
        description: 'Requires that you have no more than 1 colony. Decrease your M€ production 2 steps. Place a colony.',
      },
    });
  }

  public warning?: string;

  public canPlay(player: Player): boolean {
    if (player.hasAvailableColonyTileToBuildOn() === false) {
      return false;
    }

    let lunaIsAvailable = false;
    let coloniesCount: number = 0;
    const hasOneColonyMax = player.game.colonies.every((colony) => {
      if (colony.name === ColonyName.LUNA &&
          colony.isColonyFull() === false &&
          colony.colonies.includes(player.id) === false) {
        lunaIsAvailable = true;
      }
      coloniesCount += colony.colonies.filter((owner) => owner === player.id).length;
      if (coloniesCount > 1) {
        return false;
      }
      return true;
    });

    if (hasOneColonyMax === false) {
      return false;
    }

    const megaCreditsProduction = player.getProduction(Resources.MEGACREDITS);
    if (megaCreditsProduction === -4 && player.isCorporation(CardName.POSEIDON)) {
      return true;
    } else if (megaCreditsProduction <= -4) {
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
    player.game.defer(new BuildColony(player, false, 'Select colony for Pioneer Settlement', openColonies));
    player.addProduction(Resources.MEGACREDITS, -2);
    return undefined;
  }
}
