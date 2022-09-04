import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {PartyName} from '../../../common/turmoil/PartyName';
import {Resources} from '../../../common/Resources';
import {SimpleDeferredAction} from '../../deferredActions/DeferredAction';
import {CardRenderer} from '../render/CardRenderer';
import {CardRequirements} from '../CardRequirements';
import {played} from '../Options';

export class GMOContract extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.GMO_CONTRACT,
      tags: [Tag.MICROBE, Tag.SCIENCE],
      cost: 3,

      requirements: CardRequirements.builder((b) => b.party(PartyName.GREENS)),
      metadata: {
        description: 'Requires that Greens are ruling or that you have 2 delegates there.',
        cardNumber: 'T06',
        renderData: CardRenderer.builder((b) => {
          b.effect('Each time you play a plant, animal or microbe tag, including this, gain 2 M€.', (be) => {
            be.animals(1, {played}).slash().plants(1, {played}).slash().microbes(1, {played});
            be.startEffect.megacredits(2);
          });
        }),
      },
    });
  }

  public onCardPlayed(player: Player, card: IProjectCard): void {
    const amount = card.tags.filter((tag) => tag === Tag.ANIMAL || tag === Tag.PLANT || tag === Tag.MICROBE).length;
    if (amount > 0) {
      player.game.defer(
        new SimpleDeferredAction(player, () => {
          player.addResource(Resources.MEGACREDITS, amount * 2, {log: true});
          return undefined;
        }),
      );
    }
  }
}
