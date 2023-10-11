import {Handler} from './Handler';
import {Context} from './IHandler';
import {Database} from '../database/Database';
import {BoardName} from '../../common/boards/BoardName';
import {RandomBoardOption} from '../../common/boards/RandomBoardOption';
import {Cloner} from '../database/Cloner';
import {GameLoader} from '../database/GameLoader';
import {Game} from '../Game';
import {GameOptions} from '../game/GameOptions';
import {Player} from '../Player';
import {Server} from '../models/ServerModel';
import {ServeAsset} from './ServeAsset';
import {NewGameConfig} from '../../common/game/NewGameConfig';
import {GameId, PlayerId, SpectatorId} from '../../common/Types';
import {generateRandomId} from '../utils/server-ids';
import {IGame} from '../IGame';
import {Request} from '../Request';
import {Response} from '../Response';

// Oh, this could be called Game, but that would introduce all kinds of issues.

// Calling get() feeds the game to the player (I think, and calling put creates a game.)
// So, that should be fixed, you know.
export class GameHandler extends Handler {
  public static readonly INSTANCE = new GameHandler();
  private constructor() {
    super();
  }

  public static boardOptions(board: RandomBoardOption | BoardName): Array<BoardName> {
    const allBoards = Object.values(BoardName);

    if (board === RandomBoardOption.ALL) return allBoards;
    if (board === RandomBoardOption.OFFICIAL) {
      return allBoards.filter((name) => {
        return name === BoardName.THARSIS ||
          name === BoardName.HELLAS ||
          name === BoardName.ELYSIUM;
      });
    }
    return [board];
  }

  public override get(req: Request, res: Response, ctx: Context): Promise<void> {
    req.url = '/assets/index.html';
    return ServeAsset.INSTANCE.get(req, res, ctx);
  }

  // TODO(kberg): much of this code can be moved outside of handler, and that
  // would be better.
  public override put(req: Request, res: Response, ctx: Context): Promise<void> {
    return new Promise((resolve) => {
      let body = '';
      req.on('data', function(data) {
        body += data.toString();
      });
      req.once('end', async () => {
        try {
          const gameReq: NewGameConfig = JSON.parse(body);
          const gameId = generateRandomId('g') as GameId;
          const spectatorId = generateRandomId('s') as SpectatorId;
          const players = gameReq.players.map((obj: any) => {
            return new Player(
              obj.name,
              obj.color,
              obj.beginner,
              Number(obj.handicap), // For some reason handicap is coming up a string.
              generateRandomId('p') as PlayerId,
            );
          });
          let firstPlayerIdx = 0;
          for (let i = 0; i < gameReq.players.length; i++) {
            if (gameReq.players[i].first === true) {
              firstPlayerIdx = i;
              break;
            }
          }

          const boards = GameHandler.boardOptions(gameReq.board);
          gameReq.board = boards[Math.floor(Math.random() * boards.length)];

          const gameOptions: GameOptions = {
            boardName: gameReq.board,
            clonedGamedId: gameReq.clonedGamedId,

            undoOption: gameReq.undoOption,
            showTimers: gameReq.showTimers,
            fastModeOption: gameReq.fastModeOption,
            showOtherPlayersVP: gameReq.showOtherPlayersVP,

            corporateEra: gameReq.corporateEra,
            venusNextExtension: gameReq.venusNext,
            coloniesExtension: gameReq.colonies,
            preludeExtension: gameReq.prelude,
            prelude2Expansion: gameReq.prelude2Expansion,
            turmoilExtension: gameReq.turmoil,
            aresExtension: gameReq.aresExtension,
            aresHazards: true, // Not a runtime option.
            politicalAgendasExtension: gameReq.politicalAgendasExtension,
            moonExpansion: gameReq.moonExpansion,
            pathfindersExpansion: gameReq.pathfindersExpansion,
            underworldExpansion: false,
            promoCardsOption: gameReq.promoCardsOption,
            communityCardsOption: gameReq.communityCardsOption,
            solarPhaseOption: gameReq.solarPhaseOption,
            removeNegativeGlobalEventsOption: gameReq.removeNegativeGlobalEventsOption,
            includeVenusMA: gameReq.includeVenusMA,

            draftVariant: gameReq.draftVariant,
            initialDraftVariant: gameReq.initialDraft,
            startingCorporations: gameReq.startingCorporations,
            shuffleMapOption: gameReq.shuffleMapOption,
            randomMA: gameReq.randomMA,
            includeFanMA: gameReq.includeFanMA,
            soloTR: gameReq.soloTR,
            customCorporationsList: gameReq.customCorporationsList,
            bannedCards: gameReq.bannedCards,
            customColoniesList: gameReq.customColoniesList,
            customPreludes: gameReq.customPreludes,
            requiresVenusTrackCompletion: gameReq.requiresVenusTrackCompletion,
            requiresMoonTrackCompletion: gameReq.requiresMoonTrackCompletion,
            moonStandardProjectVariant: gameReq.moonStandardProjectVariant,
            altVenusBoard: gameReq.altVenusBoard,
            escapeVelocityMode: gameReq.escapeVelocityMode,
            escapeVelocityThreshold: gameReq.escapeVelocityThreshold,
            escapeVelocityBonusSeconds: gameReq.escapeVelocityBonusSeconds,
            escapeVelocityPeriod: gameReq.escapeVelocityPeriod,
            escapeVelocityPenalty: gameReq.escapeVelocityPenalty,
            twoCorpsVariant: gameReq.twoCorpsVariant,
            ceoExtension: gameReq.ceoExtension,
            customCeos: gameReq.customCeos,
            startingCeos: gameReq.startingCeos,
            starWarsExpansion: gameReq.starWarsExpansion,
          };

          let game: IGame;
          if (gameOptions.clonedGamedId !== undefined && !gameOptions.clonedGamedId.startsWith('#')) {
            const serialized = await Database.getInstance().loadCloneableGame(gameOptions.clonedGamedId);
            game = Cloner.clone(gameId, players, firstPlayerIdx, serialized);
          } else {
            const seed = Math.random();
            game = Game.newInstance(gameId, players, players[firstPlayerIdx], gameOptions, seed, spectatorId);
          }
          GameLoader.getInstance().add(game);
          ctx.route.writeJson(res, Server.getSimpleGameModel(game));
        } catch (error) {
          ctx.route.internalServerError(req, res, error);
        }
        resolve();
      });
    });
  }
}
