import {CardName} from '../../common/cards/CardName';
import {Player} from '../../Player';
import {CardType} from '../../common/cards/CardType';
import {Tags} from '../../common/cards/Tags';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {ResourceType} from '../../common/ResourceType';
import {IActionCard, IResourceCard} from '../ICard';
import {played} from '../Options';

export class LunaArchives extends Card implements IResourceCard, IActionCard {
  constructor() {
    super({
      name: CardName.LUNA_ARCHIVES,
      cardType: CardType.ACTIVE,
      tags: [Tags.SCIENCE, Tags.MOON],
      cost: 13,
      resourceType: ResourceType.SCIENCE,

      metadata: {
        cardNumber: 'M70',
        renderData: CardRenderer.builder((b) => {
          b.action('Add 1 science resource here for each Moon tag you have.',
            (ab) => ab.empty().startAction.science().slash().moon());
          b.br;
          b.effect('When playing a Moon tag, Science resources here may be used as payment, and are worth 1M€ each.',
            (eb) => eb.moon(1, {played}).startEffect.science().equals().megacredits(1));
        }),
      },
    });
  }

  public override resourceCount = 0;

  public canAct() {
    return true;
  }

  public action(player: Player) {
    const qty = player.getTagCount(Tags.MOON);
    player.addResourceTo(this, {qty, log: true});
    return undefined;
  }

  public play() {
    return undefined;
  }
}
