import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {Game} from '../../Game';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderItemSize} from '../render/CardRenderItemSize';

export class MolecularPrinting implements IProjectCard {
    public cost = 11;
    public tags = [Tags.SCIENCE];
    public name = CardName.MOLECULAR_PRINTING;
    public cardType = CardType.AUTOMATED;

    public play(player: Player, game: Game) {
      let coloniesCount: number = 0;
      game.colonies.forEach((colony) => {
        coloniesCount += colony.colonies.length;
      });
      player.megaCredits += game.getCitiesInPlay() +coloniesCount;
      return undefined;
    }

    public getVictoryPoints() {
      return 1;
    }

    public metadata: CardMetadata = {
      cardNumber: 'C27',
      renderData: CardRenderer.builder((b) => {
        b.megacredits(1).slash().city(CardRenderItemSize.SMALL).any.br;
        b.megacredits(1).slash().colonies(1, CardRenderItemSize.SMALL).any;
      }),
      description: 'Gain 1 MC for each city tile in play. Gain 1 MC for each colony in play.',
      victoryPoints: 1,
    }
}
