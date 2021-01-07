import {Tags} from '../Tags';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {PreludeCard} from './PreludeCard';
import {IProjectCard} from '../IProjectCard';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class ResearchNetwork extends PreludeCard implements IProjectCard {
    public tags = [Tags.WILDCARD];
    public name = CardName.RESEARCH_NETWORK;
    public play(player: Player, game: Game) {
      player.addProduction(Resources.MEGACREDITS);
      return player.drawCard(game, {amount: 3});
    }
    public metadata: CardMetadata = {
      cardNumber: 'P28',
      renderData: CardRenderer.builder((b) => {
        b.productionBox((pb) => pb.megacredits(1)).br;
        b.cards(3);
      }),
      description: 'Increase your MC production 1 step. Draw 3 cards.',
    }
}
