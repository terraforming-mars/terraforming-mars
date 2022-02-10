import {IProjectCard} from '../IProjectCard';
import {Player} from '../../Player';
import {Card} from '../Card';
import {VictoryPoints} from '../ICard';
import {CardType} from '../../common/cards/CardType';
import {CardName} from '../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tags} from '../../common/cards/Tags';
import {Resources} from '../../common/Resources';
import {ResourceType} from '../../common/ResourceType';
import {Units} from '../../common/Units';
import {ICard} from '../ICard';
import {played} from '../Options';

export class MartianRepository extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.MARTIAN_REPOSITORY,
      cost: 12,
      tags: [Tags.MARS, Tags.MARS, Tags.BUILDING],
      resourceType: ResourceType.DATA,
      productionBox: Units.of({energy: -1}),
      victoryPoints: VictoryPoints.resource(1, 3),

      metadata: {
        cardNumber: 'Pf29',
        renderData: CardRenderer.builder((b) => {
          b.effect('For every science or Mars tag you play (including these) add 1 data to this card.', (eb) => {
            eb.science(1, {played}).mars(1, {played}).startEffect.data();
          }).br;
          b.minus().production((pb) => pb.energy(1));
        }),
        description: 'Decrease your energy production 1 step. 1 VP for every 3 data here.',
      },
    });
  }

  public override resourceCount = 0;

  public onCardPlayed(player: Player, card: ICard) {
    const qty = card.tags.filter((tag) => tag === Tags.SCIENCE || tag === Tags.MARS).length;
    if (qty > 0) player.addResourceTo(this, {qty, log: true});
  }

  public override canPlay(player: Player) {
    return player.getProduction(Resources.ENERGY) > 0;
  }

  public play(player: Player) {
    player.addProduction(Resources.ENERGY, -1);
    return undefined;
  }
}
