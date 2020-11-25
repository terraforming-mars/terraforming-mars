import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {IActionCard} from '../ICard';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class AICentral implements IActionCard, IProjectCard {
  public cost = 21;
  public tags = [Tags.SCIENCE, Tags.STEEL];
  public cardType = CardType.ACTIVE;
  public name = CardName.AI_CENTRAL;
  public canPlay(player: Player): boolean {
    return player.getTagCount(Tags.SCIENCE) >= 3 && player.getProduction(Resources.ENERGY) >= 1;
  }
  public play(player: Player) {
    player.addProduction(Resources.ENERGY, -1);
    return undefined;
  }
  public canAct(): boolean {
    return true;
  }
  public getVictoryPoints() {
    return 1;
  }
  public action(player: Player, game: Game) {
    player.cardsInHand.push(game.dealer.dealCard(), game.dealer.dealCard());
    return undefined;
  }
  public metadata: CardMetadata = {
    description: 'Requires 3 Science tags to play. Decrease your Energy production 1 step',
    cardNumber: '208',
    requirements: CardRequirements.builder((b) => b.tag(Tags.SCIENCE, 3)),
    renderData: CardRenderer.builder((b) => {
      b.effectBox((ab) => ab.empty().startAction.cards(2).description('Action: Draw 2 cards')).br;
      b.productionBox((pb) => pb.minus().energy(1));
    }),
    victoryPoints: 1,
  };
}
