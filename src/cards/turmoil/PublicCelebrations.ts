import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {CardMetadata} from '../../cards/CardMetadata';
import {CardRequirements} from '../../cards/CardRequirements';

export class PublicCelebrations implements IProjectCard {
    public cost = 8;
    public tags = [];
    public name = CardName.PUBLIC_CELEBRATIONS;
    public cardType = CardType.EVENT;

    public canPlay(player: Player, game: Game): boolean {
      if (game.turmoil !== undefined) {
        return game.turmoil.chairman === player.id;
      }
      return false;
    }

    public play() {
      return undefined;
    }

    public getVictoryPoints() {
      return 2;
    }

    public metadata: CardMetadata = {
      description: 'Requires that you are Chairman.',
      cardNumber: 'T10',
      requirements: CardRequirements.builder((b) => b.chairman()),
      victoryPoints: 2,
    };
}
