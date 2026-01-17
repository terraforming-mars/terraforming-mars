import {CardName} from '@/common/cards/CardName';
import {CardRenderer} from '@/server/cards/render/CardRenderer';
import {Tag} from '@/common/cards/Tag';
import {IProjectCard} from '@/server/cards/IProjectCard';
import {CardType} from '@/common/cards/CardType';
import {ActionCard} from '@/server/cards/ActionCard';
import {IPlayer} from '@/server/IPlayer';
import {CardResource} from '@/common/CardResource';
import {ICard} from '@/server/cards/ICard';

export class TitanManufacturingColony extends ActionCard implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.TITAN_MANUFACTURING_COLONY,
      cost: 18,
      tags: [Tag.JOVIAN, Tag.SPACE, Tag.BUILDING],
      resourceType: CardResource.TOOL,

      action: {
        spend: {resourcesHere: 1},
        underworld: {excavate: 1},
      },

      metadata: {
        cardNumber: 'U044',
        renderData: CardRenderer.builder((b) => {
          b.effect('Whenever you play a Jovian tag, (including this one), add 1 tool resource on this card.',
            (ab) => ab.tag(Tag.JOVIAN).startEffect.resource(CardResource.TOOL)).br;
          b.action('Spend 1 tool resource on this card to excavate an underground resource.',
            (ab) => ab.resource(CardResource.TOOL).startAction.excavate(1));
        }),
      },
    });
  }

  onCardPlayed(player: IPlayer, card: ICard): undefined {
    const count = card.tags.filter((tag) => tag === Tag.JOVIAN).length;
    player.addResourceTo(this, {qty: count, log: true});
    return undefined;
  }
}

