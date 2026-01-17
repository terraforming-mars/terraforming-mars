import {IActionCard} from '@/server/cards/ICard';
import {IProjectCard} from '@/server/cards/IProjectCard';
import {Tag} from '@/common/cards/Tag';
import {Card} from '@/server/cards/Card';
import {CardType} from '@/common/cards/CardType';
import {IPlayer} from '@/server/IPlayer';
import {CardResource} from '@/common/CardResource';
import {CardName} from '@/common/cards/CardName';
import {SelectPaymentDeferred} from '@/server/deferredActions/SelectPaymentDeferred';
import {CardRenderer} from '@/server/cards/render/CardRenderer';
import {searchForLife} from '@/server/cards/render/DynamicVictoryPoints';
import {max} from '@/server/cards/Options';
import {IdentifySpacesDeferred} from '@/server/underworld/IdentifySpacesDeferred';
import {TITLES} from '@/server/inputs/titles';
import {UnderworldExpansion} from '@/server/underworld/UnderworldExpansion';

export class SearchforLifeUnderground extends Card implements IActionCard, IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.SEARCH_FOR_LIFE_UNDERGROUND,
      tags: [Tag.SCIENCE],
      cost: 6,

      resourceType: CardResource.SCIENCE,
      victoryPoints: 'special',

      requirements: {temperature: -18, max},
      metadata: {
        cardNumber: 'U023',
        description: 'Temperature must -18° C or colder.',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 1 M€ to identify an underground resource. If it depicts at least 1 microbe, add a science resource here.', (eb) => {
            eb.megacredits(1).startAction.identify().nbsp.text(',').resource(CardResource.MICROBE).asterix().colon().nbsp.resource(CardResource.SCIENCE);
          }).br;
          b.vpText('3 VPs if you have one or more science resources here.');
        }),
        victoryPoints: searchForLife(),
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
    return player.canAfford(1) && player.game.underworldData.tokens.length > 0;
  }

  public action(player: IPlayer) {
    player.game.defer(new SelectPaymentDeferred(player, 1, {title: TITLES.payForCardAction(this.name)}))
      .andThen(() => {
        const identify = new IdentifySpacesDeferred(player, 1)
          .andThen(([space]) => {
            const undergroundResources = typeof space === 'string' ? space : space.undergroundResources;
            if (undergroundResources === undefined) {
              player.game.log('${0} had no underground resources to discard', (b) => b.player(player));
              return;
            } else if (typeof space === 'string') {
              // Put it back into the pile. It still gets evaluated.
              UnderworldExpansion.addTokens(player.game, [space]);
            }

            player.game.log('${0} revealed ${1}', (b) => b.player(player).undergroundToken(undergroundResources));
            if (['microbe1', 'microbe2', 'microbe1pertemp'].includes(undergroundResources)) {
              player.addResourceTo(this, 1);
              player.game.log('${0} found life!', (b) => b.player(player));
            }
          });
        player.game.defer(identify);
      });
    return undefined;
  }
}
