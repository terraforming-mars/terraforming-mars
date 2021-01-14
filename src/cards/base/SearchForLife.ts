import {IActionCard, IResourceCard} from '../ICard';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {ResourceType} from '../../ResourceType';
import {CardName} from '../../CardName';
import {SelectHowToPayDeferred} from '../../deferredActions/SelectHowToPayDeferred';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderDynamicVictoryPoints} from '../render/CardRenderDynamicVictoryPoints';

export class SearchForLife extends Card implements IActionCard, IProjectCard, IResourceCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.SEARCH_FOR_LIFE,
      tags: [Tags.SCIENCE],
      cost: 3,
      resourceType: ResourceType.SCIENCE,

      metadata: {
        cardNumber: '005',
        requirements: CardRequirements.builder((b) => b.oxygen(6).max()),
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 1 MC to reveal the top card of the draw deck. If that card has a Microbe tag, add a Science resource here.', (eb) => {
            eb.megacredits(1).startAction.microbes(1).played.asterix().nbsp.colon().nbsp.science();
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
    public action(player: Player, game: Game) {
      const topCard = game.dealer.dealCard();
      if (topCard.tags.indexOf(Tags.MICROBE) !== -1) {
        this.resourceCount++;
        game.log('${0} found life!', (b) => b.player(player));
      }

      game.log('${0} revealed and discarded ${1}', (b) => b.player(player).card(topCard));

      game.dealer.discard(topCard);
      game.defer(new SelectHowToPayDeferred(player, 1, {title: 'Select how to pay for action'}));
      return undefined;
    }
}
