import {CardName} from '../../../common/cards/CardName';
import {Player} from '../../Player';
import {Tag} from '../../../common/cards/Tag';
import {PreludeCard} from '../prelude/PreludeCard';
import {DrawCards} from '../../deferredActions/DrawCards';
import {CardRenderer} from '../render/CardRenderer';
import {IProjectCard} from '../IProjectCard';

export class LunarPlanningOffice extends PreludeCard implements IProjectCard {
  constructor() {
    super({
      name: CardName.LUNAR_PlANNING_OFFICE,
      tags: [Tag.MOON, Tag.BUILDING],

      metadata: {
        description: 'Draw 2 cards with Moon tag. Gain 6 steel.',
        cardNumber: '',
        renderData: CardRenderer.builder((b) => {
          b.cards(2, {secondaryTag: Tag.MOON}).br.steel(6);
        }),
      },
    });
  }

  public override bespokePlay(player: Player) {
    player.steel += 6;
    player.game.defer(DrawCards.keepAll(player, 2, {tag: Tag.MOON}));
    return undefined;
  }
}
