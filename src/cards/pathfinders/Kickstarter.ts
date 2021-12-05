import {IProjectCard} from '../IProjectCard';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tags} from '../Tags';
import {DeclareCloneTag} from '../../pathfinders/DeclareCloneTag';
import {ICloneTagCard} from './ICloneTagCard';
import {PathfindersExpansion} from '../../pathfinders/PathfindersExpansion';

export class Kickstarter extends Card implements IProjectCard, ICloneTagCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.KICKSTARTER,
      cost: 12,

      metadata: {
        cardNumber: 'PfTBD',
        renderData: CardRenderer.builder((b) => {
          b.planetaryTrack().text('3');
        }),
        description: 'Choose a planetary track and raise it 3 steps. This card counts as a card with a tag of the chosen planet.',
      },
    });
  }

  public cloneTag: Tags = Tags.CLONE;

  public get tags(): Array<Tags> {
    return [this.cloneTag];
  }

  public play(player: Player) {
    player.adjustProduction(this.productionBox);
    player.game.defer(
      new DeclareCloneTag(
        player,
        this,
        'Select a planetary track to advance 3 steps (and to clone this tag.)',
        (tag) => PathfindersExpansion.raiseTrack(tag, player, 3),
      ));
    return undefined;
  }
}
