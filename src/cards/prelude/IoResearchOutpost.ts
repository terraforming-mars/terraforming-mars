import {Tags} from '../Tags';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {PreludeCard} from './PreludeCard';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class IoResearchOutpost extends PreludeCard {
    public tags = [Tags.JOVIAN, Tags.SCIENCE];
    public name = CardName.IO_RESEARCH_OUTPOST;
    public play(player: Player, game: Game) {
      player.addProduction(Resources.TITANIUM);
      return player.drawCard(game);
    }
    public metadata: CardMetadata = {
      cardNumber: 'P16',
      renderData: CardRenderer.builder((b) => {
        b.productionBox((pb) => pb.titanium(1)).br;
        b.cards(1);
      }),
      description: 'Increase your titanium production 1 step. Draw a card.',
    }
}
