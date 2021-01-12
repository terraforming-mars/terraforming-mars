import {Tags} from '../Tags';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {PreludeCard} from './PreludeCard';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {DrawCards} from '../../deferredActions/DrawCards';
import {CardRenderer} from '../render/CardRenderer';

export class IoResearchOutpost extends PreludeCard {
  constructor() {
    super({
      name: CardName.IO_RESEARCH_OUTPOST,
      tags: [Tags.JOVIAN, Tags.SCIENCE],

      metadata: {
        cardNumber: 'P16',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.titanium(1)).br;
          b.cards(1);
        }),
        description: 'Increase your titanium production 1 step. Draw a card.',
      },
    });
  }
  public play(player: Player, game: Game) {
    player.addProduction(Resources.TITANIUM);
    game.defer(new DrawCards(player, game, 1));
    return undefined;
  }
}
