import {Tag} from '../../../common/cards/Tag';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {CorporationCard} from '../corporation/CorporationCard';
import {digit} from '../Options';
import {CardResource} from '../../../common/CardResource';
import {IPlayer} from '../../IPlayer';
import {SelectCard} from '../../inputs/SelectCard';
import {ICorporationCard} from '../corporation/ICorporationCard';
import {Size} from '../../../common/cards/render/Size';
import {AndOptions} from '../../inputs/AndOptions';
import {ICard} from '../ICard';
import {UnderworldExpansion} from '../../underworld/UnderworldExpansion';
import {SelectClaimedUndergroundToken} from '../../inputs/SelectClaimedUndergroundToken';

export class AeronGenomics extends CorporationCard implements ICorporationCard {
  constructor() {
    super({
      name: CardName.AERON_GENOMICS,
      tags: [Tag.ANIMAL],
      startingMegaCredits: 35,
      resourceType: CardResource.ANIMAL,

      victoryPoints: {resourcesHere: {}, per: 3},

      behavior: {
        stock: {steel: 5},
        addResources: 2,
      },

      metadata: {
        cardNumber: 'UC07',
        description: 'You start with 35 M€, 5 steel, and 2 animals on this card. 1 VP per 3 animals on this card.',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(35).steel(5, {digit}).resource(CardResource.ANIMAL, 2).br;
          b.effect(
            'When playing an animal card, you can remove animals from here to ' +
            'change the card\'s global requirement by 1 step for every 1 animal removed.',
            (eb) => eb.resource(CardResource.ANIMAL).startEffect.text('+/-1 global parameter', Size.SMALL)).br;
          b.action('Discard up to 2 of your claimed underground resource tokens to place the same number of animals on ANY card.', (ab) => {
            ab.undergroundResources(2).asterix().startAction.resource(CardResource.ANIMAL, 2).asterix();
          });
        }),
      },
    });
  }

  public canAct(player: IPlayer): boolean {
    if (player.underworldData.tokens.every((t) => t.shelter || t.active)) {
      this.warnings.add('underworldtokendiscard');
    }
    return player.underworldData.tokens.length > 0;
  }

  public action(player: IPlayer) {
    const andOptions = new AndOptions();
    let selected: ICard = this; // Initializing it to this prevents it from being undefined.
    let indexes: Array<number> = [];

    andOptions.options.push(
      new SelectCard('Select card to gain animals', '', player.getResourceCards(CardResource.ANIMAL))
        .andThen(([card]) => {
          selected = card;
          return undefined;
        }));
    andOptions.options.push(new SelectClaimedUndergroundToken(player.underworldData.tokens, 1, 2)
      .andThen((is) => {
        indexes = is;
        return undefined;
      }));
    andOptions.cb = (() => {
      const sorted = indexes.slice().sort().reverse();
      for (const idx of sorted) {
        UnderworldExpansion.removeClaimedToken(player, idx);
      }
      const amount = indexes.length;
      player.addResourceTo(selected, {qty: amount, log: true});

      return undefined;
    });
    return andOptions;
  }
}
