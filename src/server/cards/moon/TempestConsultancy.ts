import {CardName} from '../../../common/cards/CardName';
import {SendDelegateToArea} from '../../deferredActions/SendDelegateToArea';
import {IPlayer} from '../../IPlayer';
import {CorporationCard} from '../corporation/CorporationCard';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';
import {Tag} from '../../../common/cards/Tag';
import {Turmoil} from '../../turmoil/Turmoil';

export class TempestConsultancy extends CorporationCard {
  constructor() {
    super({
      name: CardName.TEMPEST_CONSULTANCY,
      tags: [Tag.MOON],
      startingMegaCredits: 37,

      firstAction: {
        text: 'Place 2 delegates in one party',
        turmoil: {sendDelegates: {count: 2}},
      },

      metadata: {
        description: 'You start with 37 M€. As your first action, place 2 delegates in one party.',
        cardNumber: '',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(37).delegates(1).delegates(1).br;
          b.action('Place 1 delegate in any party for every 5 Moon tags you have [max 3.]', (eb) => {
            eb.empty().startAction.delegates(1).text('(max 3)', Size.SMALL).slash().text('5 ').moon();
          }).br;
          b.effect('When your delegate becomes the chairman, increase your TR 1 step.', (eb) => {
            eb.chairman().startEffect.tr(1);
          });
        }),
      },
    });
  }

  public initialAction(player: IPlayer) {
    const title = 'Tempest Consultancy first action - Select where to send two delegates';
    player.game.defer(new SendDelegateToArea(player, title, {count: 2}));

    return undefined;
  }

  public canAct(player: IPlayer) {
    return player.tags.count(Tag.MOON) >= 5 && Turmoil.getTurmoil(player.game).getAvailableDelegateCount(player) > 0;
  }

  public action(player: IPlayer) {
    let count = Math.floor(player.tags.count(Tag.MOON) / 5);
    count = Math.min(count, 3);
    count = Math.min(count, Turmoil.getTurmoil(player.game).getAvailableDelegateCount(player));
    if (count > 0) {
      player.game.defer(new SendDelegateToArea(
        player,
        `Select a party to send ${count} delegate(s) to`,
        {count: count}));
    }
    return undefined;
  }
}
