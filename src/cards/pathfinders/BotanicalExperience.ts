import {IProjectCard} from '../IProjectCard';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {CardRequirements} from '../CardRequirements';
import {all} from '../Options';
import {Tags} from '../Tags';
import {Size} from '../render/Size';
import {ISpace} from '../../boards/ISpace';
import {Board} from '../../boards/Board';
import {ResourceType} from '../../common/ResourceType';
import {IResourceCard} from '../ICard';

export class BotanicalExperience extends Card implements IProjectCard, IResourceCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.BOTANICAL_EXPERIENCE,
      cost: 14,
      tags: [Tags.PLANT, Tags.MARS, Tags.SCIENCE],
      requirements: CardRequirements.builder((b) => b.greeneries(1, {all})),
      resourceType: ResourceType.DATA,

      metadata: {
        cardNumber: 'Pf50',
        renderData: CardRenderer.builder((b) => {
          b.effect(
          'Whenever a greenery tile is placed, add 1 data on this card.',
          (b) => b.greenery().startEffect.data());
          b.br;
          b.effect(
            'Whenever this card has at least 3 data, automatically remove 3 daya to rause your plant production 1 step.',
            (b) => b.data().data().data().asterix().startEffect.production((pb) => pb.plants(1)));
            b.br;
            b.text('(Effect: Players may remove your plants, but you only lose half, rounded up.)', Size.SMALL, false, false);
        }),
        description: 'Requires one greenery tile on Mars.',
      },
    });
  }

  public override resourceCount = 0;

  public onTilePlaced(cardOwner: Player, _activePlayer: Player, space: ISpace) {
    if (Board.isGreenerySpace(space)) {
      cardOwner.addResourceTo(this, 1);
    }
  }

  public play() {
    return undefined;
  }
}
