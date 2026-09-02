import {IGlobalEvent} from '../../turmoil/globalEvents/IGlobalEvent';
import {GlobalEvent} from '../../turmoil/globalEvents/GlobalEvent';
import {GlobalEventName} from '../../../common/turmoil/globalEvents/GlobalEventName';
import {PartyName} from '../../../common/turmoil/PartyName';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';

export class TiredEarth extends GlobalEvent implements IGlobalEvent {
  constructor() {
    super({
      name: GlobalEventName.TIRED_EARTH,
      description: 'Lose 1 plant for each Earth tag you own (max 5) then reduced by influence.',
      revealedDelegate: PartyName.KELVINISTS,
      currentDelegate: PartyName.GREENS,
      behavior: {
        lose: {
          stock: {
            plants: {
              tag: Tag.EARTH,
              turmoil: {max: 5, influence: {subtract: true}},
            },
          },
        },
      },
      renderData: CardRenderer.builder((b) => {
        b.minus().plants(1).slash().tag(Tag.EARTH).influence({size: Size.SMALL});
      }),
    });
  }
}
