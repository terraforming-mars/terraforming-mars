import {CardName} from '@/common/cards/CardName';

/** Help text shown for cards whose rules need extra explanation. */
export const CARD_HELP_TEXT: Partial<Record<CardName, string>> = {
  [CardName.AIR_RAID]: `Air Raid requires removing 1 floater and stealing exactly 5 M€ from one opponent. These are treated as a package deal, so Air Raid cannot be played unless an opponent has at least 5 M€. If no opponent has 5 M€, the card is unavailable even if you have a floater.`,

  [CardName.LAW_SUIT]: `Law Suit may target any player who removed your resources or decreased your production this generation.`,

  [CardName.ROBOTIC_WORKFORCE]:
`From the unofficial FAQ 1.7:

* **This card ONLY copies the <u>production box (brown background)</u> on the bottom of a <u>building card,</u> not other effects. Any decreases in production outlined in the box must still be performed.**

  For example, if playing this card on "Immigrant City" [44], you would copy only the bottom production box (minus 1 energy production, minus 2 MC production) and not the top production box (1 MC production when a city is played).

* This card can be used to duplicate production from a Prelude card with a building tag.

* This card can be used to copy the Research Network prelude card to gain 1 MC production (by treating the Wild tag as a building tag for that action).

* This card can also be used to duplicate production from a corporation with a building tag (e.g., Manutech).
* It cannot copy production boxes that are part of an effect or action in the upper panel of a blue card or on a corporation.
* Only a production box on the lower panel (on a green or blue card) can be copied, or production on a corporation that is NOT part of an action or effect. For example, "Robotic Workforce" can copy the steel production from the Factorum corporation, but not the energy
production.

* If copying a card that reduces production of any player (e.g., "Heat Trappers" [78]) you once again can choose any player to reduce production from (even a different player than was chosen for the originally played card).
* This card cannot be played if you have no building cards in play with a production box that you can fully copy.
* This card cannot be used on an opponent's project card/Prelude card/corporation - only your own.
* When copying "Mining Rights" [41] or "Mining Area" [42] (placed on a space with a steel or titanium
placement bonus, granting the corresponding production) Robotic Workforce will copy the exact production that was obtained from the tile when it was placed (either titanium or steel).
* When copying "Medical Lab" [79], you recount your current number of building tags when you play "Robotic Workforce" and increase your MC production accordingly (in which case you may gain more production than when you originally played "Medical Lab" [79]).`,

  [CardName.BOTANICAL_EXPERIENCE]:
`Botanical Experience has the following text: "Players may remove your plants, but you only lose half, rounded up." It is not clear whether  this means:
1. Half your plants are protected or
2. The event does half of its damage.

The decision is to go with 2 - the effect is reduced by half.`,

  [CardName.LUNA_ECUMENOPOLIS]: `This is a tricky card to understand, but it goes like this: you'll wind up placing two colony tiles. The first one has to be next to two colony tiles _already on The Moon._ The second one has to be next to two colony tiles, one of which could be the one you already placed.`,

  [CardName.THE_ARCHAIC_FOUNDATION_INSTITUTE]: `This card has an extra action for turning 3 resource cubes into a TR. The reason for this seemingly obvious action is to account for the outside case that a player can't accord to raise their TR when playing Turmoil because the Reds are in power.`,

  [CardName.SAGITTA_FRONTIER_SERVICES]:
`*  Event tags count as tags for Sagitta Frontier Services [ref](https://boardgamegeek.com/thread/3154781/article/42964845#42964845)
*  Wild tags do not count for Sagitta Frontier Services. [ref](https://boardgamegeek.com/thread/2031069/article/43202892#43202892)`,

  [CardName.PRICE_WARS]:
`Price Wars cannot be replayed by Odyssey or Playwrights. Once it is discarded, the effect ongoing effect is also removed from play. It is strange for an event to have a generational effect.

That makes this card's interaction with Odyssey and Playwrights different from cards like Indentured Servants and Conscription, which have an additional effect after it is discarded. For the moment, rather than have bad effects, it's being considered not playable.`,

  [CardName.PHILARES]: `Philares's effect does not trigger when tiles are placed on The Moon. This is an intentional decision to prevent it from being overpowered.`,

  [CardName.MINING_GUILD]: `Mining Guild's effect does not trigger when tiles are placed on The Moon. This is an intentional decision to prevent it from being overpowered.`,

  [CardName.ASTRA_MECHANICA]: `Fan expansion note: You may not choose cards that return cards to your hand. This would create a situation where cards could be endlessly retrieved.`,

  [CardName.FLOYD_CONTINUUM]: `Fan expansion note: This will apply to Venus but not The Moon.`,

  [CardName.MARS_FRONTIER_ALLIANCE]: `This card allows the player to use a party's passive effects. Kelvinists and Scientists have _active_ effects. That is why they are not available as options.`,

  [CardName.RED_TOURISM_WAVE]: `Fan expansion note: This does not apply to The Moon.`,

  [CardName.HYDROGEN_PROCESSING_PLANT]: `Oxygen cannot be reduced once it's already at its goal.`,
} as const;
