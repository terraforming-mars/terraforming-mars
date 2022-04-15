import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {Card} from '../Card';
import {CardType} from '../../common/cards/CardType';
import {Player} from '../../Player';

import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {CardName} from '../../common/cards/CardName';
import {CardResource} from '../../common/CardResource';
import {DeferredAction} from '../../deferredActions/DeferredAction';
import {CardRenderer} from '../render/CardRenderer';
import {played} from '../Options';

export class ViralEnhancers extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.VIRAL_ENHANCERS,
      tags: [Tags.SCIENCE, Tags.MICROBE],
      cost: 9,

      metadata: {
        cardNumber: '074',
        renderData: CardRenderer.builder((b) => {
          // TODO (chosta): find a way to have an effect on two rows
          b.plants(1, {played}).slash().microbes(1, {played}).slash().animals(1, {played}).br;
          b.effect('When you play a Plant, Microbe, or an Animal tag, including this, gain 1 plant or add 1 resource to THAT CARD.', (eb) => {
            eb.empty().startEffect;
            eb.plants(1).slash().microbes(1).asterix().slash().animals(1).asterix();
          });
        }),
      },
    });
  }
  public onCardPlayed(player: Player, card: IProjectCard) {
    const resourceCount = card.tags.filter((tag) => tag === Tags.ANIMAL || tag === Tags.PLANT || tag === Tags.MICROBE).length;
    if (resourceCount === 0) {
      return undefined;
    }

    if (card.resourceType !== CardResource.ANIMAL && card.resourceType !== CardResource.MICROBE) {
      player.plants += resourceCount;
      return undefined;
    }

    for (let i = 0; i < resourceCount; i++) {
      player.game.defer(new DeferredAction(
        player,
        () => new OrOptions(
          new SelectOption('Add resource to card ' + card.name, 'Add resource', () => {
            player.addResourceTo(card);
            return undefined;
          }),
          new SelectOption('Gain plant', 'Save', () => {
            player.plants++;
            return undefined;
          }),
        ),
      ));
    }
    return undefined;
  }

  public play() {
    return undefined;
  }
}
