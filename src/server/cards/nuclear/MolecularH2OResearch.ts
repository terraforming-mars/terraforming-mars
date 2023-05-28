import {IActionCard} from '../ICard';
import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {CardResource} from '../../../common/CardResource';
import {CardName} from '../../../common/cards/CardName';
import {SelectPaymentDeferred} from '../../deferredActions/SelectPaymentDeferred';
import {CardRequirements} from '../requirements/CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {played} from '../Options';
import {Size} from '../../../common/cards/render/Size';
import {SelectCard} from '../../inputs/SelectCard';

export class MolecularH2OResearch extends Card implements IActionCard, IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.MOLECULAR_H2O_RESEARCH,
      tags: [Tag.SCIENCE, Tag.MICROBE],
      cost: 8,

      resourceType: CardResource.SCIENCE,
      victoryPoints: {resourcesHere: {}, each: 2},

      requirements: CardRequirements.builder((b) => b.oceans(3)),
      metadata: {
        cardNumber: 'N19',
        description: 'Requires 3 ocean tiles. 2 VPs per science resources on this card.',
        renderData: CardRenderer.builder((b) => {
          b.action(
            'Spend 2 M€ to reveal and discard the top card of the draw deck. If that card has a science tag, add a science resource here. If it has any other tags, add ONLY 1 microbe to another card.',
            (eb) => {
              eb.megacredits(2).startAction.microbes(1, { played }).colon(Size.SMALL).science(1).slash(Size.SMALL).wild(1, { played }).colon(Size.SMALL).microbes(1);
            }
          );
        }),
      },
    });
  }

  public canAct(player: Player): boolean {
    return player.canAfford(1);
  }
  public action(player: Player) {
    const availableCards = player.getResourceCards(CardResource.MICROBE);
    const topCard = player.game.projectDeck.draw(player.game);

    player.game.log('${0} revealed and discarded ${1}', (b) => b.player(player).card(topCard));

    if (topCard.tags.includes(Tag.MICROBE)) {
      player.addResourceTo(this, 1);
    } else if (topCard.tags.includes(Tag.MICROBE)) {
      if (availableCards.length === 0) {
        return undefined;
      }
      if (availableCards.length === 1) {
        player.addResourceTo(availableCards[0], {log: true});
        return undefined;
    }
    return new SelectCard('Select card to add microbe', 'Add resource', availableCards, ([card]) => {
      player.addResourceTo(card, {log: true});
      return undefined;
    });
  }
    player.game.projectDeck.discard(topCard);
    player.game.defer(new SelectPaymentDeferred(player, 1, {title: 'Select how to pay for action'}));
    return undefined;
  }
}

