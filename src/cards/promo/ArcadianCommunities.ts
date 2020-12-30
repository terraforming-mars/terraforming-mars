import {Player} from '../../Player';
import {Game} from '../../Game';
import {CorporationCard} from '../corporation/CorporationCard';
import {SelectSpace} from '../../inputs/SelectSpace';
import {ISpace} from '../../boards/ISpace';
import {IActionCard} from '../ICard';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderItemSize} from '../render/CardRenderItemSize';


export class ArcadianCommunities implements IActionCard, CorporationCard {
    public name = CardName.ARCADIAN_COMMUNITIES;
    public tags = [];
    public startingMegaCredits: number = 40;
    public cardType = CardType.CORPORATION;

    public initialActionText: string = 'Place a community (player marker) on a non-reserved area';
    public initialAction(player: Player, game: Game) {
      return new SelectSpace(
        'Select space for claim',
        game.board.getAvailableSpacesOnLand(player),
        (foundSpace: ISpace) => {
          foundSpace.player = player;

          game.log('${0} placed a Community (player marker)', (b) => b.player(player));

          return undefined;
        },
      );
    }

    public canAct(player: Player, game: Game): boolean {
      return game.board.getAvailableSpacesForMarker(player).length > 0;
    }

    public action(player: Player, game: Game) {
      return new SelectSpace(
        'Select space for claim',
        game.board.getAvailableSpacesForMarker(player),
        (foundSpace: ISpace) => {
          foundSpace.player = player;
          return undefined;
        },
      );
    }

    public play(player: Player) {
      player.steel = 10;
      return undefined;
    }

    public metadata: CardMetadata = {
      cardNumber: 'R44',
      description: 'You start with 40 MC and 10 steel. AS YOUR FIRST ACTION, PLACE A COMMUNITY [PLAYER MARKER] ON A NON-RESERVED AREA.',
      renderData: CardRenderer.builder((b) => {
        b.br;
        b.megacredits(40).nbsp.steel(10).digit.nbsp.community().asterix();
        b.corpBox('action', (ce) => {
          ce.text('ACTION: PLACE A COMMUNITY (PLAYER MARKER) ON A NON-RESERVED AREA ADJACENT TO ONE OF YOUR TILES OR MARKED AREAS', CardRenderItemSize.TINY, true);
          ce.vSpace(CardRenderItemSize.MEDIUM);
          ce.text('EFFECT: MARKED AREAS ARE RESERVED FOR YOU. WHEN YOU PLACE A TILE THERE, GAIN 3 MC', CardRenderItemSize.TINY, true);
        });
      }),
    }
}
