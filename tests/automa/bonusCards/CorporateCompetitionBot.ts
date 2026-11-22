import {AwardName} from '@/common/ma/AwardName';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {Space} from '@/server/boards/Space';
import {TestGameOptions, testGame} from '../../TestGame';
import {recordingMarsBot} from '../corps/RecordingMarsBot';

/**
 * A bot with 5 M€ and a score of 5 in every award, in a 2-player game built with `gameOptions`.
 *
 * `calls` also records the track advances by tag and the project cards it plays. `greenerySpaces` holds the
 * spaces a greenery it places may go on, and it places one when there is any.
 */
export function competitionBot(gameOptions: Partial<TestGameOptions> = {}, fields: Partial<IMarsBot> = {}) {
  const [game, human, botPlayer] = testGame(2, gameOptions);
  const greenerySpaces: Array<Space> = [];
  const {marsBot, calls} = recordingMarsBot({
    game, player: botPlayer, humanPlayer: human, megacredits: 5, interceptsParameterRaise: () => false,
    awardValue: () => 5,
    advanceTrackOfTag: (tag) => calls.push(`advanceTrackOfTag(${tag})`) > 0,
    onTagAdvance: (tag) => {
      calls.push(`onTagAdvance(${tag})`);
    },
    resolveProjectCard: (card) => {
      calls.push(`resolveProjectCard(${card.name})`);
    },
    maybePlaceGreenery: (filter = () => true) => {
      greenerySpaces.push(...game.board.getAvailableSpacesForGreenery(botPlayer).filter(filter));
      return greenerySpaces.length > 0;
    },
    ...fields,
  });
  return {game, human, botPlayer, marsBot, calls, greenerySpaces};
}

export function fund(bot: ReturnType<typeof competitionBot>, ...awards: ReadonlyArray<AwardName>): void {
  for (const name of awards) {
    bot.game.fundAward(bot.human, bot.game.awards.find((award) => award.name === name)!);
  }
}
