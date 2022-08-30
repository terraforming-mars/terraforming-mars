import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {IProjectCard} from '../IProjectCard';
import {Player} from '../../Player';
import {PreludeCard} from '../prelude/PreludeCard';
import {Resources} from '../../../common/Resources';
import {Tag} from '../../../common/cards/Tag';
import {Game} from '../../Game';
import {Turmoil} from '../../turmoil/Turmoil';

export class TheNewSpaceRace extends PreludeCard implements IProjectCard {
  constructor() {
    super({
      name: CardName.THE_NEW_SPACE_RACE,
      tags: [Tag.SCIENCE, Tag.EARTH],

      metadata: {
        cardNumber: '',
        renderData: CardRenderer.builder((b) => {
          b.firstPlayer().rulingParty().megacredits(12).br;
        }),
        description: 'REVEALED BEFORE ANY OTHER PRELUDE. You become starting player for the game. Choose and set a ruling policy for the first generation. Gain 12 M€.',
      },
    });
  }
  public override bespokePlay(player: Player) {
    const game = player.game;
    player.addResource(Resources.MEGACREDITS, 12);
    game.overrideFirstPlayer(player);
    Turmoil.ifTurmoil((player.game), (turmoil) => {
      turmoil.chooseRulingParty(player);
    });

    return undefined;
  }

  public static potentiallyChangeFirstPlayer(game: Game) {
    const [cardHolder, card] = game.getCardHolder(CardName.THE_NEW_SPACE_RACE);
    if (cardHolder !== undefined && card !== undefined) {
      game.log('${0} has ${1}, which is played before any other Prelude and makes them first player.', (b) => b.player(cardHolder).card(card));
      cardHolder.playCard(card);
    }
  }
}
