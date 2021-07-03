import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {Tags} from '../Tags';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {ResourceType} from '../../ResourceType';
import {IActionCard, IResourceCard} from '../ICard';

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
            (eb) => eb.moon().played.startEffect.science().equals().megacredits(1));
        }),
      },
    });
  };

  public resourceCount = 0;

  public canAct() {
    return true;
  }

  public action(player: Player) {
    const count = player.getTagCount(Tags.MOON);
    player.addResourceTo(this, {qty: count, log: true});
    return undefined;
  }

  public play() {
    return undefined;
  }
}
