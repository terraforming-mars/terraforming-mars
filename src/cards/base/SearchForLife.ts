import {IActionCard, IResourceCard} from '../ICard';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {ResourceType} from '../../ResourceType';
import {CardName} from '../../CardName';
import {SelectHowToPayDeferred} from '../../deferredActions/SelectHowToPayDeferred';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderDynamicVictoryPoints} from '../render/CardRenderDynamicVictoryPoints';
import {max, played} from '../Options';

export class SearchForLife extends Card implements IActionCard, IProjectCard, IResourceCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.SEARCH_FOR_LIFE,
      tags: [Tags.SCIENCE],
      cost: 3,

      resourceType: ResourceType.SCIENCE,
      victoryPoints: 'special',

      requirements: CardRequirements.builder((b) => b.oxygen(6, {max})),
      metadata: {
        cardNumber: '005',
        description: 'Oxygen must be 6% or less.',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 1 M€ to reveal the top card of the draw deck. If that card has a Microbe tag, add a Science resource here.', (eb) => {
            eb.megacredits(1).startAction.microbes(1, {played}).asterix().nbsp.colon().nbsp.science();
          }).br;
          b.vpText('3 VPs if you have one or more Science resources here.');
        }),
        victoryPoints: CardRenderDynamicVictoryPoints.searchForLife(),
      },
    });
  }
    public resourceCount = 0;

    public getVictoryPoints() {
      if (this.resourceCount > 0) {
        return 3;
      }
      return 0;
    }
    public play() {
      return undefined;
    }
    public canAct(player: Player): boolean {
      return player.canAfford(1);
    }
    public action(player: Player) {
      const topCard = player.game.dealer.dealCard(player.game);

      player.game.log('${0} revealed and discarded ${1}', (b) => b.player(player).card(topCard));

      if (topCard.tags.includes(Tags.MICROBE)) {
        player.addResourceTo(this, 1);
        player.game.log('${0} found life!', (b) => b.player(player));
      }

      player.game.dealer.discard(topCard);
      player.game.defer(new SelectHowToPayDeferred(player, 1, {title: 'Select how to pay for action'}));
      return undefined;
    }
}
