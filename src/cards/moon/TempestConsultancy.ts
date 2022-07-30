import {CardName} from '../../common/cards/CardName';
import {SendDelegateToArea} from '../../deferredActions/SendDelegateToArea';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardType} from '../../common/cards/CardType';
import {ICorporationCard} from '../corporation/ICorporationCard';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../../common/cards/render/Size';
import {Tags} from '../../common/cards/Tags';
import {Turmoil} from '../../turmoil/Turmoil';

export class TempestConsultancy extends Card implements ICorporationCard {
  constructor() {
    super({
      cardType: CardType.CORPORATION,
      name: CardName.TEMPEST_CONSULTANCY,
      tags: [Tags.MOON],
      startingMegaCredits: 37,
      initialActionText: 'Place 2 delegates in one party',

      metadata: {
        description: 'You start with 37 M€. As your first action, place 2 delegates in one party.',
        cardNumber: '',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(37).delegates(1).delegates(1).br;
          b.action('Place 1 delegate in any party for every 5 moon tags you have [max 3.]', (eb) => {
            eb.empty().startAction.delegates(1).text('(max 3)', Size.SMALL).slash().text('5 ').moon();
          }).br;
          b.effect('When your delegate becomes the chairman, increase your TR 1 step.', (eb) => {
            eb.chairman().startEffect.tr(1);
          });
        }),
      },
    });
  }

  public play() {
    return undefined;
  }

  public initialAction(player: Player) {
    const title = 'Tempest Consultancy first action - Select where to send two delegates';
    player.game.defer(new SendDelegateToArea(player, title, {count: 2, source: 'reserve'}));

    return undefined;
  }

  public canAct(player: Player) {
    return player.getTagCount(Tags.MOON) >= 5;
  }

  public action(player: Player) {
    let count = Math.floor(player.getTagCount(Tags.MOON) / 5);
    count = Math.min(count, 3);
    count = Math.min(count, Turmoil.getTurmoil(player.game).getAvailableDelegateCount(player.id, 'reserve'));
    if (count > 0) {
      player.game.defer(new SendDelegateToArea(
        player,
        `Select a party to send ${count} delegate(s) to`,
        {count: count, source: 'reserve'}));
    }
    return undefined;
  }
}
