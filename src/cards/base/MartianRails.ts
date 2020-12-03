import {IActionCard} from '../ICard';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {CardName} from '../../CardName';
import {Resources} from '../../Resources';
import {LogHelper} from '../../components/LogHelper';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class MartianRails implements IActionCard, IProjectCard {
    public cost = 13;
    public tags = [Tags.STEEL];
    public name = CardName.MARTIAN_RAILS;
    public cardType = CardType.ACTIVE;

    public play(_player: Player, _game: Game) {
      return undefined;
    }
    public canAct(player: Player): boolean {
      return player.energy >= 1;
    }
    public action(player: Player, game: Game) {
      const gainedMC = game.getCitiesInPlayOnMars();
      player.energy--;
      player.megaCredits += gainedMC;
      LogHelper.logGainStandardResource(game, player, Resources.MEGACREDITS, gainedMC);

      return undefined;
    }
    public metadata: CardMetadata = {
      cardNumber: '007',
      renderData: CardRenderer.builder((b) => {
        b.effectBox((ab) => ab.energy(1).startAction.megacredits(1).slash().city()
          .description('Action: Spend 1 Energy to gain 1 MC for each City tile ON MARS.')).br;
      }),
    };
}
