import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {CardResource} from '../../../common/CardResource';
import {SelectCard} from '../../inputs/SelectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {played} from '../Options';
import {IProjectCard} from '../IProjectCard';

export class HydrogenToVenus extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.HYDROGEN_TO_VENUS,
      cardType: CardType.EVENT,
      tags: [Tag.SPACE],
      cost: 11,

      behavior: {
        global: {venus: 1},
      },

      metadata: {
        cardNumber: '231',
        renderData: CardRenderer.builder((b) => {
          b.venus(1).br.br; // double br is intentional for visual appeal
          b.floaters(1, {secondaryTag: Tag.VENUS}).slash().jovian({played});
        }),
        description: 'Raise Venus 1 step. Add 1 floater to A Venus CARD for each Jovian tag you have.',
      },
    });
  }

  public override bespokePlay(player: Player) {
    const jovianTags = player.tags.count(Tag.JOVIAN);
    const floatersCards = player.getResourceCards(CardResource.FLOATER).filter((card) => card.tags.includes(Tag.VENUS));
    if (jovianTags > 0) {
      if (floatersCards.length === 1) {
        player.addResourceTo(floatersCards[0], {qty: jovianTags, log: true});
      }
      if (floatersCards.length > 1) {
        return new SelectCard(
          'Select card to add ' + jovianTags + ' floater(s)',
          'Add floater(s)',
          floatersCards,
          ([card]) => {
            player.addResourceTo(card, {qty: jovianTags, log: true});
            return undefined;
          },
        );
      }
    }
    return undefined;
  }
}
