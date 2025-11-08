// Call API to create game with VP visible

import { Color } from "@/common/Color";
import { InputResponse } from "@/common/inputs/InputResponse";
import { SeededRandom } from "@/common/utils/Random";
import { registerBehaviorExecutor } from "@/server/behavior/BehaviorExecutor";
import { Executor } from "@/server/behavior/Executor";
import { Database } from "@/server/database/Database";
// import { GameLoader } from "@/server/database/GameLoader";
import { Game } from "@/server/Game";
import { SelectCard } from "@/server/inputs/SelectCard";
import { SelectInitialCards } from "@/server/inputs/SelectInitialCards";
import { Player } from "@/server/Player";

// Use in memory sqlite
process.env.SQLITE_FILE_NAME = ':memory:';
// Note, server may start listening later after we start the game
// require('src/server/server');
start2();
// Demo MVP that creates a game and plays itself with agents
// Should we set up server APIs we can call from Python to create game, fetch actions, take action, fetch reward state?
// Then can build an environment in Gymnasium for training
async function start2() {
    // Below called by the server, set it up if running standalone
    await Database.getInstance().initialize();
// set up the behavior executor
    registerBehaviorExecutor(new Executor());
// instead of calling public APIs, can we just directly make the same internal calls to the server? might be faster without http
    const players = [new Player(
              'AI1',
              Color.RED,
              false,
              0,
              'p1',
            ),
            new Player(
                'AI2',
                Color.GREEN,
                false,
                0,
                'p2',
              )];
    // Use the same seed to play the same game over and over again
    const gameSeed = 1;
    const game = Game.newInstance('g_TEST', players, players[0], {}, gameSeed);
    // Update gameloader if we want to read info from database later
    // GameLoader.getInstance().add(game);
    const agentSeed = Math.random();
    const rand = new SeededRandom(agentSeed);
    //await new Promise(resolve => setTimeout(resolve, 5000));
    while (true) {
        console.log('[STATUS] gen: %s, board: %s, oceans: %s, temp: %s, oxygen: %s, phase: %s, active: %s, seed: %s', game.generation, game.board.spaces.filter(s => s.tile).length + '/' + game.board.spaces.length, !game.canAddOcean(), game.getTemperature(), game.getOxygenLevel(), game.phase, game.activePlayer, agentSeed);
        if (game.generation > 50) {
            break;
        }
        if (game.phase === 'end') {
            break;
        }
        game.getPlayers().forEach((p, i) => {
            // if researching, all players need to act
            // otherwise, only active player should act
            if (game.phase === 'research' || game.activePlayer === p.id) { 
                // List the available actions (orOptions) and do the first one
                const actions = p.getWaitingFor();
                if (!actions) {
                    throw new Error('no actions');
                }
                // console.log('[ACTION] %s %s, p.id, actions.type);
                const algo: AgentAlgo = p.id === 'p1' ? 'osla' : 'random';
                // one step lookahead agent?
                // should try each action and pick the one that results in most VP?
                // the actionspace is flat, does it make sense to choose randomly from the flat array?
                // e.g. convert greenery has many entries because there's one for each candidate space
                // but standard project greenery/city will only have one because it requires a separate input to selectspace
                const actionSpace: { label: string, input: InputResponse }[] = actions?.getActionSpace(p, rand);
                // console.log(p.id, actionSpace.map(a => JSON.stringify(a)));
                let bestVP = 0;
                // default to first action
                let best = actionSpace[0];
                if (algo === 'random') {
                    best = actionSpace[rand.nextInt(actionSpace.length)];
                } else if (algo === 'osla') {
                    if (actions instanceof SelectCard && game.phase === 'research') {
                        // It doesn't make sense to use osla for choosing cards to buy since it'll always be tied
                        // In that case, fallback to random behavior
                        best = actions.getRandomSelection(p, rand);
                    } else if (actions instanceof SelectInitialCards) {
                        best = actions.getActionSpace(p, rand)[0];
                    } else {
                        best = actionSpace[rand.nextInt(actionSpace.length)];
                        let candidates: { label: string, input: InputResponse }[] = [];
                        actionSpace.forEach(a => {
                            // Create a copy of the game to apply the candidate action
                            try {
                                const candidate = Game.deserialize(game.serialize());
                                // const candidate = structuredClone(game);
                                candidate.noLog = true;
                                const cPlayer = candidate.getPlayerById(p.id);
                                // console.log(JSON.stringify(a));
                                cPlayer.process(a.input);
                                // Check the player's VP
                                const cVP = cPlayer.getVictoryPoints().total;
                                console.log(a.label, cVP);
                                // Keep track of the max VP option
                                if (cVP > bestVP) {
                                    candidates = [a];
                                    bestVP = cVP;
                                } else if (cVP === bestVP) {
                                    candidates.push(a);
                                }
                            } catch (e) {
                                // Occasional issues with serialize/deserialize not putting us back into the "pick a space" state
                                // Also happens with selectamount
                                console.log(e, a.input);
                            }
                        });
                        if (candidates.length) {
                            // randomly select from any of the best actions
                            best = candidates[rand.nextInt(candidates.length)];
                        }
                        console.log('The best action is %s with VP %s', best.label, bestVP);
                    }
                }
                // Execute the best option
                p.process(best.input);
                // can we set up self-play/reinforcement learning?
                // probably need to set up a vector of all actions and then assign weights via training
                // Game actions are kind of nested right now
                // We probably want to produce a flat list of actions so Python frameworks can read more easily
                // But need to translate back into nested structure when creating inputresponse
            }
        });
        // Pause between each step
        // await new Promise(resolve => setTimeout(resolve, 100));
    }
    // show endgame state
    console.log(game.getPlayers().map(p => ({ 
        corp: p.corporations[0].name,
        points: p.getVictoryPoints().total,
        tableau: p.tableau.length,
        actions: p.actionsTakenThisGame,
        tr: p.getTerraformRating(),
        megacredits: `${p.megaCredits} +${p.production.asUnits().megacredits}`, 
        steel: `${p.steel} +${p.production.asUnits().steel}`, 
        titanium: `${p.titanium} +${p.production.asUnits().titanium}`, 
        plants: `${p.plants} +${p.production.asUnits().plants}`, 
        energy: `${p.energy} +${p.production.asUnits().energy}`, 
        heat: `${p.heat} +${p.production.asUnits().heat}` 
    })));
}