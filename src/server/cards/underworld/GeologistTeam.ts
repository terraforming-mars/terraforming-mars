import {CardName} from '@/common/cards/CardName';
import {CardRenderer} from '@/server/cards/render/CardRenderer';
import {Tag} from '@/common/cards/Tag';
import {IProjectCard} from '@/server/cards/IProjectCard';
import {CardType} from '@/common/cards/CardType';
import {ActionCard} from '@/server/cards/ActionCard';
import {all} from '@/server/cards/Options';
import {IPlayer} from '@/server/IPlayer';
import {Space} from '@/server/boards/Space';

export class GeologistTeam extends ActionCard implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.GEOLOGIST_TEAM,
      cost: 6,
      tags: [Tag.SCIENCE],

      action: {
        underworld: {identify: 1},
      },

      metadata: {
        cardNumber: 'U001',
        renderData: CardRenderer.builder((b) => {
          b.action('Identify 1 underground resource.',
            (ab) => ab.empty().startAction.identify(1));
          b.br;
          b.effect('When ANY player identifies an underground resource that depicts an ocean, YOU gain 1 TR.',
            (eb) => eb.identify(1, {all}).oceans(1).asterix().startEffect.tr(1));
        }),
      },
    });
  }

  public onIdentificationByAnyPlayer(cardOwner: IPlayer, _identifyingPlayer: IPlayer | undefined, space: Space) {
    if (space.undergroundResources === 'ocean') {
      if (cardOwner.canAfford({cost: 0, tr: {tr: 1}})) {
        cardOwner.increaseTerraformRating(1, {log: true});
      }
    }
  }
}

