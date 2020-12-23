import {IProjectCard} from '../IProjectCard';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderItemSize} from '../render/CardRenderItemSize';

export class Zeppelins implements IProjectCard {
    public cost = 13;
    public tags = [];
    public cardType = CardType.AUTOMATED;
    public name = CardName.ZEPPELINS;
    public canPlay(player: Player, game: Game): boolean {
      return game.getOxygenLevel() >= 5 - player.getRequirementsBonus(game);
    }
    public play(player: Player, game: Game) {
      player.addProduction(Resources.MEGACREDITS, game.getCitiesInPlayOnMars());
      return undefined;
    }
    public getVictoryPoints() {
      return 1;
    }
    public metadata: CardMetadata = {
      cardNumber: '129',
      requirements: CardRequirements.builder((b) => b.oxygen(5)),
      renderData: CardRenderer.builder((b) => {
        b.productionBox((pb) => pb.megacredits(1).slash().city(CardRenderItemSize.SMALL).any);
      }),
      description: 'Requires 5% oxygen. Increase your MC production 1 step for each City tile ON MARS.',
      victoryPoints: 1,
    }
}

