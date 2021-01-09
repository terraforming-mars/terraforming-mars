import {Tags} from '../Tags';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {PreludeCard} from './PreludeCard';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class Biolab extends PreludeCard {
    public tags = [Tags.SCIENCE];
    public name = CardName.BIOLAB;
    public play(player: Player, game: Game) {
      player.addProduction(Resources.PLANTS);
      return player.drawCard(game, {amount: 3});
    }
    public metadata: CardMetadata = {
      cardNumber: 'P04',
      renderData: CardRenderer.builder((b) => {
        b.production((pb) => pb.plants(1)).br;
        b.cards(3);
      }),
      description: 'Increase your plant production 1 step. Draw 3 cards.',
    }
}

