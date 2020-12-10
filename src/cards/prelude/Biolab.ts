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

export class Biolab extends PreludeCard implements IProjectCard {
    public tags = [Tags.SCIENCE];
    public name = CardName.BIOLAB;
    public play(player: Player, game: Game) {
      player.addProduction(Resources.PLANTS);
      game.defer(new DrawCards(player, game, 3));
      return undefined;
    }
    public metadata: CardMetadata = {
      cardNumber: 'P04',
      renderData: CardRenderer.builder((b) => {
        b.productionBox((pb) => pb.plants(1)).br;
        b.cards(3);
      }),
      description: 'Increase your plant production 1 step. Draw 3 cards.',
    }
}

