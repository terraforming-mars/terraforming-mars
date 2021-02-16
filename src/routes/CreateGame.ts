import * as http from 'http';
import {Handler} from './Handler';
import {IContext} from './IHandler';
import {Database} from '../database/Database';
import {BoardName} from '../boards/BoardName';
import {Cloner} from '../database/Cloner';
import {GameLoader} from '../database/GameLoader';
import {Game, GameId} from '../Game';
import {Player} from '../Player';

// A copy from server.ts. Please dedupe.
function generateRandomId(): GameId {
  // 281474976710656 possible values.
  return Math.floor(Math.random() * Math.pow(16, 12)).toString(16);
}

export class CreateGame extends Handler {
  private constructor() {
    super();
  }

  public static newInstance(): CreateGame {
    const handler = new CreateGame();
    return handler;
  }

  public put(req: http.IncomingMessage, res: http.ServerResponse, ctx: IContext): void {
    let body = '';
    req.on('data', function(data) {
      body += data.toString();
    });
    req.once('end', () => {
      try {
        const gameReq = JSON.parse(body);
        const gameId = generateRandomId();
        const players = gameReq.players.map((obj: any) => {
          return new Player(
            obj.name,
            obj.color,
            obj.beginner,
            Number(obj.handicap), // For some reason handicap is coming up a string.
            generateRandomId(),
          );
        });
        let firstPlayerIdx: number = 0;
        for (let i = 0; i < gameReq.players.length; i++) {
          if (gameReq.players[i].first === true) {
            firstPlayerIdx = i;
            break;
          }
        }

        if (gameReq.board === 'random') {
          const boards = Object.values(BoardName);
          gameReq.board = boards[Math.floor(Math.random() * boards.length)];
        }

        const gameOptions = {
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
          turmoilExtension: gameReq.turmoil,
          aresExtension: gameReq.aresExtension,
          aresHazards: true, // Not a runtime option.
          politicalAgendasExtension: gameReq.politicalAgendasExtension,
          moonExpansion: gameReq.moonExpansion,
          promoCardsOption: gameReq.promoCardsOption,
          communityCardsOption: gameReq.communityCardsOption,
          solarPhaseOption: gameReq.solarPhaseOption,
          removeNegativeGlobalEventsOption:
            gameReq.removeNegativeGlobalEventsOption,
          includeVenusMA: gameReq.includeVenusMA,

          draftVariant: gameReq.draftVariant,
          initialDraftVariant: gameReq.initialDraft,
          startingCorporations: gameReq.startingCorporations,
          shuffleMapOption: gameReq.shuffleMapOption,
          randomMA: gameReq.randomMA,
          soloTR: gameReq.soloTR,
          customCorporationsList: gameReq.customCorporationsList,
          cardsBlackList: gameReq.cardsBlackList,
          customColoniesList: gameReq.customColoniesList,
          requiresVenusTrackCompletion: gameReq.requiresVenusTrackCompletion,
          requiresMoonTrackCompletion: gameReq.requiresMoonTrackCompletion,
        };

        if (gameOptions.clonedGamedId !== undefined && !gameOptions.clonedGamedId.startsWith('#')) {
          Database.getInstance().loadCloneableGame(gameOptions.clonedGamedId, (err, serialized) => {
            Cloner.clone(gameId, players, firstPlayerIdx, err, serialized, (err, game) => {
              if (err) {
                throw err;
              }
              if (game === undefined) {
                throw new Error(`game ${gameOptions.clonedGamedId} not cloned`); // how to nest errs in the way Java nests exceptions?
              }
              GameLoader.getInstance().add(game);
              res.setHeader('Content-Type', 'application/json');
              res.write(this.getGameModelJSON(game));
              res.end();
            });
          });
        } else {
          const seed = Math.random();
          const game = Game.newInstance(gameId, players, players[firstPlayerIdx], gameOptions, seed);
          GameLoader.getInstance().add(game);
          res.setHeader('Content-Type', 'application/json');
          res.write(this.getGameModelJSON(game));
          res.end();
        }
      } catch (error) {
        ctx.route.internalServerError(req, res, error);
      }
    });
  }
}
