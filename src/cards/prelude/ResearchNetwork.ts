import {Tags} from '../Tags';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {PreludeCard} from './PreludeCard';
import {IProjectCard} from '../IProjectCard';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {DrawCards} from '../../deferredActions/DrawCards';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class ResearchNetwork extends PreludeCard implements IProjectCard {
    public tags = [Tags.WILDCARD];
    public name = CardName.RESEARCH_NETWORK;
    public play(player: Player, game: Game) {
      player.addProduction(Resources.MEGACREDITS);
      game.defer(new DrawCards(player, game, 3));
      return undefined;
    }
    public metadata: CardMetadata = {
      cardNumber: 'P28',
      renderData: CardRenderer.builder((b) => {
        b.production((pb) => pb.megacredits(1)).br;
        b.cards(3);
      }),
      description: 'Increase your MC production 1 step. Draw 3 cards.',
    }
}
