import {CardName} from '../../../common/cards/CardName';
import {Player} from '../../Player';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {CardResource} from '../../../common/CardResource';
import {IActionCard} from '../ICard';
import {played} from '../Options';

export class LunaArchives extends Card implements IActionCard {
  constructor() {
    super({
      name: CardName.LUNA_ARCHIVES,
      cardType: CardType.ACTIVE,
      tags: [Tag.SCIENCE, Tag.MOON],
      cost: 13,
      resourceType: CardResource.SCIENCE,

      metadata: {
        cardNumber: 'M69',
        renderData: CardRenderer.builder((b) => {
          b.action('Add 1 science resource here for each Moon tag you have.',
            (ab) => ab.empty().startAction.science().slash().moon());
          b.br;
          b.effect('When playing a Moon tag, science resources here may be used as payment, and are worth 1M€ each.',
            (eb) => eb.moon(1, {played}).startEffect.science().equals().megacredits(1));
        }),
      },
    });
  }

  public canAct() {
    return true;
  }

  public action(player: Player) {
    const qty = player.tags.count(Tag.MOON);
    player.addResourceTo(this, {qty, log: true});
    return undefined;
  }
}
