import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {PartyName} from '../../turmoil/parties/PartyName';
import {Resources} from '../../Resources';
import {CardMetadata} from '../CardMetadata';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderItemSize} from '../render/CardRenderItemSize';

export class RedTourismWave implements IProjectCard {
    public cost = 3;
    public tags = [Tags.EARTH];
    public name = CardName.RED_TOURISM_WAVE;
    public cardType = CardType.EVENT;

    public canPlay(player: Player, game: Game): boolean {
      if (game.turmoil !== undefined) {
        return game.turmoil.canPlay(player, PartyName.REDS);
      }
      return false;
    }

    public play(player: Player, game: Game) {
      const amount = game.board.getEmptySpaces().filter((space) =>
        game.board.getAdjacentSpaces(space).some((adj) =>
          adj.tile !== undefined && adj.player === player,
        ),
      ).length;
      player.setResource(Resources.MEGACREDITS, amount);
      return undefined;
    }

    public metadata: CardMetadata = {
      cardNumber: 'T12',
      requirements: CardRequirements.builder((b) => b.party(PartyName.REDS)),
      renderData: CardRenderer.builder((b) => {
        b.megacredits(1).slash().emptyTile('normal', CardRenderItemSize.SMALL).asterix();
      }),
      description: 'Requires that Reds are ruling or that you have 2 delegates there. Gain 1 MC from each EMPTY AREA ADJACENT TO YOUR TILES',
    }
}
