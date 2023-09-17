import {Card} from '../Card';
import {ICorporationCard} from '../corporation/ICorporationCard';
import {Tag} from '../../../common/cards/Tag';
import {IPlayer} from '../../IPlayer';
import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {CardRenderer} from '../render/CardRenderer';
import {CardResource} from '../../../common/CardResource';
import {IActionCard} from '../ICard';
import {played} from '../Options';

export class KuiperCooperative extends Card implements ICorporationCard, IActionCard {
  constructor() {
    super({
      type: CardType.CORPORATION,
      name: CardName.KUIPER_COOPERATIVE,
      tags: [Tag.SPACE, Tag.SPACE],
      startingMegaCredits: 33,
      resourceType: CardResource.ASTEROID,

      behavior: {
        production: {titanium: 1},
      },

      metadata: {
        cardNumber: '',
        description: 'You start with 33 M€. Increase titanium production 1 step.',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(33).production((pb) => pb.titanium(1)).br;
          b.action('Add 1 asteroid here for every space tag you have.', (ab) => {
            ab.empty().startAction.asteroids(1).slash().space({played});
          }).br;
          b.effect('When you use the AQUIFER or ASTEROID standard projects, you can spend asteroids on card as 1M€ each.', (eb) => {
            eb.text('standard project').asterix().startEffect.asteroids(1).equals().megacredits(1);
          });
        }),
      },
    });
  }

  public action(player: IPlayer) {
    player.addResourceTo(this, {qty: player.tags.count(Tag.SPACE), log: true});
    return undefined;
  }

  public canAct(): boolean {
    return true;
  }
}
