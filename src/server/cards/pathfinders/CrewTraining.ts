import {IPlayer} from '../../IPlayer';
import {PreludeCard} from '../prelude/PreludeCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';
import {ICloneTagCard} from './ICloneTagCard';
import {DeclareCloneTag} from '../../pathfinders/DeclareCloneTag';
import {Size} from '../../../common/cards/render/Size';

export class CrewTraining extends PreludeCard implements ICloneTagCard {
  constructor() {
    super({
      name: CardName.CREW_TRAINING,

      behavior: {
        tr: 2,
      },

      metadata: {
        cardNumber: 'PfP06',
        renderData: CardRenderer.builder((b) => {
          b.planetaryTrack().text('2')
            .tag(Tag.VENUS).or(Size.SMALL)
            .tag(Tag.EARTH).or(Size.SMALL).br;
          b.tag(Tag.MARS).or(Size.SMALL)
            .tag(Tag.JOVIAN).or(Size.SMALL)
            .tag(Tag.MOON).br;

          b.tr(2);
        }),
        description: 'Choose a planet tag. This card counts as having 2 of that tag. ' +
          'Raise the corresponding planetary track 2 steps. Gain 2 TR.',
      },
    });
  }

  public cloneTag: Tag = Tag.CLONE;

  public override get tags(): Array<Tag> {
    return [this.cloneTag, this.cloneTag];
  }

  public override bespokePlay(player: IPlayer) {
    player.game.defer(new DeclareCloneTag(player, this));
    return undefined;
  }
}

