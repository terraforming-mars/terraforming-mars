import {CardName} from '../../../common/cards/CardName';
import {Player} from '../../Player';
import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';
import {PartyName} from '../../../common/turmoil/PartyName';
import {CardRequirements} from '../CardRequirements';
import {Card} from '../Card';
import {all} from '../Options';

export class WeGrowAsOne extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.WE_GROW_AS_ONE,
      cardType: CardType.EVENT,
      tags: [Tag.SPACE],
      cost: 8,
      requirements: CardRequirements.builder((b) => b.party(PartyName.UNITY)),

      metadata: {
        description: 'Requires that Unity are ruling or that you have 2 delegates there. ' +
        'Increase ALL colony tile tracks 1 step. ' +
        'Increase each colony tile track 1 step if you have a colony on that colony tile.',
        cardNumber: 'M59',
        renderData: CardRenderer.builder((b) => {
          b.placeColony({all}).text('+1').br;
          b.colonies(1).asterix().slash().placeColony().text('+1');
        }),
      },
    });
  }

  public override bespokePlay(player: Player) {
    player.game.colonies.forEach((colony) => {
      if (colony.colonies.includes(player.id)) {
        colony.increaseTrack(2);
      } else {
        colony.increaseTrack(1);
      }
    });
    return undefined;
  }
}
