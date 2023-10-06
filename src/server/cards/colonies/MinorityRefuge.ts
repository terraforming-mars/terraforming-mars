import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {IPlayer} from '../../IPlayer';
import {CardName} from '../../../common/cards/CardName';
import {Resource} from '../../../common/Resource';
import {ColonyName} from '../../../common/colonies/ColonyName';
import {BuildColony} from '../../deferredActions/BuildColony';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';

export class MinorityRefuge extends Card implements IProjectCard {
  constructor() {
    super({
      cost: 5,
      tags: [Tag.SPACE],
      name: CardName.MINORITY_REFUGE,
      type: CardType.AUTOMATED,

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

  public override bespokeCanPlay(player: IPlayer): boolean {
    if (player.colonies.getPlayableColonies().length === 0) {
      return false;
    }

    const megaCreditsProduction = player.production.megacredits;
    if (megaCreditsProduction === -4 && player.isCorporation(CardName.POSEIDON)) {
      return true;
    } else if (megaCreditsProduction <= -4) {
      const lunaIsAvailable = player.game.colonies.some((colony) =>
        colony.name === ColonyName.LUNA &&
        colony.isFull() === false &&
        colony.colonies.includes(player.id) === false);

      if (lunaIsAvailable === false) {
        return false;
      }
      this.warning = 'You will only be able to build the colony on Luna.';
    }

    return true;
  }

  public override bespokePlay(player: IPlayer) {
    const openColonies = player.production.megacredits <= -4 ?
      player.game.colonies.filter((colony) => colony.name === ColonyName.LUNA) :
      undefined;
    player.game.defer(
      new BuildColony(
        player, {
          title: 'Select colony for Minority Refuge',
          colonies: openColonies,
        }))
      .andThen(() => player.production.add(Resource.MEGACREDITS, -2));
    return undefined;
  }
}
