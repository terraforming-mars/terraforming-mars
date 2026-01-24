import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {ALL_TAGS, Tag} from '../../../common/cards/Tag';
import {IPlayer} from '../../IPlayer';
import {inplaceRemove} from '../../../common/utils/utils';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {Priority} from '../../deferredActions/Priority';

export class UndergroundResearchCenter extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.UNDERGROUND_RESEARCH_CENTER,
      tags: [Tag.WILD, Tag.BUILDING],
      cost: 12,

      requirements: {undergroundTokens: 4},
      behavior: {
        underworld: {excavate: {count: 1}},
      },

      metadata: {
        cardNumber: 'U062',
        renderData: CardRenderer.builder((b) => {
          // TODO(kberg): can this look like an any tag superscript thing?
          b.excavate().cards(1).asterix();
        }),

        description: 'Requires you have 4 underground tokens. ' +
        'Excavate an underground resource. Choose a tag that is not the wild tag or clone tag. ' +
        'Draw a card with that tag.',
      },
    });
  }

  private chooseTagsAndDraw(player: IPlayer) {
    const tags = [...ALL_TAGS];
    inplaceRemove(tags, Tag.WILD);
    inplaceRemove(tags, Tag.CLONE);

    const options = tags.map((tag) => {
      return new SelectOption(tag).andThen(() => {
        player.drawCard(1, {tag: tag});
        return undefined;
      });
    });
    return new OrOptions(...options);
  }

  public override bespokePlay(player: IPlayer) {
    // Priority is set below the excavation action, so they can choose cards after excavating.
    player.defer(this.chooseTagsAndDraw(player), Priority.DEFAULT);
    return undefined;
  }
}
