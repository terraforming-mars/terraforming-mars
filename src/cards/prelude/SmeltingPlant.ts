import {Tags} from '../Tags';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {PreludeCard} from './PreludeCard';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class SmeltingPlant extends PreludeCard implements IProjectCard {
    public tags = [Tags.STEEL];
    public name = CardName.SMELTING_PLANT;
    public play(player: Player, game: Game) {
      player.steel += 5;
      return game.increaseOxygenLevel(player, 2);
    }
    public metadata: CardMetadata = {
      cardNumber: 'P30',
      renderData: CardRenderer.builder((b) => {
        b.oxygen(2).br;
        b.steel(5);
      }),
      description: 'Raise oxygen 2 steps. Gain 5 steel.',
    }
}
