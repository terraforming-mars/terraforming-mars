import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class TechnologyDemonstration implements IProjectCard {
    public cost = 5;
    public tags = [Tags.SCIENCE, Tags.SPACE];
    public cardType = CardType.EVENT;
    public name = CardName.TECHNOLOGY_DEMONSTRATION;

    public play(player: Player, game: Game) {
      return player.drawCard(game, {amount: 2});
    }
    public metadata: CardMetadata = {
      cardNumber: '204',
      renderData: CardRenderer.builder((b) => {
        b.cards(2);
      }),
      description: 'Draw two cards.',
    }
}

