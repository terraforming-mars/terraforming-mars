import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {Tags} from '../Tags';
import {PreludeCard} from '../prelude/PreludeCard';
import {DrawCards} from '../../deferredActions/DrawCards';
import {CardRenderer} from '../render/CardRenderer';
import {IProjectCard} from '../IProjectCard';

export class LunarPlanningOffice extends PreludeCard implements IProjectCard {
  constructor() {
    super({
      name: CardName.LUNAR_PlANNING_OFFICE,
      tags: [Tags.MOON, Tags.BUILDING],

      metadata: {
        description: 'Draw 2 cards with Moon tag. Gain 6 steel.',
        cardNumber: '',
        renderData: CardRenderer.builder((b) => {
          b.cards(2, {secondaryTag: Tags.MOON}).br.steel(6);
        }),
      },
    });
  }

  public play(player: Player) {
    player.steel += 6;
    player.game.defer(DrawCards.keepAll(player, 2, {tag: Tags.MOON}));
    return undefined;
  }
}
