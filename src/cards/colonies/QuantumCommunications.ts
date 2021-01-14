import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {Resources} from '../../Resources';
import {Game} from '../../Game';
import {CardMetadata} from '../CardMetadata';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderItemSize} from '../render/CardRenderItemSize';

export class QuantumCommunications implements IProjectCard {
    public cost = 8;
    public tags = [];
    public name = CardName.QUANTUM_COMMUNICATIONS;
    public cardType = CardType.AUTOMATED;

    public canPlay(player: Player): boolean {
      return player.getTagCount(Tags.SCIENCE) >= 4;
    }

    public play(player: Player, game: Game) {
      let coloniesCount: number = 0;
      game.colonies.forEach((colony) => {
        coloniesCount += colony.colonies.length;
      });
      player.addProduction(Resources.MEGACREDITS, coloniesCount);
      return undefined;
    }

    public getVictoryPoints() {
      return 1;
    }

    public metadata: CardMetadata = {
      cardNumber: '079',
      requirements: CardRequirements.builder((b) => b.tag(Tags.SCIENCE, 4)),
      renderData: CardRenderer.builder((b) => {
        b.production((pb) => {
          pb.megacredits(1).slash().colonies(1, CardRenderItemSize.SMALL).any;
        });
      }),
      description: 'Requires 4 Science tags. Increase your MC production 1 step for each colony in play.',
      victoryPoints: 1,
    }
}
