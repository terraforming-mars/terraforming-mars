import {CardName} from '../../CardName';
import {SendDelegateToArea} from '../../deferredActions/SendDelegateToArea';
import {Player} from '../../Player';
import {CardMetadata} from '../CardMetadata';
import {CardType} from '../CardType';
import {CorporationCard} from '../corporation/CorporationCard';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderItemSize} from '../render/CardRenderItemSize';
import {Tags} from '../Tags';

export class TempestConsultancy implements CorporationCard {
  public name = CardName.TEMPEST_CONSULTANCY;
  public tags = [Tags.MOON];
  public startingMegaCredits: number = 37;
  public cardType = CardType.CORPORATION;
  public requirements: undefined;

  public play() {
    return undefined;
  }

  public initialActionText: string = 'Place 2 delegates in one party';
  public initialAction(player: Player) {
    if (player.game.turmoil) {
      const title = 'Tempest Consultancy first action - Select where to send two delegates';
      player.game.defer(new SendDelegateToArea(player, title, {count: 2, source: 'reserve'}));
    }

    return undefined;
  }

  public canAct(player: Player) {
    return player.getTagCount(Tags.MOON) >= 5;
  }

  public action(player: Player) {
    let count = Math.floor(player.getTagCount(Tags.MOON) / 5);
    count = Math.min(count, 3);
    player.game.defer(new SendDelegateToArea(
      player,
      `Select a party to send ${count} delegate(s) to`,
      {count: count, source: 'reserve'}));

    return undefined;
  }

  public readonly metadata: CardMetadata = {
    description: 'You start with 37 MC. As your first action, place 2 delegates in one party.',
    cardNumber: '',
    renderData: CardRenderer.builder((b) => {
      b.megacredits(37).delegates(1).delegates(1).br;
      b.action('Place 1 delegate in any party for every 5 moon tags you have [max 3.]', (eb) => {
        eb.empty().startAction.delegates(1).text('(max 3)', CardRenderItemSize.SMALL).slash().text('5 ').moon();
      }).br;
      b.effect('When your delegate becomes the chairman, increase your TR 1 step.', (eb) => {
        eb.chairman().startEffect.tr(1);
      });
    }),
  };
}
