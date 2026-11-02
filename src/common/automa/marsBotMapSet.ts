import {BoardName} from '../boards/BoardName';

type MapSetOptions = {
  readonly boardName: BoardName;
  readonly modularMA: boolean;
};

/**
 * The map whose rules MarsBot follows for its milestones and awards.
 *
 * Undefined with the Milestones & Awards expansion, whose MarsBot rules are written against the
 * Tharsis board whatever map the game is played on. With random milestones and awards the map's
 * rules still apply to each of the map's own milestones and awards that come up; any other one
 * uses the generic rule.
 */
export function marsBotMapSet(options: MapSetOptions): BoardName | undefined {
  return options.modularMA ? undefined : options.boardName;
}
