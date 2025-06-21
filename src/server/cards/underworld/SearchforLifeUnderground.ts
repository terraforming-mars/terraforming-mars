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
import {searchForLife} from '../render/DynamicVictoryPoints';
import {max} from '../Options';
import {IdentifySpacesDeferred} from '../../underworld/IdentifySpacesDeferred';
import {undergroundResourceTokenDescription} from '../../../common/underworld/UndergroundResourceToken';
import {TITLES} from '../../inputs/titles';

// TODO(kberg): Copies a lot of Search For Life.
export class SearchforLifeUnderground extends Card implements IActionCard, IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.SEARCH_FOR_LIFE_UNDERGROUND,
      tags: [Tag.MARS, Tag.SCIENCE],
      cost: 6,

      resourceType: CardResource.SCIENCE,
      victoryPoints: 'special',

      requirements: {temperature: -18, max},
      metadata: {
        cardNumber: 'U23',
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
    return player.canAfford(1);
  }
  public action(player: IPlayer) {
    player.game.defer(new SelectPaymentDeferred(player, 1, {title: TITLES.payForCardAction(this.name)}))
      .andThen(() => {
        const identify = new IdentifySpacesDeferred(player, 1);
        player.game.defer(identify);
        identify.andThen(([space]) => {
          const undergroundResources = space.undergroundResources;
          if (undergroundResources === undefined) {
            player.game.log('${0} had no underground resources to discard', (b) => b.player(player));
            return;
          }
          player.game.log('${0} revealed ${1}', (b) => b.player(player).string(undergroundResourceTokenDescription[undergroundResources]));
          if (['microbe1', 'microbe2', 'microbe1pertemp'].includes(undergroundResources)) {
            player.addResourceTo(this, 1);
            player.game.log('${0} found life!', (b) => b.player(player));
          }
        });
      });
    return undefined;
  }
}
