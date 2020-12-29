import {IActionCard} from '../ICard';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {CardName} from '../../CardName';
import {Resources} from '../../Resources';
import {LogHelper} from '../../LogHelper';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderItemSize} from '../render/CardRenderItemSize';

export class MartianRails implements IActionCard, IProjectCard {
    public cost = 13;
    public tags = [Tags.BUILDING];
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
        b.effectBox((eb) => {
          eb.energy(1).startAction.megacredits(1).slash().city(CardRenderItemSize.SMALL);
          eb.description('Action: Spend 1 Energy to gain 1 MC for each City tile ON MARS.');
        }).br;
      }),
    };
}
