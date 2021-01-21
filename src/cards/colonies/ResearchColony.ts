import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {Game} from '../../Game';
import {BuildColony} from '../../deferredActions/BuildColony';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class ResearchColony implements IProjectCard {
    public cost = 20;
    public tags = [Tags.SPACE, Tags.SCIENCE];
    public name = CardName.RESEARCH_COLONY;
    public cardType = CardType.AUTOMATED;

    public play(player: Player, game: Game) {
      game.defer(new BuildColony(player, true, 'Select colony for Research Colony'));
      player.drawCard(2);
      return undefined;
    }
    public metadata: CardMetadata = {
      cardNumber: 'C34',
      renderData: CardRenderer.builder((b) => {
        b.colonies(1).asterix().nbsp.cards(2);
      }),
      description: 'Place a colony. MAY BE PLACED WHERE YOU ALREADY HAVE A COLONY. Draw 2 cards.',
    }
}
