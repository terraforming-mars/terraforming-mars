import {CorporationCard} from './CorporationCard';
import {Tags} from '../Tags';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {SelectSpace} from '../../inputs/SelectSpace';
import {SpaceType} from '../../SpaceType';
import {ISpace} from '../../ISpace';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {Board} from '../../boards/Board';
import {CardType} from '../CardType';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderItemSize} from '../render/CardRenderItemSize';

export class TharsisRepublic implements CorporationCard {
    public name = CardName.THARSIS_REPUBLIC;
    public tags = [Tags.STEEL];
    public startingMegaCredits: number = 40;
    public cardType = CardType.CORPORATION;

    public initialActionText: string = 'Place a city tile';
    public initialAction(player: Player, game: Game) {
      return new SelectSpace('Select space on mars for city tile', game.board.getAvailableSpacesForCity(player), (space: ISpace) => {
        game.addCityTile(player, space.id);
        game.log('${0} placed a City tile', (b) => b.player(player));
        return undefined;
      });
    }
    public onTilePlaced(player: Player, space: ISpace) {
      if (Board.isCitySpace(space)) {
        if (space.player === player) {
          player.megaCredits += 3;
        }
        if (space.spaceType !== SpaceType.COLONY) {
          player.addProduction(Resources.MEGACREDITS);
        }
      }
    }
    public play(player: Player, game: Game) {
      if (game.getPlayers().length === 1) {
        // Get bonus for 2 neutral cities
        player.addProduction(Resources.MEGACREDITS, 2);
      }
      return undefined;
    }
    public metadata: CardMetadata = {
      cardNumber: 'R31',
      description: 'You start with 40 MC. As your first action in the game,place a city tile.',
      renderData: CardRenderer.builder((b) => {
        b.br.br;
        b.megacredits(40).nbsp.city();
        b.corpBox('effect', (ce) => {
          ce.effectBox((eb) => {
            eb.city(CardRenderItemSize.SMALL).any.asterix().colon();
            eb.productionBox((pb) => pb.megacredits(1)).nbsp;
            eb.city(CardRenderItemSize.SMALL).startEffect.megacredits(3);
            eb.description('Effect: When any city tile is placed ON MARS, increase your MC production 1 step. When you place a city tile, gain 3 MC.');
          });
        });
      }),
    }
}
