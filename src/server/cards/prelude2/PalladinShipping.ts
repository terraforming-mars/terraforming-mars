import {CorporationCard} from '../corporation/CorporationCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {digit} from '../Options';
import {IPlayer} from '../../IPlayer';
import {Resource} from '../../../common/Resource';
import {IActionCard, ICard} from '../ICard';
import {Behavior} from '../../behavior/Behavior';
import {getBehaviorExecutor} from '../../behavior/BehaviorExecutor';
import {ICorporationCard} from '../corporation/ICorporationCard';
import {Size} from '../../../common/cards/render/Size';

export class PalladinShipping extends CorporationCard implements ICorporationCard, IActionCard {
  constructor() {
    super({
      name: CardName.PALLADIN_SHIPPING,
      tags: [Tag.SPACE],
      startingMegaCredits: 36,

      behavior: {
        stock: {titanium: 5},
      },

      metadata: {
        cardNumber: 'PC02', // Renumber
        renderData: CardRenderer.builder((b) => {
          b.megacredits(36).titanium(5, {digit}).br;
          b.corpBox('effect-action', (cea) => {
            cea.vSpace(Size.LARGE);
            cea.effect('When you play a space event, gain 1 titanium.', (eb) => {
              eb.tag(Tag.SPACE).tag(Tag.EVENT).startEffect.titanium(1);
            });
            b.br;
            cea.action('Spend 2 titanium to raise the temperature 1 step.', (ab) => {
              ab.titanium(2).startAction.temperature(1);
            });
          });
        }),
        description: 'You start with 36 M€. Gain 5 titanium.',
      },
    });
  }

  public onCardPlayedForCorps(player: IPlayer, card: ICard) {
    if (card.type === CardType.EVENT && card.tags.includes(Tag.SPACE)) {
      player.stock.add(Resource.TITANIUM, 1, {log: true});
    }
  }

  public canAct(player: IPlayer) {
    return getBehaviorExecutor().canExecute(PalladinShipping.actionBehavior, player, this);
  }

  private static actionBehavior: Behavior = {
    spend: {titanium: 2},
    global: {temperature: 1},
  };

  public action(player: IPlayer) {
    getBehaviorExecutor().execute(PalladinShipping.actionBehavior, player, this);
    return undefined;
  }
}
