import {IActionCard} from '../ICard';
import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {IPlayer} from '../../IPlayer';
import {CardResource} from '../../../common/CardResource';
import {CardName} from '../../../common/cards/CardName';
import {SelectPaymentDeferred} from '../../deferredActions/SelectPaymentDeferred';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderDynamicVictoryPoints} from '../render/CardRenderDynamicVictoryPoints';
import {max} from '../Options';
import {TITLES} from '../../inputs/titles';

export class SearchForLife extends Card implements IActionCard, IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.SEARCH_FOR_LIFE,
      tags: [Tag.SCIENCE],
      cost: 3,

      resourceType: CardResource.SCIENCE,
      victoryPoints: 'special',

      requirements: {oxygen: 6, max},
      metadata: {
        cardNumber: '005',
        description: 'Oxygen must be 6% or less.',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 1 M€ to reveal the top card of the draw deck. If that card has a microbe tag, add a science resource here.', (eb) => {
            eb.megacredits(1).startAction.tag(Tag.MICROBE).asterix().nbsp.colon().nbsp.resource(CardResource.SCIENCE);
          }).br;
          b.vpText('3 VPs if you have one or more science resources here.');
        }),
        victoryPoints: CardRenderDynamicVictoryPoints.searchForLife(),
      },
    });
  }

  public override getVictoryPoints() {
    if (this.resourceCount > 0) {
      return 3;
    }
    return 0;
  }
  public canAct(player: IPlayer): boolean {
    return player.canAfford(1) && player.game.projectDeck.canDraw(1);
  }

  public action(player: IPlayer) {
    player.game.defer(new SelectPaymentDeferred(player, 1, {title: TITLES.payForCardAction(this.name)}))
      .andThen(() => {
        const card = player.game.projectDeck.drawOrThrow(player.game);
        player.game.log('${0} revealed and discarded ${1}', (b) => b.player(player).card(card, {tags: true}));
        if (card.tags.includes(Tag.MICROBE)) {
          player.addResourceTo(this, 1);
          player.game.log('${0} found life!', (b) => b.player(player));
        }

        player.game.projectDeck.discard(card);
      });

    return undefined;
  }
}
