import {IProjectCard} from '../IProjectCard';
import {IPlayer} from '../../IPlayer';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';
import {CardResource} from '../../../common/CardResource';
import {ICard} from '../ICard';
import {Units} from '../../../common/Units';
import {PathfindersExpansion} from '../../pathfinders/PathfindersExpansion';
import {AdjustProduction} from '../../deferredActions/AdjustProduction';

export class MartianRepository extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.MARTIAN_REPOSITORY,
      cost: 12,
      tags: [Tag.MARS, Tag.MARS, Tag.BUILDING],
      resourceType: CardResource.DATA,

      victoryPoints: {resourcesHere: {}, per: 3},

      metadata: {
        cardNumber: 'Pf29',
        renderData: CardRenderer.builder((b) => {
          b.effect('For every science or Mars tag you play (including these) add 1 data to this card.', (eb) => {
            eb.tag(Tag.SCIENCE).tag(Tag.MARS).startEffect.resource(CardResource.DATA);
          }).br;
          b.minus().production((pb) => pb.energy(1));
        }),
        description: 'Decrease your energy production 1 step. 1 VP for every 3 data here.',
      },
    });
  }

  public productionBox() {
    return Units.of({energy: -1});
  }

  public override bespokeCanPlay(player: IPlayer): boolean {
    // A Mars-track advance can grant +1 energy production, which offsets the cost.
    return player.production.energy >= 1 || PathfindersExpansion.willGainEnergyProductionOnNextMarsTag(player, 2);
  }

  public override bespokePlay(player: IPlayer) {
    player.game.defer(new AdjustProduction(player, this.productionBox()));
    return undefined;
  }

  public onCardPlayed(player: IPlayer, card: ICard) {
    const qty = player.tags.cardTagCount(card, Tag.SCIENCE) + player.tags.cardTagCount(card, Tag. MARS);
    if (qty > 0) {
      player.addResourceTo(this, {qty, log: true});
    }
  }

  public onNonCardTagAdded(player: IPlayer, tag: Tag) {
    if (tag === Tag.SCIENCE) {
      player.addResourceTo(this, {qty: 1, log: true});
    }
  }
}
