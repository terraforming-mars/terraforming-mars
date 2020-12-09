import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {CardName} from '../../CardName';
import {DrawCards} from '../../deferredActions/DrawCards';
import {CardMetadata} from '../CardMetadata';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class MartianSurvey implements IProjectCard {
    public cost = 9;
    public tags = [Tags.SCIENCE];
    public name = CardName.MARTIAN_SURVEY;
    public cardType = CardType.EVENT;

    public canPlay(player: Player, game: Game): boolean {
      return game.getOxygenLevel() <= 4 + player.getRequirementsBonus(game);
    }

    public play(player: Player, game: Game) {
      game.defer(new DrawCards(player, game, 2));
      return undefined;
    }

    public getVictoryPoints() {
      return 1;
    }

    public metadata: CardMetadata = {
      cardNumber: 'P38',
      requirements: CardRequirements.builder((b) => b.oxygen(4).max()),
      renderData: CardRenderer.builder((b) => {
        b.cards(2);
      }),
      description: 'Oxygen must be 4% or lower. Draw two cards.',
      victoryPoints: 1,
    }
}
