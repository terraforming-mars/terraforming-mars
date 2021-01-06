import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {CardRequirements} from '../CardRequirements';
import {GlobalParameter} from '../../GlobalParameter';

export class Shuttles extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.SHUTTLES,
      tags: [Tags.SPACE],
      cost: 10,
      metadata: {
        cardNumber: '166',
        requirements: CardRequirements.builder((b) => b.oxygen(5)),
        renderData: CardRenderer.builder((b) => {
          b.effectBox((eb) => {
            eb.space().played.startEffect.megacredits(-2);
            eb.description('Effect: When you play a Space card, you pay 2 MC less for it.');
          }).br;
          b.productionBox((pb) => {
            pb.minus().energy(1).nbsp;
            pb.plus().megacredits(2);
          });
        }),
        description: {
          text: 'Requires 5% oxygen. Decrease your Energy production 1 step and increase your MC production 2 steps.',
          align: 'left',
        },
        victoryPoints: 1,
      },
    });
  }
  public canPlay(player: Player, game: Game): boolean {
    return game.checkMinRequirements(player, GlobalParameter.OXYGEN, 5) && player.getProduction(Resources.ENERGY) >= 1;
  }
  public getCardDiscount(_player: Player, _game: Game, card: IProjectCard) {
    if (card.tags.indexOf(Tags.SPACE) !== -1) {
      return 2;
    }
    return 0;
  }
  public play(player: Player) {
    player.addProduction(Resources.ENERGY, -1);
    player.addProduction(Resources.MEGACREDITS, 2);
    return undefined;
  }
  public getVictoryPoints() {
    return 1;
  }
}
