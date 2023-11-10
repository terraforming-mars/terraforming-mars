import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';
import {IProjectCard} from '../IProjectCard';
import {CardType} from '../../../common/cards/CardType';
import {ActionCard} from '../ActionCard';
import {all} from '../Options';
import {IPlayer} from '../../IPlayer';
import {Space} from '../../boards/Space';

export class GeologistTeam extends ActionCard implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.GEOLOGIST_TEAM,
      cost: 6,
      tags: [Tag.MARS, Tag.SCIENCE],

      action: {
        underworld: {identify: 1},
      },

      metadata: {
        cardNumber: 'U01',
        renderData: CardRenderer.builder((b) => {
          b.action('Identify 1 underground resource.',
            (ab) => ab.empty().startAction.identify(1));
          b.br;
          b.effect('When ANY player identifies an underground resource tha depcts an ocean, YOU gain 1 TR.',
            (eb) => eb.identify(1, {all}).oceans(1).asterix().startEffect.tr(1));
        }),
      },
    });
  }

  public onIdentification(_identifyingPlayer: IPlayer | undefined, cardOwner: IPlayer, space: Space) {
    if (space.undergroundResources === 'ocean') {
      if (cardOwner.canAfford({cost: 0, tr: {tr: 1}})) {
        cardOwner.increaseTerraformRating(1, {log: true});
      }
    }
  }
}

