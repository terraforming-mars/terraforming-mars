import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {CardName} from '../../../common/cards/CardName';
import {Resources} from '../../../common/Resources';
import {ColonyName} from '../../../common/colonies/ColonyName';
import {BuildColony} from '../../deferredActions/BuildColony';
import {CardRenderer} from '../render/CardRenderer';
import {CardRequirements} from '../CardRequirements';
import {Card} from '../Card';
import {max} from '../Options';

export class PioneerSettlement extends Card implements IProjectCard {
  constructor() {
    super({
      cost: 13,
      tags: [Tag.SPACE],
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

  public override bespokeCanPlay(player: Player): boolean {
    if (player.colonies.getPlayableColonies().length === 0) {
      return false;
    }

    let lunaIsAvailable = false;
    let coloniesCount = 0;
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

    const megaCreditsProduction = player.production.megacredits;
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

  public override bespokePlay(player: Player) {
    const openColonies = player.production.megacredits <= -4 ?
      player.game.colonies.filter((colony) => colony.name === ColonyName.LUNA) :
      undefined;
    player.game.defer(new BuildColony(player, {title: 'Select colony for Pioneer Settlement', colonies: openColonies}));
    player.production.add(Resources.MEGACREDITS, -2);
    return undefined;
  }
}
