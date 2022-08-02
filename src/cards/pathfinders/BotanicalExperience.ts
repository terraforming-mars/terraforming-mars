import {IProjectCard} from '../IProjectCard';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardType} from '../../common/cards/CardType';
import {CardName} from '../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {CardRequirements} from '../CardRequirements';
import {all} from '../Options';
import {Tags} from '../../common/cards/Tags';
import {Size} from '../../common/cards/render/Size';
import {ISpace} from '../../boards/ISpace';
import {Board} from '../../boards/Board';
import {CardResource} from '../../common/CardResource';
import {ICard, IResourceCard} from '../ICard';
import {Resources} from '../../common/Resources';

export class BotanicalExperience extends Card implements IProjectCard, IResourceCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.BOTANICAL_EXPERIENCE,
      cost: 14,
      tags: [Tags.PLANT, Tags.MARS, Tags.SCIENCE],
      requirements: CardRequirements.builder((b) => b.greeneries(1, {all})),
      resourceType: CardResource.DATA,

      metadata: {
        cardNumber: 'Pf50',
        renderData: CardRenderer.builder((b) => {
          b.greenery(Size.SMALL, /* withO2 */ false, /* anyPlayer */ true).colon().data({size: Size.SMALL});
          b.nbsp;
          b.data({amount: 3, digit: true}).asterix().colon().production((pb) => pb.plants(1));
          b.br;
          b.text('(EFFECT: Whenever a greenery tile is placed, add 1 data on this card.) ' +
            '(EFFECT: Whenever this card has at least 3 data, automatically remove 3 data to raise your plant production 1 step.) ' +
            '(EFFECT: Players may remove your plants, but you only lose half, rounded up.)', Size.SMALL, false, false);
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

  public onResourceAdded(player: Player, playedCard: ICard) {
    if (playedCard.name !== this.name) return;
    if (this.resourceCount >= 3) {
      const delta = Math.floor(this.resourceCount / 3);
      const deducted = delta * 3;
      this.resourceCount -= deducted;
      player.addProduction(Resources.PLANTS, delta, {log: false});
      player.game.log('${0} removed ${1} data from ${2} to increase plant production ${3} steps.',
        (b) => b.player(player).number(deducted).card(this).number(delta));
    }
  }
}
