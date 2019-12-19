export const HTML_DATA: Map<string, string> =
  new Map ([
    ["Colonizer Training Camp",`
        <div class="title background-color-automated ">Colonizer Training Camp</div>
        <div class="price ">8</div>
        <div class="tag tag1 tag-building "></div>
        <div class="tag tag2 tag-jovian "></div>
        <div class="content ">
            <div class="points points-big ">2</div>
            <div class="requirements requirements-max ">max 5% O2</div>
            <div class="description ">
                (Oxygen must be 5% or less.)
            </div>
        </div>
`],
["Asteroid Mining Consortium",`
        <div class="title background-color-automated ">Asteroid Mining Consortium</div>
        <div class="price">13</div>
        <div class="tag tag1 tag-jovian"></div>
        <div class="corporate-icon project-icon"></div>
        <div class="content ">
            <div class="points points-big ">1</div>
            <div class="requirements ">Titanium production</div>
            <div class="production-box production-box-size1a ">
                <div class="production-prefix ">&#x2796;&#xFE0E;</div><div class="titanium production red-outline "></div><br>
                <div class="production-prefix ">&#x2795;&#xFE0E;</div><div class="titanium production "></div>
            </div>
            <div class="description " style="margin-top:0px;">
                (Requires that you have titanium production. Decrease any titanium production 1 step and increase your own 1 step.)
            </div>
        </div>
`],
["Deep Well Heating",`
        <div class="title background-color-automated ">Deep Well Heating</div>
        <div class="price ">13</div>
        <div class="tag tag1 tag-building "></div>
        <div class="tag tag2 tag-power "></div>
        <div class="content">
            <div class="production-box ">
                <div class="energy production "></div>
            </div>
            <div class="tile temperature-tile " style="margin-left:20px "></div>
            <div class="description ">
                (Increase your Energy production 1 step. Increase temperature 1 step.)
            </div>
        </div>
`],
["Cloud Seeding",`
        <div class="title background-color-automated ">Cloud Seeding</div>
        <div class="price ">11</div>
        <div class="content ">
            <div class="requirements ">3 Oceans</div>
            <div class="production-box production-box-size2a ">
                <div class="production-prefix ">&#x2796;&#xFE0E;</div><div class="money production ">1</div><div class="heat production red-outline "></div><br>
                <div class="production-prefix ">&#x2795;&#xFE0E;</div><div class="plant production "></div><div class="plant production "></div>
            </div>
            <div class="description ">
              (Requires 3 ocean tiles. Decrease your MC production 1 step and any heat production 1 step. Increase your Plant production 2 steps.)
            </div>
        </div>
`],
["Search For Life",`
        <div class="title background-color-active ">Search for Life</div>
        <div class="price ">3</div>
        ##RESOURCES##
        <div class="tag tag1 tag-science "></div>
        <div class="content ">
            <div class="points points-big">3/<div class="resource science"></div></div>
            <div class="requirements requirements-max ">max 6% O2</div>
            <div class=" "><span class=" money resource ">1</span> <span class="red-arrow "></span> <span class="microbe resource "></span>*  :  <div class="resource science"></div> </div>
            <div class="description ">
                (Action: Spend 1 MC to reveal the top card of the draw deck. If that card has a Microbe tag, add a Science resource here.)<br><br>
                (3 VPs if you have one or more Science resources here.)
            </div>
        </div>
`],
["Inventors' Guild",`
        <div class="title background-color-active ">Inventors' Guild</div>
        <div class="price ">9</div>
        <div class="corporate-icon project-icon"></div>
        <div class="tag tag1 tag-science "></div>
        <div class="content ">
            <span class="red-arrow "></span> <span style="font-size:14px; ">ACTION: LOOK AT THE TOP CARD AND EITHER BUY IT OR DISCARD IT</span>
        </div>
`],
["Martian Rails",`
        <div class="title background-color-active ">Martian Rails</div>
        <div class="price ">13</div>
        <div class="tag tag1 tag-building "></div>
        <div class="content ">
            <span class="energy resource "></span> <span class="red-arrow "></span>
            <span class=" money resource ">1</span> / <span class="city-tile-small tile red-outline "></span>
            <div class="description ">
                (Action: Spend 1 Energy to gain 1 MC for each City tile ON MARS.)
            </div>
        </div>
`],
["Capital",`
        <div class="title background-color-automated ">Capital</div>
        <div class="price ">26</div>
        <div class="tag tag1 tag-building "></div>
        <div class="tag tag2 tag-city "></div>
        <div class="content ">
            <div class="points ">1/<span class="resource ocean-resource "></span></div>
            <div class="requirements ">4 Oceans</div>
            <div class="production-box production-box-size2a ">
                <div class="production-prefix ">&#x2796;&#xFE0E;</div><div class="energy production "></div><div class="energy production "></div><br>
                <div class="production-prefix ">&#x2795;&#xFE0E;</div><div class="money production ">5</div>
            </div>
            <div class="special-tile tile capitol ">&#x2302&#xFE0E;</div>
            <div class="description " style="text-align:left;">
                (Requires 4 ocean tiles. Place this tile. Decrease your Energy production 2 steps and increase your MC production 5 steps.<br>
                <div style="font-size:9px;line-height:12px;margin-top:10px ">
                    1 ADDITIONAL VP FOR EACH <br>OCEAN TILE ADJACENT <br> TO THIS CITY TILE.
                </div>
            </div>
        </div>
`],
["Asteroid",`
        <div class="title background-color-events ">Asteroid</div>
        <div class="price ">14</div>
        <div class="tag tag1 tag-event "></div>
        <div class="tag tag2 tag-space "></div>
        <div class="content ">
            <div class="tile temperature-tile "></div><br>
            <div class=" titanium resource "></div><div class=" titanium resource "></div><br>
            - <div class="resource plant red-outline "></div><div class="plant resource red-outline "></div><div class="plant resource red-outline "></div>
            <div class="description ">
                (Raise temperature 1 step and gain 2 titanium. Remove up to 3 Plants from any player.)
            </div>
        </div>
`],
["Comet",`
        <div class="title background-color-events ">Comet</div>
        <div class="price ">21</div>
        <div class="tag tag1 tag-event "></div>
        <div class="tag tag2 tag-space "></div>
        <div class="content ">
            <div class="tile temperature-tile "></div><div class="tile ocean-tile "></div>
            <br>
          - <div class="plant resource red-outline "></div><div class="plant resource red-outline "></div><div class="plant resource red-outline "></div>
            <div class="description ">
                (Raise temperature 1 step and place an ocean tile. Remove up to 3 Plants from any player.)
            </div>
        </div>
`],
["Big Asteroid",`
        <div class="title background-color-events ">Big Asteroid</div>
        <div class="price ">27</div>
        <div class="tag tag1 tag-event "></div>
        <div class="tag tag2 tag-space "></div>
        <div class="content ">
            <div class="tile temperature-tile "></div>
            <div class="tile temperature-tile "></div><br>
            <div class="titanium resource "></div><div class="titanium resource "></div><div class="titanium resource "></div><div class="titanium resource "></div> <br>
          - <div class="plant resource red-outline "></div><div class="plant resource red-outline "></div><div class="plant resource red-outline "></div><div class="plant resource red-outline "></div>
            <div class="description ">
                (Raise temperature 2 steps and gain 4 titanium. Remove up to 4 Plants from any player.)
            </div>
        </div>
`],
["Water Import From Europa",`
        <div class="title background-color-active ">Water Import from Europa</div>
        <div class="price ">25</div>
        <div class="tag tag1 tag-space "></div>
        <div class="tag tag2 tag-jovian "></div>
        <div class="content ">
            <div class="points points-big">1/<span class="tag-jovian resource-tag"></span></div>
            <div class=" money resource ">12</div> (<span class="titanium " style="margin:0px;padding:1px;padding-top:3px;border-radius:5px; "></span>)
            <span class="red-arrow "></span> <div class="ocean-tile tile "></div>
            <div class="description ">
                (Action: Pay 12 MC to place an ocean tile. TITANIUM MAY BE USED as if playing a Space card.)<br><br>
                (1 VP for each Jovian tag you have.)
            </div>
        </div>
`],
["Space Elevator",`
        <div class="title background-color-active ">Space Elevator</div>
        <div class="price ">27</div>
        <div class="tag tag1 tag-space "></div>
        <div class="tag tag2 tag-building "></div>
        <div class="corporate-icon project-icon"></div>
        <div class="content ">
            <div class="points points-big ">2</div>
            <span class=" steel resource "></span> <span class="red-arrow "></span> <span class="money resource ">5</span>
            <div class="description ">
                (Action: Spend 1 steel to gain 5 MC.)
            </div><br>
            <div class="production-box "><div class="titanium production "></div></div>
            <div class="description ">
                (Increase your titanium production 1 step.)
            </div>
        </div>
`],
["Development Center",`
        <div class="title background-color-active ">Development Center</div>
        <div class="price ">11</div>
        <div class="tag tag1 tag-building "></div>
        <div class="tag tag2 tag-science "></div>
        <div class="corporate-icon project-icon"></div>
        <div class="content ">
            <span class="energy resource "></span> <span class="red-arrow "></span> <span class="card resource "></span>
            <div class="description ">
                (Action: Spend 1 Energy to draw a card.)
            </div>
        </div>
`],
["Equatorial Magnetizer",`
        <div class="title background-color-active ">Equatorial Magnetizer</div>
        <div class="price ">11</div>
        <div class="tag tag1 tag-building "></div>
        <div class="content ">
            <div class="production-box production-box-size1a ">
                <div class="production-prefix ">&#x2796;&#xFE0E;</div><div class="energy production "></div>
            </div>
            <span class="red-arrow " style="margin-left:5px; "></span>
            <div class="rating tile "></div>
            <div class="description ">
                (Action: Decrease your Energy production 1 step to increase your terraform rating 1 step.)
            </div>
        </div>
`],
["Domed Crater",`
        <div class="title background-color-automated ">Domed Crater</div>
        <div class="price ">24</div>
        <div class="tag tag1 tag-building "></div>
        <div class="tag tag2 tag-city "></div>
        <div class="content ">
            <div class="points points-big ">1</div>
            <div class="requirements requirements-max ">max 7% O2</div>
            <div class="production-box production-box-size1a " style="margin-bottom:5px;">
                <div class="production-prefix ">&#x2796;&#xFE0E;</div><div class="energy production "></div>
                <div class="production-prefix ">&#x2795;&#xFE0E;</div><div class="money production ">3</div>
            </div>
            <div class="tile city-tile " style="margin-left:20px;margin-bottom:5px;"></div><br>
            <div class="plant resource "></div><div class="plant resource "></div><div class="plant resource "></div>
            <div class="description " style="margin-top:-5px;font-size:11px;text-align: left">
                (Oxygen must be 7% or less. Gain 3 plants. Place a City tile.
                Decrease<br>your Energy production 1 <br>step and increase your <br>MC production 3 steps.)
            </div>
        </div>
`],
["Noctis City",`
        <div class="title background-color-automated ">Noctis City</div>
        <div class="price ">18</div>
        <div class="tag tag1 tag-building "></div>
        <div class="tag tag2 tag-city "></div>
        <div class="content ">
            <div class="production-box production-box-size1a ">
                <div class="production-prefix ">&#x2796;&#xFE0E;</div><div class="energy production "></div>
                <div class="production-prefix ">&#x2795;&#xFE0E;</div><div class="money production ">3</div>
            </div>
            <div class="tile city-tile " style="margin-left:20px "></div><br>
            <div class="description ">
                (Decrease your Energy production 1 step and increase your MC production 3 steps.
                Place a City ON THE RESERVED AREA, disregarding normal placement restrictions.)
            </div>
        </div>
`],
["Methane From Titan",`
        <div class="title background-color-automated ">Methane from Titan</div>
        <div class="price ">28</div>
        <div class="tag tag1 tag-space "></div>
        <div class="tag tag2 tag-jovian "></div>
        <div class="content ">
            <div class="points points-big ">2</div>
            <div class="requirements ">2% O2</div>
            <div class="production-box production-box-size2 ">
                <div class="production heat "></div><div class="production heat "></div>
                <div class="production plant "></div><div class="production plant "></div>
            </div>
            <div class="description ">
                (Requires 2% oxygen. Increase your heat production 2 steps and your Plant production 2 steps.)
            </div>
        </div>
`],
["Imported Hydrogen",`
        <div class="title background-color-events ">Imported Hydrogen</div>
        <div class="price ">16</div>
        <div class="tag tag1 tag-event "></div>
        <div class="tag tag2 tag-space "></div>
        <div class="tag tag3 tag-earth "></div>
        <div class="content ">
            <span>3</span><div class="resource plant "></div> OR <span>3</span><div class="resource microbe "></div>* OR <span>2</span><div class="resource animal "></div>*
            <br><div class="tile ocean-tile "></div>
            <div class="description ">
                (Gain 3 Plants, or add 3 Microbes or 2 Animals to ANOTHER card. Place an ocean tile.)
            </div>
        </div>
`],
["Research Outpost",`
        <div class="title background-color-active ">Research Outpost</div>
        <div class="price ">18</div>
        <div class="tag tag1 tag-building "></div>
        <div class="tag tag2 tag-city "></div>
        <div class="tag tag3 tag-science "></div>
        <div class="content ">
            : <span class="money resource ">-1</span>
            <div class="description ">
                (Effect: When you play a card, you pay 1 MC less for it.)
            </div><br><br>
            <div class="tile city-tile "></div>
            <div class="description ">
                (Place a city tile NEXT TO NO OTHER TILE.)
            </div>
        </div>
`],
["Phobos Space Haven",`
        <div class="title background-color-automated ">Phobos Space Haven</div>
        <div class="price ">25</div>
        <div class="tag tag1 tag-space "></div>
        <div class="tag tag2 tag-city "></div>
        <div class="content ">
            <div class="points points-big ">3</div>
            <div class="production-box "><div class="titanium production "></div></div>
            <div class="tile city-tile " style="margin-left:20px "></div>
            <div class="description ">
                (Increase your titanium production 1 step and place a City tile ON THE RESERVED AREA.)
            </div>
        </div>
`],
["Black Polar Dust",`
        <div class="title background-color-automated ">Black Polar Dust</div>
        <div class="price ">15</div>
        <div class="content ">
            <div class="production-box production-box-size3a ">
                <div class="production-prefix ">&#x2796;&#xFE0E;</div><div class="money production ">2</div><br>
                <div class="production-prefix ">&#x2795;&#xFE0E;</div><div class="heat production "></div><div class="heat production "></div><div class="heat production "></div>
            </div>
            <div class="tile ocean-tile "></div>
            <div class="description ">
                (Place an ocean tile. Decrease your MC production 2 steps and increase your heat production 3 steps.)
            </div>
        </div>
`],
["Arctic Algae",`
        <div class="title background-color-active ">Arctic Algae</div>
        <div class="price ">12</div>
        <div class="tag tag1 tag-plant "></div>
        <div class="content ">
            <div class="requirements requirements-max ">max -12 C </div>
            <div class="tile ocean-tile red-outline "></div> : <div class="resource plant "></div><div class="resource plant "></div><br>
            <div class="description ">
                (Effect: When anyone places an ocean tile, gain 2 Plants.)
            </div>
            <div class="resource plant "></div>
            <div class="description ">
                (It must be -12 C or colder to play. Gain 1 Plant.)
            </div>
        </div>
`],
["Predators",`
        <div class="title background-color-active ">Predators</div>
        <div class="price ">14</div>
        ##RESOURCES##
        <div class="tag tag1 tag-animal "></div>
        <div class="content ">
            <div class="points ">1/<div class="animal resource "></div></div>
            <div class="requirements">11% O2</div>
            <div class="resource animal red-outline "></div> <span class="red-arrow "></span> <div class="animal resource "></div>
            <div class="description ">
                (Action: Remove 1 Animal from any card and add it to this card.)
            </div><br>
            <div class="description ">
                (Requires 11% oxygen. 1 VP per Animal on this card.)
            </div>
        </div>
`],
["Space Station",`
        <div class="title background-color-active ">Space Station</div>
        <div class="price ">10</div>
        <div class="tag tag1 tag-space "></div>
        <div class="corporate-icon project-icon"></div>
        <div class="content ">
            <div class="points points-big ">1</div>
            <div class="resource-tag tag-space"></div> : <div class="money resource ">-2</div>
            <div class="description ">
                (Effect: When you play a Space card, you pay 2 MC less for it.)
            </div>
        </div>
`],
["Eos Chasma National Park",`
        <div class="title background-color-automated ">Eos Chasma National Park</div>
        <div class="price ">16</div>
        <div class="tag tag1 tag-building "></div>
        <div class="tag tag2 tag-plant "></div>
        <div class="content ">
            <div class="points points-big ">1</div>
            <div class="requirements">-12 C</div>
            <div class="resource animal "></div>*<div class="resource plant " style="margin-left:15px "></div><div class="resource plant "></div><div class="resource plant "></div><br>
            <div class="production-box production-box ">
                <div class="money production ">2</div>
            </div>
            <div class="description ">
                (Requires -12 C or warmer. Add 1 Animal TO ANY ANIMAL CARD. Gain 3 Plants. Increase your MC production 2 steps.)
            </div>
        </div>
`],
["Interstellar Colony Ship",`
        <div class="title background-color-events ">Interstellar Colony Ship</div>
        <div class="price ">24</div>
        <div class="tag tag1 tag-event "></div>
        <div class="tag tag2 tag-space "></div>
        <div class="tag tag3 tag-earth "></div>
        <div class="corporate-icon project-icon"></div>
        <div class="content ">
            <div class="points points-big ">4</div>
            <div class="requirements ">5 Science</div>
        </div>
`],
["Security Fleet",`
        <div class="title background-color-active ">Security Fleet</div>
        <div class="price ">12</div>
        ##RESOURCES##
        <div class="tag tag1 tag-space "></div>
        <div class="corporate-icon project-icon"></div>
        <div class="content ">
            <div class="points ">1/<div class="resource " style="padding-bottom:2px;padding-top:2px;font-size:22px;background-color:rgb(230,230,230);font-weight:normal ">&#x1F680&#xFE0E;</div></div>
            <div class="resource titanium "></div> <span class="red-arrow "></span> <div class="resource " style="padding-bottom:2px;padding-top:2px;font-size:22px;background-color:rgb(230,230,230);font-weight:normal ">&#x1F680&#xFE0E;</div>
            <div class="description ">
                (Action: Spend 1 titanium to add 1 fighter resource to this card.)
            </div>
            <div class="description ">
                (1 VP for each fighter resource on this card.) <br>
            </div>
        </div>
`],
["Cupola City",`
        <div class="title background-color-automated ">Cupola City</div>
        <div class="price ">16</div>
        <div class="tag tag1 tag-building "></div>
        <div class="tag tag2 tag-city "></div>
        <div class="content ">
            <div class="requirements requirements-max ">max 9% O2</div>
            <div class="production-box production-box-size1a ">
                <div class="production-prefix ">&#x2796;&#xFE0E;</div><div class="energy production "></div>
                <div class="production-prefix ">&#x2795;&#xFE0E;</div><div class="money production ">3</div>
            </div>
            <div class="tile city-tile " style="margin-left:20px "></div>
            <div class="description ">
                (Oxygen must be 9% or less. Place a City tile. Decrease your Energy production 1 step and increase your MC production 3 steps.)
            </div>
        </div>
`],
["Lunar Beam",`
        <div class="title background-color-automated ">Lunar Beam</div>
        <div class="price ">13</div>
        <div class="tag tag1 tag-power "></div>
        <div class="tag tag2 tag-earth "></div>
        <div class="content ">
            <div class="production-box production-box-size2a ">
                <div class="production-prefix ">&#x2796;&#xFE0E;</div><div class="money production ">2</div><br>
                <div class="production-prefix ">&#x2795;&#xFE0E;</div><div class="heat production "></div><div class="heat production "></div><br>
                <div class="production-prefix ">&#x2795;&#xFE0E;</div><div class="energy production "></div><div class="energy production "></div>
            </div>
            <div class="description ">
                (Decrease your MC production 2 steps and increase your heat production and Energy production 2 steps each.)
            </div>
        </div>
`],
["Optimal Aerobraking",`
        <div class="title background-color-active ">Optimal Aerobraking</div>
        <div class="price ">7</div>
        <div class="tag tag1 tag-space "></div>
        <div class="content ">
            <div class="resource-tag tag-space "></div> <div class="resource-tag tag-event "></div> : <div class="resource money ">3</div><div class="resource heat "></div><div class="resource heat "></div><div class="resource heat "></div>
            <div class="description ">
                (Effect: When you play a Space Event, you gain 3 MC and 3 heat.)
            </div>
        </div>
`],
["Underground City",`
        <div class="title background-color-automated ">Underground City</div>
        <div class="price ">18</div>
        <div class="tag tag1 tag-building "></div>
        <div class="tag tag2 tag-city "></div>
        <div class="content ">
            <div class="production-box production-box-size2a ">
                <div class="production-prefix ">&#x2796;&#xFE0E;</div><div class="energy production "></div><div class="energy production "></div>
                <div class="production-prefix ">&#x2795;&#xFE0E;</div><div class="steel production "></div><div class="steel production "></div>
            </div>
            <div class="tile city-tile " style="margin-left:20px "></div>
            <div class="description ">
                (Place a City tile. Decrease your Energy production 2 steps and increase your steel production 2 steps.)
            </div>
        </div>
`],
["Regolith Eaters",`
        <div class="title background-color-active ">Regolith Eaters</div>
        <div class="price ">13</div>
        ##RESOURCES##
        <div class="tag tag1 tag-microbe "></div>
        <div class="tag tag2 tag-science "></div>
        <div class="content ">
            <div class="red-arrow "></div> <div class="microbe resource "></div><br>
            OR <div class="microbe resource "></div><div class="microbe resource "></div> <div class="red-arrow "></div> <div class="tile oxygen-tile "></div>
            <div class="description ">
                (Action: Add 1 Microbe to this card, or remove 2 Microbes from this card to raise oxygen level 1 step.)
            </div>
        </div>
`],
["GHG Producing Bacteria",`
        <div class="title background-color-active ">GHG Producing Bacteria</div>
        <div class="price ">8</div>
        ##RESOURCES##
        <div class="tag tag1 tag-microbe "></div>
        <div class="tag tag2 tag-science "></div>
        <div class="content ">
            <div class="requirements ">4% O2</div>
            <div class="red-arrow "></div> <div class="microbe resource "></div><br>
            OR <div class="microbe resource "></div><div class="microbe resource "></div> <div class="red-arrow "></div> <div class="tile temperature-tile "></div>
            <div class="description ">
                (Action: Add 1 Microbe to this card, or remove 2 Microbes to raise temperature 1 step.)<br><br>
                (Requires 4% oxygen.)
            </div>
        </div>
`],
["Ants",`
        <div class="title background-color-active ">Ants</div>
        <div class="price ">9</div>
        ##RESOURCES##
        <div class="tag tag1 tag-microbe "></div>
        <div class="content ">
            <div class="points ">1/2<div class="resource microbe "></div></div>
            <div class="requirements ">4% O2</div>
            <div class="microbe resource red-outline "></div> <div class="red-arrow "></div> <div class="microbe resource "></div>
            <div class="description ">
                (Action: Remove 1 Microbe from any card to add 1 to this card.)
                <br><br>
                (Requires 4% oxygen. 1 VP per 2 Microbes on this card.)
            </div>
        </div>
`],
["Release of Inert Gases",`
        <div class="title background-color-events ">Release of Inert Gases</div>
        <div class="price ">14</div>
        <div class="tag tag1 tag-event "></div>
        <div class="content ">
            <div class="tile rating "></div>  <div class="tile rating "></div>
            <div class="description ">
                (Raise your terraform rating 2 steps.)
            </div>
        </div>
`],
["Nitrogen-Rich Asteroid",`
        <div class="title background-color-events ">Nitrogen-Rich Asteroid</div>
        <div class="price ">31</div>
        <div class="tag tag1 tag-event "></div>
        <div class="tag tag2 tag-space "></div>
        <div class="content ">
            <div class="production-box production-box-size3">
      <div class="production plant" style="margin-left:37px"></div> OR <br> 3 <div class="tag-plant resource-tag"></div> : 4<div class="plant production"></div>
    </div><br>
    <div class="tile rating"></div>
    <div class="tile rating"></div>
    <div class="tile temperature-tile"></div><br>
    <div class="description">
      (Raise your terraforming rating 2 steps and temperature 1 step. Increase your Plant production 1 step, or 4 steps if you have 3 Plant tags.)
    </div>
    </div>
`],
["Rover Construction",`
    <div class="title background-color-active">Rover Construction</div>
    <div class="price">8</div>
    <div class="tag tag1 tag-building"></div>
    <div class="content">
      <div class="points points-big">1</div>
      <div class="tile city-tile-small red-outline"></div> :
      <div class="money resource">2</div>
      <div class="description">
        (Effect: When any City tile is placed, gain 2 MC.)
      </div>
    </div>
`],
["Deimos Down",`
    <div class="title background-color-events">Deimos Down</div>
    <div class="price">31</div>
    <div class="tag tag1 tag-event"></div>
    <div class="tag tag2 tag-space"></div>
    <div class="content">
      <div class="tile temperature-tile"></div>
      <div class="tile temperature-tile"></div>
      <div class="tile temperature-tile"></div><br>
      <div class=" steel resource"></div><div class=" steel resource"></div><div class=" steel resource"></div><div class=" steel resource"></div><br>
      -8 <div class="resource plant red-outline"></div>
      <div class="description">
        (Raise temperature 3 steps and gain 4 steel. Remove up to 8 Plants from any player.)
      </div>
    </div>
`],
["Asteroid Mining",`
    <div class="title background-color-automated">Asteroid Mining</div>
    <div class="price">30</div>
    <div class="tag tag1 tag-space"></div>
    <div class="tag tag2 tag-jovian"></div>
    <div class="content">
      <div class="points points-big">2</div>
      <div class="production-box production-box-size2">
        <div class="production titanium"></div><div class="production titanium"></div>
      </div>
      <div class="description">
        (Increase your titanium production 2 steps.)
      </div>
    </div>
`],
["Food Factory",`
    <div class="title background-color-automated">Food Factory</div>
    <div class="price">12</div>
    <div class="tag tag1 tag-building"></div>
    <div class="content">
      <div class="points points-big">1</div>
      <div class="production-box production-box-size1a">
        <div class="production-prefix">&#x2796;&#xFE0E;</div><div class="plant production"></div>
        <div class="production-prefix">&#x2795;&#xFE0E;</div><div class="money production">4</div>
      </div>
      <div class="description">
        (Decrease your Plant production 1 step and increase your MC production 4 steps.)
      </div>
    </div>
`],
["ArchaeBacteria",`
    <div class="title background-color-automated">Archaebacteria</div>
    <div class="price">6</div>
    <div class="tag tag1 tag-microbe"></div>
    <div class="content">
      <div class="requirements requirements-max">max -18 C</div>
      <div class="production-box">
        <div class="plant production"></div>
      </div>
      <div class="description">
        (It must be -18 C or colder. Increase your Plant production 1 step.)
      </div>
    </div>
`],
["Carbonate Processing",`
    <div class="title background-color-automated">Carbonate Processing</div>
    <div class="price">6</div>
    <div class="tag tag1 tag-building"></div>
    <div class="content">
      <div class="production-box production-box-size3a">
        <div class="production-prefix">&#x2796;&#xFE0E;</div><div class="energy production"></div><br>
        <div class="production-prefix">&#x2795;&#xFE0E;</div><div class="heat production"></div><div class="heat production"></div><div class="heat production"></div>
      </div>
      <div class="description">
        (Decrease your Energy production 1 step and increase your heat production 3 steps.)
      </div>
    </div>
`],
["Natural Preserve",`
    <div class="title background-color-automated">Natural Preserve</div>
    <div class="price">9</div>
    <div class="tag tag1 tag-building"></div>
    <div class="tag tag2 tag-science"></div>
    <div class="content">
      <div class="points points-big">1</div>
      <div class="requirements requirements-max">max 4% O2</div>
      <div class="production-box">
        <div class="money production">1</div>
      </div>
      <div class="tile special-tile" style="font-size:30px;margin-left:20px;">&#x2642;</div>*
      <div class="description">
        (Oxygen must be 4% or less. Place this tile NEXT TO NO OTHER TILE. Increase your MC production 1 step.)
      </div>
    </div>
`],
["Nuclear Power",`
    <div class="title background-color-automated">Nuclear Power</div>
    <div class="price">10</div>
    <div class="tag tag1 tag-building"></div>
    <div class="tag tag2 tag-power"></div>
    <div class="content">
      <div class="production-box production-box-size3a">
        <div class="production-prefix">&#x2796;&#xFE0E;</div><div class="money production">2</div><br>
        <div class="production-prefix">&#x2795;&#xFE0E;</div><div class="energy production"></div><div class="energy production"></div><div class="energy production"></div>
      </div>
      <div class="description">
        (Decrease your MC production 2 steps and increase your Energy production 3 steps.)
      </div>
    </div>
`],
["Lightning Harvest",`
    <div class="title background-color-automated">Lightning Harvest</div>
    <div class="price">8</div>
    <div class="tag tag1 tag-power"></div>
    <div class="corporate-icon project-icon"></div>
    <div class="content">
      <div class="points points-big">1</div>
      <div class="requirements">3 Science</div>
      <div class="production-box production-box-size2">
        <div class="energy production"></div><div class="money production">1</div>
      </div>
      <div class="description">
        (Requires 3 Science tags. Increase your Energy production and your MC production up one step each.)
      </div>
    </div>
`],
["Algae",`
    <div class="title background-color-automated">Algae</div>
    <div class="price">10</div>
    <div class="tag tag1 tag-plant"></div>
    <div class="content">
      <div class="requirements">5 Oceans</div>
      <div class="production-box production-box-size2">
        <div class="plant production"></div><div class="plant production"></div>
      </div>
      <div class="plant resource" style="margin-left:20px"></div>
      <div class="description">
        (Requires 5 ocean tiles. Gain 1 Plant and increase your Plant production 2 steps.)
      </div>
    </div>
`],
["Adapted Lichen",`
    <div class="title background-color-automated">Adapted Lichen</div>
    <div class="price">9</div>
    <div class="tag tag1 tag-plant"></div>
    <div class="content">
      <div class="production-box">
        <div class="plant production"></div>
      </div>
      <div class="description">
        (Increase your Plant production 1 step.)
      </div>
    </div>
`],
["Tardigrades",`
      <div class="title background-color-active">Tardigrades</div>
      <div class="price">4</div>
      ##RESOURCES##
      <div class="tag tag1 tag-microbe"></div>
      <div class="corporate-icon project-icon"></div>
      <div class="content">
        <div class="points">1/4<div class="resource microbe"></div>
        </div>
        <div class="red-arrow"></div>
        <div class="microbe resource"></div><br>
        <div class="description">
          (Action: Add 1 Microbe to this card.)
          <br><br> (1 VP per 4 Microbes on this card.)
        </div>
      </div>
`],
["Virus",`
      <div class="title background-color-events">Virus</div>
      <div class="price">1</div>
      <div class="tag tag1 tag-event"></div>
      <div class="tag tag2 tag-microbe"></div>
      <div class="corporate-icon project-icon"></div>
      <div class="content">
        -2<div class="resource animal red-outline"></div> OR -5<div class="resource plant red-outline"></div>
        <div class="description">
          (Remove up to 2 Animals or 5 Plants from any player.)
        </div>
      </div>
`],
["Miranda Resort",`
      <div class="title background-color-automated">Miranda Resort</div>
      <div class="price">12</div>
      <div class="tag tag1 tag-space"></div>
      <div class="tag tag2 tag-jovian"></div>
      <div class="corporate-icon project-icon"></div>
      <div class="content">
        <div class="points points-big">1</div>
        <div class="production-box production-box-size2a">
          <div class="production money">1</div> / <div class="resource-tag tag-earth"></div>
        </div>
        <div class="description">
          (Increase your MC production 1 step for each Earth tag you have.)
        </div>
      </div>
`],
["Fish",`
      <div class="title background-color-active">Fish</div>
      <div class="price">9</div>
      ##RESOURCES##
      <div class="tag tag1 tag-animal"></div>
      <div class="content">
        <div class="points">1/<div class="animal resource"></div>
        </div>
        <div class="requirements">+2 C</div>
        <span class="red-arrow"></span>
        <div class="animal resource"></div>
        <div class="description">
          (Action: Add 1 Animal to this card.)
        </div><br>
        <div class="production-box production-box-size1a" style="margin-top:-10px;">
          <div class="production-prefix">&#x2796;&#xFE0E;</div><div class="plant production red-outline"></div>
        </div>
        <div class="description" style="text-align:left;margin-top:-5px;">
          (Requires +2 C or warmer. Decrease any Plant production 1 step.<br> 1 VP for each Animal <br> on this card.)
        </div>
      </div>
`],
["Lake Marineris",`
      <div class="title background-color-automated">Lake Marineris</div>
      <div class="price">18</div>
      <div class="content">
        <div class="points points-big">2</div>
        <div class="requirements">0 C</div>
        <div class="tile ocean-tile"></div>
        <div class="tile ocean-tile"></div><br>
        <div class="description">
          (Requires 0 C or warmer. Place 2 ocean tiles.)
        </div>
      </div>
`],
["Small Animals",`
      <div class="title background-color-active">Small Animals</div>
      <div class="price">6</div>
      ##RESOURCES##
      <div class="tag tag1 tag-animal"></div>
      <div class="content">
        <div class="points">1/2<div class="animal resource"></div>
        </div>
        <div class="requirements">6% O2</div>
        <span class="red-arrow"></span>
        <div class="animal resource"></div>
        <div class="description" style="margin-bottom:5px;">
          (Action: Add 1 Animal to this card.)
        </div>
        <div class="production-box production-box-size1a">
          <div class="production-prefix">&#x2796;&#xFE0E;</div><div class="plant production red-outline"></div>
        </div>
        <div class="description" style="text-align:left;">
          (Requires 6% oxygen. Decrease any Plant production 1 step. <br>1 VP per 2 Animals <br>on this card.)
        </div>
      </div>
`],
["Kelp Farming",`
      <div class="title background-color-automated">Kelp Farming</div>
      <div class="price">17</div>
      <div class="tag tag1 tag-plant"></div>
      <div class="content">
        <div class="points points-big">1</div>
        <div class="requirements">6 Oceans</div>
        <div class="production-box production-box-size3">
          <div class="money production">2</div><br>
          <div class="plant production"></div><div class="plant production"></div><div class="plant production"></div>
        </div>
        <div class="plant resource" style="margin-left:20px"></div>
        <div class="plant resource"></div>
        <div class="description">
          (Requires 6 ocean tiles. Increase your MC production 2 steps and your Plant production 3 steps. Gain 2 Plants.)
        </div>
      </div>
`],
["Mine",`
      <div class="title background-color-automated">Mine</div>
      <div class="price">4</div>
      <div class="tag tag1 tag-building"></div>
      <div class="corporate-icon project-icon"></div>
      <div class="content">
        <div class="production-box">
          <div class="steel production"></div>
        </div>
        <div class="description">
          (Increase your steel production 1 step.)
        </div>
      </div>
`],
["Vesta Shipyard",`
      <div class="title background-color-automated">Vesta Shipyard</div>
      <div class="price">15</div>
      <div class="tag tag1 tag-space"></div>
      <div class="tag tag2 tag-jovian"></div>
      <div class="corporate-icon project-icon"></div>
      <div class="content">
        <div class="points points-big">1</div>
        <div class="production-box">
          <div class="production titanium"></div>
        </div>
        <div class="description">
          (Increase your titanium production 1 step.)
        </div>
      </div>
`],
["Beam From A Thorium Asteroid",`
      <div class="title background-color-automated" style="font-size:14px">Beam from a Thorium Asteroid</div>
      <div class="price">32</div>
      <div class="tag tag1 tag-power"></div>
      <div class="tag tag2 tag-space"></div>
      <div class="tag tag3 tag-jovian"></div>
      <div class="content">
        <div class="points points-big">1</div>
        <div class="requirements">Jovian</div>
        <div class="production-box production-box-size3">
          <div class="production heat"></div><div class="production heat"></div><div class="production heat"></div><br>
          <div class="production energy"></div><div class="production energy"></div><div class="production energy"></div>
        </div>
        <div class="description">
          (Requires a Jovian tag. Increase your heat production and Energy production 3 steps each.)
        </div>
      </div>
`],
["Mangrove",`
      <div class="title background-color-automated">Mangrove</div>
      <div class="price">12</div>
      <div class="tag tag1 tag-plant"></div>
      <div class="content">
        <div class="points points-big">1</div>
        <div class="requirements">+4 C</div>
        <div class="tile greenery-tile"></div>
        <div class="description">
          (Requires +4 C or warmer. Place a greenery tile ON AN AREA RESERVED FOR OCEAN and raise oxygen 1 step. Disregard normal placement restrictions for this.)
        </div>
      </div>
`],
["Trees",`
      <div class="title background-color-automated">Trees</div>
      <div class="price">13</div>
      <div class="tag tag1 tag-plant"></div>
      <div class="content">
        <div class="points points-big">1</div>
        <div class="requirements">-4 C</div>
        <div class="production-box production-box-size3">
          <div class="plant production"></div><div class="plant production"></div><div class="plant production"></div>
        </div>
        <div class="plant resource" style="margin-left:20px"></div>
        <div class="description">
          (Requires -4 C or warmer. Increase your Plant production 3 steps. Gain 1 Plant.)
        </div>
      </div>
`],
["Great Escarpment Consortium",`
      <div class="title background-color-automated" style="font-size:14px;">Great Escarpment Consortium</div>
      <div class="price">6</div>
      <div class="corporate-icon project-icon"></div>
      <div class="content">
        <div class="requirements">Steel production</div>
        <div class="production-box production-box-size1a">
          <div class="production-prefix">&#x2796;&#xFE0E;</div><div class="production steel red-outline"></div><br>
          <div class="production-prefix">&#x2795;&#xFE0E;</div><div class="production steel"></div>
        </div>
        <div class="description">
          (Requires that you have steel production. Decrease any steel production 1 step and increase your own 1 step.)
        </div>
      </div>
`],
["Mineral Deposit",`
        <div class="title background-color-events ">Mineral Deposit</div>
        <div class="price ">5</div>
        <div class="tag tag1 tag-event "></div>
        <div class="corporate-icon project-icon"></div>
        <div class="content ">
            5<div class="resource steel"></div>
            <div class="description ">
                (Gain 5 steel.)
            </div>
        </div>
`],
["Mining Expedition",`
        <div class="title background-color-events ">Mining Expedition</div>
        <div class="price ">12</div>
        <div class="tag tag1 tag-event "></div>
        <div class="content ">
          <div class="tile oxygen-tile"></div><br>
            <div class="resource steel"></div><div class="resource steel"></div>
            <div class="resource plant red-outline"></div><div class="resource plant red-outline"></div>
            <div class="description ">
                (Raise oxygen 1 step. Remove 2 plants from any player. Gain 2 steel.)
            </div>
        </div>
`],
["Mining Area",`
      <div class="title background-color-automated">Mining Area</div>
      <div class="price">4</div>
      <div class="tag tag1 tag-building"></div>
      <div class="corporate-icon project-icon"></div>
      <div class="content">
        <div class="tile special-tile" style="font-size:40px;color: rgb(73,54,40);">&#x2692;</div>*<br>
        <div class="production-box production-box-size3">
          <div class="steel production"></div> OR <div class="titanium production"></div>
        </div> *
        <div class="description">
          (Place this tile on an area with a steel or titanium placement bonus, adjacent to another of your tiles. Increase your production of that resource 1 step.)
        </div>
      </div>
`],
["Building Industries",`
      <div class="title background-color-automated">Building Industries</div>
      <div class="price">6</div>
      <div class="tag tag1 tag-building"></div>
      <div class="corporate-icon project-icon"></div>
      <div class="content">
        <div class="production-box production-box-size2a">
          <div class="production-prefix ">&#x2796;&#xFE0E;</div><div class="energy production"></div><br>
          <div class="production-prefix ">&#x2795;&#xFE0E;</div><div class="steel production"></div><div class="steel production"></div>
        </div>
        <div class="description">
          (Decrease your Energy production 1 step and increase your steel production 2 steps.)
        </div>
      </div>
`],
["Land Claim",`
        <div class="title background-color-events ">Land Claim</div>
        <div class="price ">1</div>
        <div class="tag tag1 tag-event"></div>
        <div class="corporate-icon project-icon"></div>
        <div class="content " style="font-size:14px;">
            PLACE YOUR MARKER ON A NON-RESERVED AREA. ONLY YOU MAY PLACE A TILE HERE.
        </div>
`],
["Mining Rights",`
      <div class="title background-color-automated">Mining Rights</div>
      <div class="price">9</div>
      <div class="tag tag1 tag-building"></div>
      <div class="content">
        <div class="tile special-tile" style="font-size:40px;color: rgb(73,54,40);">&#x2692;</div>*<br>
        <div class="production-box production-box-size3">
          <div class="steel production"></div> OR <div class="titanium production"></div>
        </div> *
        <div class="description">
          (Place this tile on an area with a steel or titanium placement bonus. Increase that production 1 step.)
        </div>
      </div>
`],
["Sponsors",`
      <div class="title background-color-automated">Sponsors</div>
      <div class="price">6</div>
      <div class="tag tag1 tag-earth"></div>
      <div class="corporate-icon project-icon"></div>
      <div class="content">
        <div class="production-box">
          <div class="money production">2</div>
        </div>
        <div class="description">
          (Increase your MC production 2 steps.)
        </div>
      </div>
`],
["Electro Catapult",`
      <div class="title background-color-active">Electro Catapult</div>
      <div class="price">17</div>
      <div class="tag tag1 tag-building"></div>
      <div class="corporate-icon project-icon"></div>
      <div class="content">
        <div class="points points-big">1</div>
        <div class="requirements requirements-max">max 8% O2</div>
        <div class="resource plant"></div> / <div class="resource steel"></div> <div class="red-arrow"></div> <div class="resource money">7</div><br>
        <div class="description" style="margin-top:-5px;margin-bottom:2px;">
          (Action: Spend 1 plant or 1 steel to gain 7MC.)
        </div>
        <div class="production-box production-box-size1a">
          <div class="production-prefix ">&#x2796;&#xFE0E;</div><div class="energy production"></div>
        </div>
        <div class="description" style="text-align:left;">
          (Oxygen must be 8% or less. Decrease your energy production 1 step.)
        </div>
      </div>
`],
["Earth Catapult",`
        <div class="title background-color-active ">Earth Catapult</div>
        <div class="price ">23</div>
        <div class="tag tag1 tag-earth"></div>
        <div class="corporate-icon project-icon"></div>
        <div class="content ">
          <div class="points points-big">2</div>
            : <span class="money resource ">-2</span>
            <div class="description ">
                (Effect: When you play a card, you pay 2 MC less for it.)
            </div>
        </div>
`],
["Advanced Alloys",`
        <div class="title background-color-active ">Advanced Alloys</div>
        <div class="price ">9</div>
        <div class="corporate-icon project-icon"></div>
        <div class="tag tag1 tag-science "></div>
        <div class="content ">
          <div class="resource titanium"></div> : +<div class="resource money">1</div><br>
          <div class="resource steel"></div> : +<div class="resource money">1</div>
          <div class="description">
            (Effect: Each titanium you have is worth 1 MC extra. Each steel you have is worth 1 MC extra. )
          </div>
        </div>
`],
["Birds",`
        <div class="title background-color-active ">Birds</div>
        <div class="price ">10</div>
        ##RESOURCES##
        <div class="tag tag1 tag-animal "></div>
        <div class="content ">
            <div class="points ">1/<div class="animal resource "></div></div>
            <div class="requirements" style="margin-bottom:5px;">13% O2</div>
            <span class="red-arrow "></span> <div class="animal resource "></div>
            <div class="description " style="margin-top:-5px;margin-bottom:5px;">
                (Action: Add an animal to this card.)
            </div>
            <div class="production-box production-box-size2a">
              <div class="production-prefix">&#x2796;&#xFE0E;</div><div class="plant production red-outline"></div><div class="plant production red-outline"></div>
            </div>
            <div class="description"  style="margin-top:-5px;">
                (Requires 13% oxygen. Decrease any plant production 2 steps. 1 VP per Animal on this card.)
            </div>
        </div>
`],
["Mars University",`
        <div class="title background-color-active ">Mars University</div>
        <div class="price ">8</div>
        <div class="tag tag1 tag-building "></div>
        <div class="tag tag2 tag-science "></div>
        <div class="corporate-icon project-icon"></div>
        <div class="content ">
          <div class="points points-big">1</div>
            <div class="resource-tag science"></div> : - <span class="card resource "></span> + <span class="card resource "></span>
            <div class="description ">
                (Effect: When you play a Science tag, including this, you may discard a card from hand to draw a card.)
            </div>
        </div>
`],
["Viral Enhancers",`
        <div class="title background-color-active ">Viral Enhancers</div>
        <div class="price ">9</div>
        <div class="tag tag1 tag-microbe"></div>
        <div class="tag tag2 tag-science "></div>
        <div class="corporate-icon project-icon"></div>
        <div class="content ">
            <div class="resource-tag tag-plant"></div> / <div class="resource-tag tag-microbe"></div> / <div class="resource-tag tag-animal"></div> : <br><br>
            <div class="plant resource"></div> / <div class="microbe resource"></div>* / <div class="animal resource"></div>*
            <div class="description ">
                (Effect: When you play a  plant, microbe, or an animal tag, including this, gain 1 plant or add 1 resource to THAT CARD.)
            </div>
        </div>
`],
["Towing A Comet",`
        <div class="title background-color-events ">Towing a Comet</div>
        <div class="price ">23</div>
        <div class="tag tag1 tag-event "></div>
        <div class="tag tag2 tag-space "></div>
        <div class="content ">
            <div class="tile oxygen-tile "></div><div class="tile ocean-tile "></div>
            <br>
            <div class="plant resource"></div><div class="plant resource"></div>
            <div class="description ">
                (Gain 2 plants. Raise oxygen level 1 step and place an ocean tile.)
            </div>
        </div>
`],
["Space Mirrors",`
        <div class="title background-color-active ">Space Mirrors</div>
        <div class="price ">3</div>
        <div class="tag tag1 tag-space "></div>
        <div class="tag tag2 tag-power "></div>
        <div class="content ">
            <div class="resource money">7</div>
                          <div class="red-arrow"></div>
            <div class="production-box ">
                <div class="energy production "></div>
            </div>
            <div class="description ">
                (Action: Spend 7 MC to increase your energy production 1 step.)
            </div>
        </div>
`],
["Solar Wind Power",`
        <div class="title background-color-automated ">Solar Wind Power</div>
        <div class="price ">11</div>
        <div class="tag tag1 tag-power "></div>
        <div class="tag tag2 tag-space "></div>
        <div class="tag tag3 tag-science "></div>
        <div class="content ">
            <div class="production-box ">
                <div class="energy production "></div>
            </div> <br>
            <div class="resource titanium"></div><div class="resource titanium"></div>
            <div class="description ">
                (Increase your energy production 1 step and gain 2 titanium.)
            </div>
        </div>
`],
["Ice Asteroid",`
        <div class="title background-color-events ">Ice Asteroid</div>
        <div class="price ">23</div>
        <div class="tag tag1 tag-event "></div>
        <div class="tag tag2 tag-space "></div>
        <div class="content ">
            <div class="tile ocean-tile "></div><div class="tile ocean-tile "></div>
            <div class="description ">
                (Place 2 ocean tiles.)
            </div>
        </div>
`],
["Quantum Extractor",`
        <div class="title background-color-active ">Quantum Extractor</div>
        <div class="price ">13</div>
        <div class="tag tag1 tag-power"></div>
        <div class="tag tag2 tag-science"></div>
        <div class="corporate-icon project-icon"></div>
        <div class="content ">
          <div class="requirements">4 Science</div>
            <div class="resource-tag tag-space"></div> : <div class="money resource ">-2</div>
            <div class="description ">
                (Effect: When you play a Space card, you pay 2 MC less for it.)
            </div>
            <div class="production-box production-box-size1a" style="margin-top:10px">
                4 <div class="energy production"></div>
            </div>
            <div class="description ">
                (Requires 4 science tags. Increase your energy production 4 steps.)
            </div>
        </div>
`],
["Giant Ice Asteroid",`
        <div class="title background-color-events ">Giant Ice Asteroid</div>
        <div class="price ">36</div>
        <div class="tag tag1 tag-event "></div>
        <div class="tag tag2 tag-space "></div>
        <div class="content ">
            <div class="tile temperature-tile "></div><div class="tile temperature-tile "></div> <br>
            <div class="tile ocean-tile "></div><div class="tile ocean-tile "></div>
            <br>
            -6<div class="plant resource red-outline "></div>
            <div class="description ">
                (Raise temperature 2 steps and place 2 ocean tiles. Remove up to 6 plants from any player.)
            </div>
        </div>
`],
["Ganymede Colony",`
        <div class="title background-color-automated ">Ganymede Colony</div>
        <div class="price ">20</div>
        <div class="tag tag1 tag-city"></div>
        <div class="tag tag2 tag-space "></div>
        <div class="tag tag3 tag-jovian "></div>
        <div class="content ">
            <div class="points points-big ">1/<span class="resource-tag tag-jovian"></span></div>
            <div class="tile city-tile"></div>*
            <div class="description ">
                (Place a city tile ON THE RESERVED AREA. 1 VP per Jovian tag you have.)
            </div>
        </div>
`],
["Callisto Penal Mines",`
        <div class="title background-color-automated ">Callisto Penal Mines</div>
        <div class="price ">24</div>
        <div class="tag tag1 tag-space "></div>
        <div class="tag tag2 tag-jovian "></div>
        <div class="corporate-icon project-icon"></div>
        <div class="content ">
            <div class="points points-big">2</div>
            <div class="production-box"><div class="production money">3</div></div>
            <div class="description ">
                (Increase your MC production 3 steps.)
            </div>
        </div>
`],
["Giant Space Mirror",`
        <div class="title background-color-automated ">Giant Space Mirror</div>
        <div class="price ">17</div>
        <div class="tag tag1 tag-space "></div>
        <div class="tag tag2 tag-power "></div>
        <div class="content ">
            <div class="production-box production-box-size3"><div class="production energy"></div><div class="production energy"></div><div class="production energy"></div></div>
            <div class="description ">
                (Increase your energy production 3 steps.)
            </div>
        </div>
`],
["Trans-Neptune Probe",`
        <div class="title background-color-automated ">Trans-Neptune Probe</div>
        <div class="price ">6</div>
        <div class="tag tag1 tag-space "></div>
        <div class="tag tag2 tag-science "></div>
        <div class="corporate-icon project-icon"></div>
        <div class="content ">
          <div class="points points-big">1</div>
        </div>
`],
["Commercial District",`
        <div class="title background-color-automated ">Commercial District</div>
        <div class="price ">16</div>
        <div class="tag tag1 tag-building "></div>
        <div class="corporate-icon project-icon"></div>
        <div class="content ">
          <div class="points big">1/<div class="tile city-tile-small"></div></div>
          <div class="production-box production-box-size1a">
              <div class="production-prefix">&#x2796;&#xFE0E;</div><div class="energy production"></div>
              <div class="production-prefix">&#x2795;&#xFE0E;</div><div class="money production">4</div>
          </div>
          <div class="description" style="margin-top:-5px">
          (Decrease your energy production 1 step and increase your MC production 4 steps.)
          </div>
          <div class="tile special-tile">&#x20ac;</div>
          <div class="description" style="text-align:left">
          (Place this tile. 1 VP PER<br> ADJACENT CITY TILE.)
          </div>
        </div>
`],
["Robotic Workforce",`
        <div class="title background-color-automated ">Robotic Workforce</div>
        <div class="price ">9</div>
        <div class="tag tag1 tag-science "></div>
        <div class="corporate-icon project-icon"></div>
        <div class="content ">
          COPY A &nbsp; <div class="production-box"><div  class="resource-tag tag-building"></div></div>
          <div class="description">
          (Duplicate only the production box of one of your building cards.)
          </div>
        </div>
`],
["Grass",`
      <div class="title background-color-automated">Grass</div>
      <div class="price">11</div>
      <div class="tag tag1 tag-plant"></div>
      <div class="content">
        <div class="requirements">-16 C</div>
        <div class="production-box">
          <div class="plant production"></div>
        </div>
        <div class="plant resource" style="margin-left:20px;"></div><div class="plant resource"></div><div class="plant resource"></div>
        <div class="description">
          (Requires -16 C or warmer. Increase your plant production 1 step. Gain 3 plants.)
        </div>
      </div>
`],
["Heather",`
      <div class="title background-color-automated">Heather</div>
      <div class="price">6</div>
      <div class="tag tag1 tag-plant"></div>
      <div class="content">
        <div class="requirements">-14 C</div>
        <div class="production-box">
          <div class="plant production"></div>
        </div>
        <div class="plant resource" style="margin-left:20px;"></div>
        <div class="description">
          (Requires -14 C or warmer. Increase your plant production 1 step. Gain 1 plant.)
        </div>
      </div>
`],
["Peroxide Power",`
      <div class="title background-color-automated">Peroxide Power</div>
      <div class="price">7</div>
      <div class="tag tag1 tag-building"></div>
      <div class="tag tag2 tag-power"></div>
      <div class="content">
        <div class="production-box production-box-size2a">
          <div class="production-prefix">&#x2796;&#xFE0E;</div><div class="money production">1</div><br>
          <div class="production-prefix">&#x2795;&#xFE0E;</div><div class="energy production"></div><div class="energy production"></div>
        </div>
        <div class="description">
          (Decrease your MC production 1 step and increase your Energy production 2 steps.)
        </div>
      </div>
`],
["Research",`
        <div class="title background-color-automated ">Research</div>
        <div class="price ">11</div>
        <div class="tag tag1 tag-science "></div>
        <div class="tag tag2 tag-science "></div>
        <div class="corporate-icon project-icon"></div>
        <div class="content ">
          <div class="points points-big">1</div>
          <div class="resource card"></div> <div class="resource card"></div>
          <div class="description">
          (Counts as playing 2 science cards. Draw 2 cards.)
          </div>
        </div>
`],
["Gene Repair",`
        <div class="title background-color-automated ">Gene Repair</div>
        <div class="price ">12</div>
        <div class="tag tag1 tag-science "></div>
        <div class="corporate-icon project-icon"></div>
        <div class="content ">
          <div class="points points-big">2</div>
          <div class="requirements">3 Science</div>
          <div class="production-box"><div  class="production money">2</div></div>
          <div class="description">
          (Requires 3 science tags. Increase your MC production 2 steps.)
          </div>
        </div>
`],
["Io Mining Industries",`
        <div class="title background-color-automated ">IO Mining Industries </div>
        <div class="price ">41</div>
        <div class="tag tag1 tag-space "></div>
        <div class="tag tag2 tag-jovian "></div>
        <div class="corporate-icon project-icon"></div>
        <div class="content ">
            <div class="points points-big">1/<span class="tag-jovian resource-tag "></span></div>
            <div class="production-box production-box-size3">
            <div class="production titanium"></div><div class="production titanium"></div><div class="production money">2</div>
            </div>
            <div class="description ">
                (Increase your titanium production 2 steps and your MC production 2 steps. 1 VP per Jovian tag you have.)
            </div>
        </div>
`],
["Bushes",`
      <div class="title background-color-automated">Bushes</div>
      <div class="price">10</div>
      <div class="tag tag1 tag-plant"></div>
      <div class="content">
        <div class="requirements">-10 C</div>
        <div class="production-box production-box-size2">
          <div class="plant production"></div><div class="plant production"></div>
        </div>
        <div class="plant resource" style="margin-left:20px;"></div><div class="plant resource"></div>
        <div class="description">
          (Requires -10 C or warmer. Increase your plant production 2 steps. Gain 2 plants.)
        </div>
      </div>
`],
["Mass Converter",`
        <div class="title background-color-active ">Mass Converter</div>
        <div class="price ">8</div>
        <div class="tag tag1 tag-power "></div>
        <div class="tag tag2 tag-science "></div>
        <div class="corporate-icon project-icon"></div>
        <div class="content ">
          <div class="requirements">5 Science</div>
            <div class="resource-tag tag-space"></div> : <div class="money resource ">-2</div>
            <div class="description ">
                (Effect: When you play a Space card, you pay 2 MC less for it.)
            </div>
            <div class="production-box production-box-size1a" style="margin-top:10px">
              6 <div class="energy production"></div>
            </div>
            <div class="description ">
                (Requires 5 science tags. Increase your energy production 6 steps.)
            </div>
        </div>
`],
["Physics Complex",`
        <div class="title background-color-active ">Physics Complex</div>
        <div class="price ">12</div>
        ##RESOURCES##
        <div class="tag tag1 tag-building "></div>
        <div class="tag tag2 tag-science "></div>
        <div class="corporate-icon project-icon"></div>
        <div class="content ">
          <div class="points points-big">2/<div class="science resource"></div></div>
            6 <div class="energy resource "></div> <div class="red-arrow "></div> <div class="resource science"></div>
            <div class="description ">
                (Action: Spend 6 Energy to add a science resource to this card.)
            </div><br><br><br>
            <div class="description ">
                (2 VP for each science resource on this card.)
            </div>
        </div>
`],
["Greenhouses",`
        <div class="title background-color-automated ">Greenhouses</div>
        <div class="price ">6</div>
        <div class="tag tag1 tag-building "></div>
        <div class="tag tag2 tag-plant "></div>
        <div class="content ">
            <div class="resource plant"></div> / <div class="tile city-tile red-outline"></div>
            <div class="description ">
                (Gain 1 plant for each city tile in play.)
            </div>
        </div>
`],
["Nuclear Zone",`
      <div class="title background-color-automated">Nuclear Zone</div>
      <div class="price">10</div>
      <div class="tag tag1 tag-earth"></div>
      <div class="content">
        <div class="points points-big">-2</div>
          <div class="tile special-tile" style="font-size:40px;">&#x2622;</div><br>
          <div class="tile temperature-tile"></div> <div class="tile temperature-tile"></div>
        <div class="description">
          (Place this tile and raise temperature 2 steps.)
        </div>
      </div>
`],
["Tropical Resort",`
      <div class="title background-color-automated">Tropical Resort</div>
      <div class="price">13</div>
      <div class="tag tag1 tag-building"></div>
      <div class="corporate-icon project-icon"></div>
      <div class="content">
        <div class="points points-big">2</div>
        <div class="production-box production-box-size2a">
          <div class="production-prefix ">&#x2796;&#xFE0E;</div><div class="heat production"></div><div class="heat production"></div><br>
          <div class="production-prefix ">&#x2795;&#xFE0E;</div><div class="money production">3</div>
        </div>
        <div class="description">
          (Reduce your heat production 2 steps and increase your MC production 3 steps.)
        </div>
      </div>
`],
["Toll Station",`
      <div class="title background-color-automated">Toll Station</div>
      <div class="price">12</div>
      <div class="tag tag1 tag-space"></div>
      <div class="corporate-icon project-icon"></div>
      <div class="content">
        <div class="production-box production-box-size2a">
          <div class="production money">1</div> / <div class="resource-tag tag-space red-outline"></div>
        </div>
        <div class="description">
          (Increase your MC production 1 step for each space tag your OPPONENTS have.)
        </div>
      </div>
`],
["Fueled Generators",`
      <div class="title background-color-automated">Fueled Generators</div>
      <div class="price">1</div>
      <div class="tag tag1 tag-building"></div>
      <div class="tag tag2 tag-power"></div>
      <div class="content">
        <div class="production-box production-box-size1a">
          <div class="production-prefix">&#x2796;&#xFE0E;</div><div class="money production">1</div><br>
          <div class="production-prefix">&#x2795;&#xFE0E;</div><div class="energy production"></div>
        </div>
        <div class="description">
          (Decrease your MC production 1 step and increase your Energy production 1 steps.)
        </div>
      </div>
`],
["Ironworks",`
        <div class="title background-color-active ">Ironworks</div>
        <div class="price ">11</div>
        <div class="tag tag1 tag-building "></div>
        <div class="content ">
            4 <span class="energy resource "></span> <span class="red-arrow "></span>
            <div class="steel resource "></div><div class="tile oxygen-tile"></div>
            <div class="description ">
                (Action: Spend 4 energy to gain 1 steel and raise oxygen 1 step.)
            </div>
        </div>
`],
["Power Grid",`
      <div class="title background-color-automated">Power Grid</div>
      <div class="price">18</div>
      <div class="tag tag1 tag-power"></div>
      <div class="content">
        <div class="production-box production-box-size2a">
          <div class="energy production"></div> / <div class="resource-tag tag-power"></div>
        </div>
        <div class="description">
          (Increase your Energy production step for each Power tag you have, including this.)
        </div>
      </div>
`],
["Steelworks",`
        <div class="title background-color-active ">Steelworks</div>
        <div class="price ">15</div>
        <div class="tag tag1 tag-building "></div>
        <div class="content ">
            4 <span class="energy resource "></span> <span class="red-arrow "></span>
            <div class="steel resource "></div><div class="resource steel"></div> <div class="tile oxygen-tile" style="margin-left:0px;"></div>
            <div class="description ">
                (Action: Spend 4 energy to gain 2 steel and increase oxygen 1 step.)
            </div>
        </div>
`],
["Ore Processor",`
        <div class="title background-color-active ">Ore Processor</div>
        <div class="price ">13</div>
        <div class="tag tag1 tag-building "></div>
        <div class="content ">
            4 <span class="energy resource "></span> <span class="red-arrow "></span>
            <div class="titanium resource "></div><div class="tile oxygen-tile"></div>
            <div class="description ">
                (Action: Spend 4 energy to gain 1 titanium and increase oxygen 1 step.)
            </div>
        </div>
`],
["Earth Office",`
        <div class="title background-color-active ">Earth Office</div>
        <div class="price ">1</div>
        <div class="tag tag1 tag-earth "></div>
        <div class="corporate-icon project-icon"></div>
        <div class="content ">
            <div class="resource-tag tag-earth"></div> : <div class="money resource ">-3</div>
            <div class="description ">
                (Effect: When you play an Earth card, you pay 3 MC less for it.)
            </div>
        </div>
`],
["Acquired Company",`
      <div class="title background-color-automated">Acquired Company</div>
      <div class="price">10</div>
      <div class="tag tag1 tag-earth"></div>
      <div class="corporate-icon project-icon"></div>
      <div class="content">
        <div class="production-box">
          <div class="money production">3</div>
        </div>
        <div class="description">
          (Increase your MC production 3 steps.)
        </div>
      </div>
`],
["Media Archives",`
      <div class="title background-color-automated">Media Archives</div>
      <div class="price">8</div>
      <div class="tag tag1 tag-earth"></div>
      <div class="corporate-icon project-icon"></div>
      <div class="content">
          <div class="money resource">1</div> / <div class="resource-tag tag-event red-outline"></div>
        <div class="description">
          (Gain 1 MC for each event EVER PLAYED by all players.)
        </div>
      </div>
`],
["Open City",`
        <div class="title background-color-automated ">Open City</div>
        <div class="price ">23</div>
        <div class="tag tag1 tag-building "></div>
        <div class="tag tag2 tag-city "></div>
        <div class="content ">
            <div class="points points-big ">1</div>
            <div class="requirements">12% O2</div>
            <div class="production-box production-box-size1a " style="margin-bottom:5px;">
                <div class="production-prefix ">&#x2796;&#xFE0E;</div><div class="energy production "></div>
                <div class="production-prefix ">&#x2795;&#xFE0E;</div><div class="money production ">4</div>
            </div>
            <div class="tile city-tile " style="margin-left:20px;margin-bottom:5px; "></div><br>
            <div class="plant resource "></div><div class="plant resource "></div>
            <div class="description " style="margin-top:-5px;font-size:11px;text-align: left">
                (Requires 12% oxygen. Gain 2 plants. Place a City tile.
                Decrease<br>your Energy production 1 <br>step and increase your <br>MC production 4 steps.)
            </div>
        </div>
`],
["Media Group",`
        <div class="title background-color-active ">Media Group</div>
        <div class="price ">6</div>
        <div class="tag tag1 tag-earth "></div>
        <div class="corporate-icon project-icon"></div>
        <div class="content ">
            <div class="resource-tag tag-event"></div> : <div class="money resource ">3</div>
            <div class="description ">
                (Effect: After you play an event card, you gain 3MC.)
            </div>
        </div>
`],
["Business Network",`
        <div class="title background-color-active ">Business Network</div>
        <div class="price ">4</div>
        <div class="corporate-icon project-icon"></div>
        <div class="tag tag1 tag-earth "></div>
        <div class="content ">
            <span class="red-arrow "></span> <span style="font-size:14px; ">ACTION: LOOK AT THE TOP CARD AND EITHER BUY IT OR DISCARD IT</span>
            <br><br>
            <div class="production-box"><div class="production money">-1</div></div>
            <div class="description " >
                (Decrease your MC production 1 step.)
            </div>
        </div>
`],
["Business Contacts",`
        <div class="title background-color-events ">Business Contacts</div>
        <div class="price ">7</div>
        <div class="corporate-icon project-icon"></div>
        <div class="tag tag1 tag-event "></div>
        <div class="tag tag2 tag-earth "></div>
        <div class="content ">
            <span style="font-size:14px; ">LOOK AT THE TOP 4 CARDS FROM THE DECK. TAKE 2 OF THEM INTO HAND AND DISCARD THE OTHER 2</span>
        </div>
`],
["Bribed Committee",`
        <div class="title background-color-events ">Bribed Committee</div>
        <div class="price ">7</div>
        <div class="corporate-icon project-icon"></div>
        <div class="tag tag1 tag-event "></div>
        <div class="tag tag2 tag-earth "></div>
        <div class="content ">
          <div class="points points-big">-2</div>
          <div class="tile rating"></div> <div class="tile rating"></div>
          <div class="description ">
              (Raise your TR 2 steps.)
          </div>
        </div>
`],
["Solar Power",`
        <div class="title background-color-automated ">Solar Power</div>
        <div class="price ">11</div>
        <div class="tag tag1 tag-building "></div>
        <div class="tag tag2 tag-power "></div>
        <div class="content ">
          <div class="points points-big">1</div>
            <div class="production-box ">
                <div class="energy production "></div>
            </div>
            <div class="description ">
                (Increase your energy production 1 step.)
            </div>
        </div>
`],
["Breathing Filters",`
        <div class="title background-color-automated ">Breathing Filters</div>
        <div class="price ">11</div>
        <div class="tag tag1 tag-science "></div>
        <div class="content ">
            <div class="points points-big ">2</div>
            <div class="requirements">7% O2</div>
            <div class="description ">
                (Requires 7% oxygen.)
            </div>
        </div>
`],
["Artificial Photosynthesis",`
        <div class="title background-color-automated ">Artificial Photosynthesis</div>
        <div class="price ">12</div>
        <div class="tag tag1 tag-science "></div>
        <div class="content ">
          <div class="production-box production-box-size4">
            <div class="production plant"></div> OR <div class="production energy"></div><div class="production energy"></div>
          </div>
            <div class="description ">
                (Increase your plant production 1 step or your energy production 2 steps.)
            </div>
        </div>
`],
["Artificial Lake",`
      <div class="title background-color-automated">Artificial Lake</div>
      <div class="price">15</div>
      <div class="tag tag1 tag-building "></div>
      <div class="content">
        <div class="points points-big">1</div>
        <div class="requirements">-6 C</div>
        <div class="tile ocean-tile"></div>*
        <div class="description">
          (Requires -6 C or warmer. Place 1 ocean tile ON AN AREA NOT RESERVED FOR OCEAN.)
        </div>
      </div>
`],
["Geothermal Power",`
        <div class="title background-color-automated ">Geothermal Power</div>
        <div class="price ">11</div>
        <div class="tag tag1 tag-building "></div>
        <div class="tag tag2 tag-power "></div>
        <div class="content ">
            <div class="production-box production-box-size2">
                <div class="energy production "></div><div class="energy production "></div>
            </div>
            <div class="description ">
                (Increase your energy production 2 step.)
            </div>
        </div>
`],
["Farming",`
      <div class="title background-color-automated">Farming</div>
      <div class="price">16</div>
      <div class="tag tag1 tag-plant"></div>
      <div class="content">
        <div class="points points-big">2</div>
        <div class="requirements">+4 C</div>
        <div class="production-box production-box-size2">
          <div class="money production">2</div><br>
          <div class="plant production"></div><div class="plant production"></div>
        </div>
        <div class="plant resource" style="margin-left:20px"></div>
        <div class="plant resource"></div>
        <div class="description">
          (Requires +4 C or warmer. Increase your MC production 2 steps and your plant production 2 steps. Gain 2 Plants.)
        </div>
      </div>
`],
["Dust Seals",`
        <div class="title background-color-automated ">Dust Seals</div>
        <div class="price ">2</div>
        <div class="content ">
            <div class="points points-big ">1</div>
            <div class="requirements requirements-max ">max 3 Oceans</div>
            <div class="description ">
                (Requires 3 or less ocean tiles.)
            </div>
        </div>
`],
["Urbanized Area",`
        <div class="title background-color-automated ">Urbanized Area</div>
        <div class="price ">10</div>
        <div class="tag tag1 tag-building "></div>
        <div class="tag tag2 tag-city "></div>
        <div class="content ">
            <div class="production-box production-box-size1a ">
                <div class="production-prefix ">&#x2796;&#xFE0E;</div><div class="energy production "></div>
                <div class="production-prefix ">&#x2795;&#xFE0E;</div><div class="money production ">2</div>
            </div>
            <div class="tile city-tile " style="margin-left:20px "></div>*<br>
            <div class="description ">
                (Decrease your energy production 1 step and increase your MC production 2 steps.
                Place a city tile ADJACENT TO AT LEAST 2 OTHER CITY TILES.)
            </div>
        </div>
`],
["Sabotage",`
      <div class="title background-color-events">Sabotage</div>
      <div class="price">1</div>
      <div class="tag tag1 tag-event"></div>
      <div class="corporate-icon project-icon"></div>
      <div class="content">
        -3<div class="resource titanium red-outline"></div> OR -4<div class="resource steel red-outline"></div> OR -<div class="resource money red-outline">7</div>
        <div class="description">
          (Remove up to 3 titanium from any player, or 4 steel, or 7 MC.)
        </div>
      </div>
`],
["Moss",`
      <div class="title background-color-automated">Moss</div>
      <div class="price">4</div>
      <div class="tag tag1 tag-plant"></div>
      <div class="content">
        <div class="requirements">3 Oceans</div>
        <div class="production-box">
          <div class="plant production"></div>
        </div>
      &nbsp;&nbsp; -  <div class="plant resource"></div>
        <div class="description">
          (Requires 3 ocean tiles and that you lose 1 plant. Increase your plant production 1 step.)
        </div>
      </div>
`],
["Industrial Center",`
        <div class="title background-color-active ">Industrial Center</div>
        <div class="price ">4</div>
        <div class="tag tag1 tag-building "></div>
        <div class="corporate-icon project-icon"></div>
        <div class="content ">
            <div class="money resource ">7</div> <div class="red-arrow "></div> <div class="production-box"><div class="steel production "></div></div>
            <div class="description ">
                (Action: Spend 7 MC to increase your steel production 1 step.)
            </div><br>
            <div class="tile special-tile">&#x1f3ed;</div>*
            <div class="description ">
                (Place this tile adjacent to a city tile.)
            </div>
        </div>
`],
["Hired Raiders",`
      <div class="title background-color-events">Hired Raiders</div>
      <div class="price">1</div>
      <div class="tag tag1 tag-event"></div>
      <div class="corporate-icon project-icon"></div>
      <div class="content">
        STEAL 2<div class="resource steel red-outline"></div> <br>OR STEAL <div class="resource money red-outline">3</div>
        <div class="description">
          (Steal up to 2 steel, or 3 MC from any player.)
        </div>
      </div>
`],
["Hackers",`
        <div class="title background-color-automated ">Hackers</div>
        <div class="price ">3</div>
        <div class="corporate-icon project-icon"></div>
        <div class="content ">
          <div class="points points-big">-1</div>
            <div class="production-box production-box-size2a ">
                <div class="production-prefix ">&#x2796;&#xFE0E;</div><div class="energy production "></div><div class="money production red-outline">2</div>
                <div class="production-prefix ">&#x2795;&#xFE0E;</div><div class="money production ">2</div>
            </div>
            <div class="description ">
                (Decrease your energy production 1 step and any MC production 2 steps. increase your MC production 2 steps.
            </div>
        </div>
`],
["GHG Factories",`
      <div class="title background-color-automated">GHG Factories</div>
      <div class="price">11</div>
      <div class="tag tag1 tag-building"></div>
      <div class="content">
        <div class="production-box production-box-size2">
          <div class="production-prefix">&#x2796;&#xFE0E;</div>&nbsp;&nbsp;<div class="energy production"></div><br>
          <div class="production-prefix">&#x2795;&#xFE0E;</div>4 <div class="heat production"></div>
        </div>
        <div class="description">
          (Decrease your Energy production 1 step and increase your heat production 4 steps.)
        </div>
      </div>
`],
["Subterranean Reservoir",`
        <div class="title background-color-events ">Subterranean Reservoir</div>
        <div class="price ">11</div>
        <div class="tag tag1 tag-event "></div>
        <div class="content ">
            <div class="tile ocean-tile "></div>
            <div class="description ">
                (Place 1 ocean tile.)
            </div>
        </div>
`],
["Ecological Zone",`
      <div class="title background-color-active">Ecological Zone</div>
      <div class="price">12</div>
      <div class="tag tag1 tag-plant"></div>
      <div class="tag tag2 tag-animal"></div>
      <div class="content">
        <div class="points">1/2<div class="resource animal"></div></div>
        <div class="requirements">Forest</div>
        <div class="tag-animal resource-tag"></div> / <div class="tag-plant resource-tag"></div> : <div class="animal resource"></div>
        <div class="description">
          (Effect: When you play an animal or plant tag (including these), add an animal to this card.)
        </div>
        <div class="tile special-tile" style="margin-left:143px;">&#x1F43e;&#xFE0E;</div>
        <div class="description" style="text-align:left;margin-top:-55px;">
          (Requires that you have a <br>greenery tile. Place this tile <br> adjacent to any greenery <br>tile. <br><br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 1 VP per 2 Animals<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; on this card.)
        </div>
      </div>
`],
["Zeppelins",`
        <div class="title background-color-automated ">Zeppelins</div>
        <div class="price ">13</div>
        <div class="content ">
          <div class="points points-big">1</div>
            <div class="requirements ">5% O2</div>
            <div class="production-box production-box-size2a ">
                <div class="money production ">1</div> / <div class="tile city-tile-small red-outline " style="margin-bottom:0px;"></div><br>
            </div>
            <div class="description ">
              (Requires 5% oxygen. Increase your MC production 1 step for each City tile ON MARS.)
            </div>
        </div>
`],
["Worms",`
        <div class="title background-color-automated ">Worms</div>
        <div class="price ">8</div>
        <div class="tag tag1 tag-microbe"></div>
        <div class="content ">
            <div class="requirements ">4% O2</div>
            <div class="production-box production-box-size2a ">
                <div class="plant production "></div> / 2 <div class="resource-tag tag-microbe "></div><br>
            </div>
            <div class="description ">
              (Requires 4% oxygen. Increase your Plant production 1 step for every 2 Microbe tags you have, including this.)
            </div>
        </div>
`],
["Decomposers",`
      <div class="title background-color-active">Decomposers</div>
      <div class="price">5</div>
      ##RESOURCES##
      <div class="tag tag1 tag-microbe"></div>
      <div class="content">
        <div class="points">1/3<div class="resource microbe"></div></div>
        <div class="requirements">3% O2</div>
        <div class="tag-animal resource-tag"></div> / <div class="tag-plant resource-tag"></div> / <div class="tag-microbe resource-tag"></div> : <div class="microbe resource"></div>
        <div class="description">
          (Effect: When you play an Animal, Plant, or Microbe tag, including this, add a Microbe to this card.)
        </div>
        <div class="description">
          (Requires 3% oxygen. 1 VP per 3 Microbes on this card.)
        </div>
      </div>
`],
["Fusion Power",`
      <div class="title background-color-automated">Fusion Power</div>
      <div class="price">14</div>
      <div class="tag tag1 tag-building"></div>
      <div class="tag tag2 tag-power"></div>
      <div class="tag tag3 tag-science"></div>
      <div class="content">
        <div class="requirements">2 Power</div>
        <div class="production-box production-box-size3">
          <div class="energy production"></div><div class="energy production"></div><div class="energy production"></div>
        </div>
        <div class="description">
          (Requires 2 Power tags. Increase your Energy production 3 steps.)
        </div>
      </div>
`],
["Symbiotic Fungus",`
        <div class="title background-color-active ">Symbiotic Fungus</div>
        <div class="price ">4</div>
        <div class="tag tag1 tag-microbe "></div>
        <div class="content ">
            <div class="requirements ">-14 C</div>
            <div class="red-arrow "></div> <div class="microbe resource "></div>*
            <div class="description ">
                (Action: Add a microbe to ANOTHER card.)
                <br><br>
                (Requires -14 C or warmer.)
            </div>
        </div>
`],
["Extreme-Cold Fungus",`
        <div class="title background-color-active ">Extreme-Cold Fungus</div>
        <div class="price ">13</div>
        <div class="tag tag1 tag-microbe "></div>
        <div class="content ">
            <div class="requirements requirements-max">max -10 C</div>
            <div class="red-arrow " style="margin-left:-9px"></div> <div class="plant resource " ></div><br>
            OR <div class="red-arrow "></div> <div class="microbe resource "></div><div class="microbe resource "></div>*
            <div class="description ">
                (Action: Gain 1 plant or add 2 microbes to ANOTHER card.)
                <br><br>
                (It must be -10 C or colder.)
            </div>
        </div>
`],
["Advanced Ecosystems",`
      <div class="title background-color-automated">Advanced Ecosystems</div>
      <div class="price">11</div>
      <div class="tag tag1 tag-animal"></div>
      <div class="tag tag2 tag-microbe"></div>
      <div class="tag tag3 tag-plant"></div>
      <div class="content">
        <div class="points points-big">3</div>
        <div class="requirements">Plant Microbe Animal</div>
        <div class="description">
          (Requires a Plant tag, a Microbe tag, and an Animal tag.)
        </div>
      </div>
`],
["Great Dam",`
      <div class="title background-color-automated">Great Dam</div>
      <div class="price">12</div>
      <div class="tag tag1 tag-building"></div>
      <div class="tag tag2 tag-power"></div>
      <div class="content">
        <div class="points points-big">1</div>
        <div class="requirements">4 Oceans</div>
        <div class="production-box production-box-size2">
          <div class="energy production"></div><div class="energy production"></div>
        </div>
        <div class="description">
          (Requires 4 ocean tiles. Increase your Energy production 2 steps.)
        </div>
      </div>
`],
["Cartel",`
      <div class="title background-color-automated">Cartel</div>
      <div class="price">8</div>
      <div class="tag tag1 tag-earth"></div>
      <div class="corporate-icon project-icon"></div>
      <div class="content">
        <div class="production-box production-box-size2a">
          <div class="money production">1</div> / <div class="tag-earth v resource-tag"></div>
        </div>
        <div class="description">
          (Increase your MC production 1 step for each Earth tag you have, including this.)
        </div>
      </div>
`],
["Strip Mine",`
        <div class="title background-color-automated ">Strip Mine</div>
        <div class="price ">25</div>
        <div class="tag tag1 tag-building "></div>
        <div class="content ">
            <div class="production-box production-box-size3a ">
                <div class="production-prefix ">&#x2796;&#xFE0E;</div><div class="energy production "></div><div class="energy production "></div><br>
                <div class="production-prefix ">&#x2795;&#xFE0E;</div><div class="steel production "></div><div class="steel production "></div><div class="titanium production "></div>
            </div><br>
            <div class="tile oxygen-tile "></div><div class="tile oxygen-tile "></div>
            <div class="description ">
              (Decrease your Energy production 2 steps. Increase your steel production 2 steps and your titanium production 1 step. Raise oxygen 2 steps.)
            </div>
        </div>
`],
["Wave Power",`
      <div class="title background-color-automated">Wave Power</div>
      <div class="price">8</div>
      <div class="tag tag1 tag-power"></div>
      <div class="content">
        <div class="points points-big">1</div>
        <div class="requirements">3 Oceans</div>
        <div class="production-box">
          <div class="energy production"></div>
        </div>
        <div class="description">
          (Requires 3 ocean tiles. Increase your energy production 1 step.)
        </div>
      </div>
`],
["Lava Flows",`
                <div class="title background-color-events ">Lava Flows</div>
                <div class="price ">18</div>
                <div class="tag tag1 tag-event "></div>
                <div class="content ">
                    <div class="tile temperature-tile "></div><div class="tile temperature-tile "></div><br>
                    <div class="tile special-tile ">&#x1f30b;</div>*
                    <div class="description ">
                      (Raise temperature 2 steps and place this tile ON EITHER THARSIS THOLUS, ASCRAEUS MONS, PAVONIS MONS OR ARSIA MONS.)
                    </div>
                </div>
`],
["Power Plant",`
      <div class="title background-color-automated">Power Plant</div>
      <div class="price">4</div>
      <div class="tag tag1 tag-building"></div>
      <div class="tag tag2 tag-power"></div>
      <div class="content">
        <div class="production-box "><div class="energy production"></div>
        </div>
        <div class="description">
          (Increase your Energy production 1 step.)
        </div>
      </div>
`],
["Mohole Area",`
      <div class="title background-color-automated">Mohole Area</div>
      <div class="price">20</div>
      <div class="tag tag1 tag-building"></div>
      <div class="content">
        <div class="production-box production-box-size1a">
          4 <div class="heat production"></div>
        </div><br>
          <div class="tile special-tile " style="font-size:40px;">&#x2668;</div>*
        <div class="description">
          (Increase your heat production 4 steps. Place this tile ON AN AREA RESERVED FOR OCEAN.)
        </div>
      </div>
`],
["Large Convoy",`
        <div class="title background-color-events ">Large Convoy</div>
        <div class="price ">36</div>
        <div class="tag tag1 tag-event "></div>
        <div class="tag tag2 tag-space "></div>
        <div class="tag tag3 tag-earth "></div>
        <div class="content ">
          <div class="points points-big">2</div>
            <div class="tile ocean-tile "></div> <div class="resource card "></div><div class="resource card"></div><br>
            5<div class="resource plant "></div> OR 4<div class="resource animal "></div>*
            <div class="description ">
              (Place an ocean tile and draw 2 cards. Gain 5 Plants or add 4 Animals to ANOTHER card.)
            </div>
        </div>
`],
["Titanium Mine",`
      <div class="title background-color-automated">Titanium Mine</div>
      <div class="price">7</div>
      <div class="tag tag1 tag-building"></div>
      <div class="corporate-icon project-icon"></div>
      <div class="content">
        <div class="production-box">
          <div class="titanium production"></div>
        </div>
        <div class="description">
          (Increase your titanium production 1 step.)
        </div>
      </div>
`],
["Tectonic Stress Power",`
      <div class="title background-color-automated">Tectonic Stress Power</div>
      <div class="price">18</div>
      <div class="tag tag1 tag-building"></div>
      <div class="tag tag2 tag-power"></div>
      <div class="content">
        <div class="points points-big">1</div>
        <div class="requirements">2 Science</div>
        <div class="production-box production-box-size3">
          <div class="energy production"></div><div class="energy production"></div><div class="energy production"></div>
        </div>
        <div class="description">
          (Requires 2 Science tags. Increase your Energy production 3 steps.)
        </div>
      </div>
`],
["Nitrophilic Moss",`
      <div class="title background-color-automated"> Nitrophilic Moss</div>
      <div class="price">8</div>
      <div class="tag tag1 tag-plant"></div>
      <div class="content">
        <div class="requirements">3 Oceans</div>
        <div class="production-box production-box-size2">
          <div class="plant production"></div><div class="plant production"></div>
        </div>
      &nbsp;&nbsp; -  <div class="plant resource"></div><div class="plant resource"></div>
        <div class="description">
          (Requires 3 ocean tiles and that you lose 2 plants. Increase your plant production 2 steps.)
        </div>
      </div>
`],
["Herbivores",`
        <div class="title background-color-active ">Herbivores</div>
        <div class="price ">12</div>
        ##RESOURCES##
        <div class="tag tag1 tag-animal "></div>
        <div class="content ">
            <div class="points ">1/2<div class="animal resource "></div></div>
            <div class="requirements">8% O2</div>
            <div class="tile greenery-tile" style="margin-top:-3px;"></div> : </span> <div class="animal resource "></div>
            <div class="description " style="margin-top:-8px;">
              (Effect: When you place a greenery tile, add an Animal to this card.)
            </div>
            <div class="animal resource " style="margin-left:105px;"></div>
            <div class="production-box production-box-size1a" style="margin-top:2px;">
                <div class="production-prefix">&#x2796;&#xFE0E;</div><div class="plant production red-outline"></div>
            </div>
            <div class="description" style="position:absolute;text-align:left;margin-top:-25px;">
              (Requires 8% oxygen.<br> Add 1 Animal to this card.<br> Decrease any Plant <br>production 1 step. 1 VP<br> per 2 Animals on this card.)
            </div>
        </div>
`],
["Insects",`
        <div class="title background-color-automated ">Insects</div>
        <div class="price ">9</div>
        <div class="tag tag1 tag-microbe"></div>
        <div class="content ">
            <div class="requirements ">6% O2</div>
            <div class="production-box production-box-size2a ">
                <div class="plant production "></div> / <div class="resource-tag tag-plant "></div><br>
            </div>
            <div class="description ">
              (Requires 6% oxygen. Increase your Plant production 1 step for each plant tag you have.)
            </div>
        </div>
`],
["CEO's Favorite Project",`
        <div class="title background-color-events ">CEO's Favorite Project</div>
        <div class="price ">1</div>
        <div class="tag tag1 tag-event"></div>
        <div class="corporate-icon project-icon"></div>
        <div class="content " style="font-size:14px;">
          ADD 1 RESOURCE TO A CARD WITH AT LEAST 1 RESOURCE ON IT
        </div>
`],
["Anti-Gravity Technology",`
        <div class="title background-color-active ">Anti-Gravity Technology</div>
        <div class="price ">14</div>
        <div class="tag tag1 tag-science"></div>
        <div class="corporate-icon project-icon"></div>
        <div class="content ">
          <div class="points points-big">3</div>
          <div class="requirements">7 Science</div>
            : <span class="money resource ">-2</span>
            <div class="description ">
                (Effect: When you play a card, you pay 2 MC less for it.)
            </div><br><br>
            <div class="description ">
                (Requires 7 science tags.)
            </div>
        </div>
`],
["Investment Loan",`
        <div class="title background-color-events ">Investment Loan</div>
        <div class="price ">3</div>
        <div class="corporate-icon project-icon"></div>
        <div class="tag tag1 tag-event "></div>
        <div class="tag tag2 tag-earth "></div>
        <div class="content ">
            <div class="production-box"><div class="production money">-1</div></div> <div class="resource money" style="margin-left:20px;">10</div>
            <div class="description ">
              (Decrease your MC production 1 step. Gain 10 MC.)
            </div>
        </div>
`],
["Insulation",`
        <div class="title background-color-automated ">Insulation</div>
        <div class="price ">2</div>
        <div class="content ">
            <div class="production-box production-box-size3 ">
                -x<div class="heat production "></div> +<div class="money production ">X</div>
            </div>
            <div class="description ">
              (Decrease your heat production any number of steps and increase your MC production the same number of steps.)
            </div>
        </div>
`],
["Adaptation Technology",`
      <div class="title background-color-active">Adaptation Technology</div>
      <div class="price">12</div>
      <div class="tag tag1 tag-science"></div>
      <div class="content">
        <div class="points points-big">1</div>
        <div class="tile background-color-corporation" style="width:100px;text-shadow:none;color:black;font-size:11px;padding-top:5px;padding-bottom:5px;">Temp / O2 / Ocean</div>: +/- 2
        <div class="description">
          (Effect: Your global requirements are +2 or -2 steps, your choice in each case.)
        </div>
      </div>
`],
["Caretaker Contract",`
        <div class="title background-color-active ">Caretaker Contract</div>
        <div class="price ">3</div>
        <div class="corporate-icon project-icon"></div>
        <div class="content ">
          <div class="requirements">0 C</div>
          8  <span class="heat resource "></span> <span class="red-arrow "></span> <span class="rating tile "></span>
            <div class="description ">
              (Action: Spend 8 heat to increase your terraform rating 1 step.)
            </div><br>
            <div class="description ">
              (Requires 0 C or warmer.)
            </div>
        </div>
`],
["Designed Micro-organisms",`
        <div class="title background-color-automated ">Designed Micro-organisms</div>
        <div class="price ">16</div>
        <div class="tag tag1 tag-microbe"></div>
        <div class="tag tag2 tag-science"></div>
        <div class="content ">
            <div class="requirements requirements-max">max -14 C</div>
            <div class="production-box production-box-size2 ">
                <div class="plant production "></div><div class="plant production "></div>
            </div>
            <div class="description ">
              (It must be -14 C or colder. Increase your Plant production 2 steps.)
            </div>
        </div>
`],
["Standard Technology",`
      <div class="title background-color-active">Standard Technology</div>
      <div class="price">6</div>
      <div class="tag tag1 tag-science"></div>
      <div class="corporate-icon project-icon"></div>
      <div class="content">
        <div class="tile" style="width:100px;text-shadow:none;color:black;font-size:14px;line-height:17px;vertical-align:middle;background-color: rgb(255,204,100);padding:5px;">Standard projects</div> : <div class="money resource">3</div>
        <div class="description">
          (Effect: After you pay for a standard project, except selling patents, you gain 3 MC.)
        </div>
      </div>
`],
["Nitrite Reducing Bacteria",`
        <div class="title background-color-active ">Nitrite Reducing Bacteria</div>
        <div class="price ">11</div>
        ##RESOURCES##
        <div class="tag tag1 tag-microbe "></div>
        <div class="content ">
            <div class="red-arrow "></div> <div class="microbe resource "></div><br>
            OR 3 <div class="microbe resource "></div> <div class="red-arrow "></div> <div class="tile rating "></div>
            <div class="description ">
              (Action: Add 1 Microbe to this card, or remove 3 Microbes to increase your TR 1 step.<br>
            </div><br>
            <div class="microbe resource "></div><div class="microbe resource "></div><div class="microbe resource "></div>
            <div class="description ">
              (Add 3 Microbes to this card.)
            </div>
        </div>
`],
["Industrial Microbes",`
      <div class="title background-color-automated">Industrial Microbes</div>
      <div class="price">12</div>
      <div class="tag tag1 tag-building"></div>
      <div class="tag tag2 tag-microbe"></div>
      <div class="content">
        <div class="production-box">
          <div class="energy production"></div>
          <div class="steel production"></div>
        </div>
        <div class="description">
          (Increase your Energy production and your steel production 1 step each.)
        </div>
      </div>
`],
["Lichen",`
      <div class="title background-color-automated">Lichen</div>
      <div class="price">7</div>
      <div class="tag tag1 tag-plant"></div>
      <div class="content">
        <div class="requirements">-24 C</div>
        <div class="production-box">
          <div class="plant production"></div>
        </div>
        <div class="description">
          (Requires -24 C or warmer. Increase your Plant production 1 step.)
        </div>
      </div>
`],
["Power Supply Consortium",`
        <div class="title background-color-automated">Power Supply Consortium</div>
        <div class="price">5</div>
        <div class="tag tag1 tag-power"></div>
        <div class="corporate-icon project-icon"></div>
        <div class="content">
          <div class="requirements">2 Power</div>
          <div class="production-box production-box-size1a">
              <div class="production-prefix">&#x2796;&#xFE0E;</div><div class="energy production red-outline"></div>
              <div class="production-prefix">&#x2795;&#xFE0E;</div><div class="energy production"></div>
          </div>
          <div class="description">
            (Requires 2 Power tags. Decrease any Energy production 1 step and increase your own 1 step.)
          </div>
        </div>
`],
["Convoy From Europa",`
          <div class="title background-color-events ">Convoy From Europa</div>
          <div class="price ">15</div>
          <div class="tag tag1 tag-event "></div>
          <div class="tag tag2 tag-space "></div>
          <div class="content ">
              <div class="tile ocean-tile "></div> <div class="resource card " style="margin-left:20px;"></div>
              <div class="description ">
                (Place 1 ocean tile and draw 1 card.)
              </div>
          </div>
`],
["Imported GHG",`
          <div class="title background-color-events ">Imported GHG</div>
          <div class="price ">7</div>
          <div class="tag tag1 tag-event "></div>
          <div class="tag tag2 tag-space "></div>
          <div class="tag tag3 tag-earth "></div>
          <div class="content ">
            <div class="production-box ">
                <div class="heat production"></div>
            </div> <div class="heat resource" style="margin-left:20px;"></div><div class="heat resource"></div><div class="heat resource"></div>
              <div class="description ">
                (Increase your heat production 1 step and gain 3 heat.)
              </div>
          </div>
`],
["Imported Nitrogen",`
          <div class="title background-color-events ">Imported Nitrogen</div>
          <div class="price ">23</div>
          <div class="tag tag1 tag-event "></div>
          <div class="tag tag2 tag-space "></div>
          <div class="tag tag3 tag-earth "></div>
          <div class="content ">
            <div class="rating tile"></div> 4<div class="plant resource"></div> 3<div class="microbe resource"></div>* 2<div class="animal resource"></div>*
              <div class="description ">
                (Raise your TR 1 step and gain 4 Plants. Add 3 Microbes to ANOTHER card and 2 Animals to ANOTHER card.)
              </div>
          </div>
`],
["Micro-Mills",`
        <div class="title background-color-automated">Micro-Mills</div>
        <div class="price">3</div>
        <div class="content">
          <div class="production-box">
          <div class="heat production"></div>
          </div><br>
          <div class="description">
            (Increase your heat production 1 step.)
          </div>
        </div>
`],
["Magnetic Field Generators",`
        <div class="title background-color-automated">Magnetic Field Generators</div>
        <div class="price">20</div>
        <div class="tag tag1 tag-building"></div>
        <div class="content">
          <div class="production-box production-box-size2a">
            <div class="production-prefix">&#x2796;&#xFE0E;</div> 4 <div class="energy production"></div><br>
            <div class="production-prefix">&#x2795;&#xFE0E;</div><div class="plant production"></div><div class="plant production"></div>
          </div> <br>
           <div class="tile rating"></div> <div class="tile rating"></div> <div class="tile rating"></div>
          <div class="description">
            (Decrease your Energy production 4 steps and increase your Plant production 2 steps. Raise your TR 3 steps.)
          </div>
        </div>
`],
["Shuttles",`
          <div class="title background-color-active ">Shuttles</div>
          <div class="price ">10</div>
          <div class="tag tag1 tag-space "></div>
          <div class="content ">
            <div class="points points-big">1</div>
            <div class="requirements">5% O2</div>
              <div class="resource-tag tag-space"></div> : <div class="money resource ">-2</div>
              <div class="description ">
                  (Effect: When you play a Space card, you pay 2 MC less for it.)
              </div>
              <div class="production-box production-box-size1a" style="margin-top:10px;margin-right:130px;">
                 <div class="production-prefix">&#x2796;&#xFE0E;</div><div class="energy production"></div>
                   <div class="production-prefix">&#x2795;&#xFE0E;</div><div class="money production">2</div>
              </div>
              <div class="description " style="position:absolute;margin-top:-90px;text-align:left;margin-left:86px;">
                (Requires 5% oxygen. Decrease your Energy production 1 step and increase your MC production 2 steps.)
              </div>
          </div>
`],
["Import of Advanced GHG",`
          <div class="title background-color-events ">Import of Advanced GHG</div>
          <div class="price ">9</div>
          <div class="tag tag1 tag-event "></div>
          <div class="tag tag2 tag-space "></div>
          <div class="tag tag3 tag-earth "></div>
          <div class="content ">
            <div class="production-box production-box-size2">
                <div class="heat production"></div><div class="heat production"></div>
            </div>
              <div class="description ">
                (Increase your heat production 2 steps.)
              </div>
          </div>
`],
["Windmills",`
          <div class="title background-color-automated ">Windmills</div>
          <div class="price ">6</div>
          <div class="tag tag1 tag-building "></div>
          <div class="tag tag2 tag-power "></div>
          <div class="content ">
            <div class="points points-big">1</div>
            <div class="requirements">7% O2</div>
              <div class="production-box ">
                  <div class="energy production "></div>
              </div>
              <div class="description ">
                (Requires 7% oxygen. Increase your Energy production 1 step.)
              </div>
          </div>
`],
["Tundra Farming",`
        <div class="title background-color-automated">Tundra Farming</div>
        <div class="price">16</div>
        <div class="tag tag1 tag-plant"></div>
        <div class="content">
          <div class="points points-big">2</div>
          <div class="requirements">-6 C</div>
          <div class="production-box production-box-size2">
            <div class="plant production"></div><div class="money production">2</div><br>
          </div>
          <div class="plant resource" style="margin-left:20px"></div>
          <div class="description">
            (Requires -6 C or warmer. Increase your Plant production 1 step and your MC production 2 steps. Gain 1 Plant.)
          </div>
        </div>
`],
["Aerobraked Ammonia Asteroid",`
          <div class="title background-color-events " style="font-size:14px">Aerobraked Ammonia Asteroid</div>
          <div class="price ">26</div>
          <div class="tag tag1 tag-event "></div>
          <div class="tag tag2 tag-space "></div>
          <div class="content ">
            <div class="production-box production-box-size3">
                <div class="heat production"></div><div class="heat production"></div><div class="heat production"></div>
                <div class="plant production"></div>
            </div><br>
             <div class="microbe resource"></div><div class="microbe resource"></div>*
              <div class="description ">
                (Add 2 Microbes to ANOTHER card. Increase your heat production 3 steps and your Plant productions 1 step.)
              </div>
          </div>
`],
["Magnetic Field Dome",`
        <div class="title background-color-automated">Magnetic Field Dome</div>
        <div class="price">5</div>
        <div class="tag tag1 tag-building"></div>
        <div class="content">
          <div class="production-box production-box-size2a">
            <div class="production-prefix">&#x2796;&#xFE0E;</div><div class="energy production"></div><div class="energy production"></div><br>
            <div class="production-prefix">&#x2795;&#xFE0E;</div><div class="plant production"></div>
          </div>
           &nbsp;&nbsp;&nbsp;<div class="tile rating"></div>
          <div class="description">
            (Decrease your Energy production 2 steps and increase your Plant production 1 step. Raise your TR 1 step.)
          </div>
        </div>
`],
["Pets",`
        <div class="title background-color-active">Pets</div>
        <div class="price">10</div>
        ##RESOURCES##
        <div class="tag tag1 tag-animal"></div>
        <div class="tag tag2 tag-earth"></div>
        <div class="content">
          <div class="points">1/2<div class="animal resource"></div>
          </div>
          <div class="tile city-tile-small red-outline"></div> : <div class="animal resource"></div> <br>
          <span style="font-size:12px">ANIMALS MAY NOT BE REMOVED FROM THIS CARD</span>
          <div class="description" >
            (Effect: When any City tile is placed, add an Animal to this card.)
          </div><br>
          <div class="animal resource"></div>
          <div class="description" style="text-align:left;margin-top:10px;" >
            (Add 1 Animal to this card.<br> 1 VP per 2 Animals here.)
          </div>
        </div>
`],
["Protected Habitats",`
          <div class="title background-color-active ">Protected Habitats</div>
          <div class="price ">5</div>
          <div class="corporate-icon project-icon"></div>
          <div class="content ">
          <span style="font-size:12px; ">OPPONENTS MAY NOT REMOVE YOUR</span><br>
          <div class="plant resource"></div> <div class="animal resource"></div> <div class="microbe resource"></div>
          </div>
`],
["Protected Valley",`
          <div class="title background-color-automated ">Protected Valley</div>
          <div class="price ">23</div>
          <div class="tag tag1 tag-building "></div>
          <div class="tag tag2 tag-plant "></div>
          <div class="content ">
              <div class="production-box production-box ">
                  <div class="money production ">2</div>
              </div> <div class="tile greenery-tile" style="margin-left:30px;"></div>*
              <div class="description ">
                (Increase your MC production 2 steps. Place on a greenery tile ON AN AREA RESERVED FOR OCEAN, disregarding normal placement restrictions, and increase oxygen 1 step.)
              </div>
          </div>
`],
["Satellites",`
        <div class="title background-color-automated">Satellites</div>
        <div class="price">10</div>
        <div class="tag tag1 tag-space"></div>
        <div class="corporate-icon project-icon"></div>
        <div class="content">
          <div class="production-box production-box-size2a">
            <div class="production money">1</div> / <div class="resource-tag tag-space"></div>
          </div>
          <div class="description">
            (Increase your MC production 1 step for each space tag your have, including this one.)
          </div>
        </div>
`],
["Noctis Farming",`
        <div class="title background-color-automated">Noctis Farming</div>
        <div class="price">10</div>
        <div class="tag tag1 tag-plant"></div>
        <div class="tag tag2 tag-building"></div>
        <div class="content">
          <div class="points points-big">1</div>
          <div class="requirements">-20 C</div>
          <div class="production-box">
            <div class="money production">1</div>
          </div> <div class="resource plant" style="margin-left:20px;"></div><div class="resource plant"></div>
          <div class="description">
            (Requires -20 C or warmer. Increase your MC production 1 step and gain 2 Plants.)
          </div>
        </div>
`],
["Water Splitting Plant",`
          <div class="title background-color-active ">Water Splitting Plant</div>
          <div class="price ">12</div>
          <div class="tag tag1 tag-building "></div>
          <div class="content ">
            <div class="requirements">2 Oceans</div>
              <div class="energy resource "></div><div class="energy resource "></div><div class="energy resource "></div> <div class="red-arrow "></div>
              <div class="tile oxygen-tile"></div>
              <div class="description ">
                (Action: Spend 3 Energy to raise oxygen 1 step.)
                <br><br><br><br>
                (Requires 2 ocean tiles.)
               </div>
          </div>
`],
["Heat Trappers",`
          <div class="title background-color-automated ">Heat Trappers</div>
          <div class="price ">6</div>
          <div class="tag tag1 tag-building "></div>
          <div class="tag tag2 tag-power "></div>
          <div class="content ">
            <div class="points points-big">-1</div>
              <div class="production-box production-box-size2a">
                <div class="production-prefix">&#x2796;&#xFE0E;</div><div class="heat production red-outline "></div><div class="heat production red-outline "></div>
                  <div class="production-prefix">&#x2795;&#xFE0E;</div><div class="energy production "></div>
              </div>
              <div class="description ">
                (Decrease any heat production 2 steps and increase your Energy production 1 step.)
              </div>
          </div>
`],
["Soil Factory",`
          <div class="title background-color-automated ">Soil Factory</div>
          <div class="price ">9</div>
          <div class="tag tag1 tag-building "></div>
          <div class="content ">
            <div class="points points-big ">1</div>
              <div class="production-box production-box-size1a">
                <div class="production-prefix">&#x2796;&#xFE0E;</div><div class="energy production  "></div>
                  <div class="production-prefix">&#x2795;&#xFE0E;</div><div class="plant production "></div>
              </div>
              <div class="description ">
                (Decrease your Energy production 1 step and increase your Plant production 1 step.)
              </div>
          </div>
`],
["Fuel Factory",`
          <div class="title background-color-automated ">Fuel Factory</div>
          <div class="price ">6</div>
          <div class="tag tag1 tag-building "></div>
          <div class="corporate-icon project-icon"></div>
          <div class="content ">
              <div class="production-box production-box-size2a">
                <div class="production-prefix">&#x2796;&#xFE0E;</div><div class="energy production  "></div><br>
                  <div class="production-prefix">&#x2795;&#xFE0E;</div><div class="titanium production "></div><div class="money production ">1</div>
              </div>
              <div class="description ">
                (Decrease your Energy production 1 step and increase your titanium and your MC production 1 step each.)
              </div>
          </div>
`],
["Ice Cap Melting",`
          <div class="title background-color-events ">Ice Cap Melting</div>
          <div class="price ">5</div>
          <div class="tag tag1 tag-event "></div>
          <div class="content ">
            <div class="requirements">+2 C</div>
              <div class="tile ocean-tile "></div>
              <div class="description ">
                  (Requires +2 C or warmer. Place 1 ocean tile.)
              </div>
          </div>
`],
["Corporate Stronghold",`
          <div class="title background-color-automated ">Corporate Stronghold</div>
          <div class="price ">11</div>
          <div class="tag tag1 tag-building "></div>
          <div class="tag tag2 tag-city "></div>
          <div class="corporate-icon project-icon"></div>
          <div class="content ">
            <div class="points points-big">-2</div>
              <div class="production-box production-box-size1a ">
                  <div class="production-prefix ">&#x2796;&#xFE0E;</div><div class="energy production "></div>
                  <div class="production-prefix ">&#x2795;&#xFE0E;</div><div class="money production ">3</div>
              </div>
              <div class="tile city-tile " style="margin-left:20px "></div><br>
              <div class="description ">
                (Decrease your Energy production 1 step and increase your MC production 3 steps. Place a City tile.)
              </div>
          </div>
`],
["Biomass Combustors",`
        <div class="title background-color-automated">Biomass Combustors</div>
        <div class="price">4</div>
        <div class="tag tag1 tag-building"></div>
        <div class="tag tag2 tag-power"></div>
        <div class="content">
          <div class="points points-big">-1</div>
          <div class="requirements">6% O2</div>
          <div class="production-box production-box-size2a">
            <div class="production-prefix">&#x2796;&#xFE0E;</div><div class="plant production red-outline"></div><br>
            <div class="production-prefix">&#x2795;&#xFE0E;</div><div class="energy production"></div><div class="energy production"></div>
          </div>
          <div class="description">
            (Requires 6% oxygen. Decrease any Plant production 1 step and increase your Energy production 2 steps.)
          </div>
        </div>
`],
["Livestock",`
        <div class="title background-color-active">Livestock</div>
        <div class="price">13</div>
        ##RESOURCES##
        <div class="tag tag1 tag-animal"></div>
        <div class="content">
          <div class="points">1/<div class="animal resource"></div>
          </div>
          <div class="requirements">9% O2</div>
          <span class="red-arrow"></span>
          <div class="animal resource"></div>
          <div class="description" style="margin-bottom:5px;">
            (Action: Add 1 Animal to this card.)
          </div>
          <div class="production-box production-box-size1a" style="margin-top:10px;margin-right:150px;">
            <div class="production-prefix">&#x2796;&#xFE0E;</div><div class="plant production"></div>
            <div class="production-prefix">&#x2795;&#xFE0E;</div><div class="money production">2</div>
          </div>
          <div class="description" style="position:absolute;margin-top:-85px;text-align:left;margin-left:80px;font-size:10px;">
            (Requires 9% oxygen. Decrease your Plant production 1 step and increase your MC production 2 steps. 1 VP for each Animal on this card.
          </div>
        </div>
`],
["Olympus Conference",`
          <div class="title background-color-active ">Olympus Conference</div>
          <div class="price ">10</div>
          ##RESOURCES##
          <div class="tag tag1 tag-building "></div>
          <div class="tag tag2 tag-earth "></div>
          <div class="tag tag3 tag-science "></div>
          <div class="corporate-icon project-icon"></div>
          <div class="content ">
            <div class="points points-big">1</div>
              <div class="resource-tag science"></div> : <div class="resource science"></div> OR -<div class="resource science"></div>+<div class="card resource "></div>
              <div class="description ">
                (When you play a Science tag, including this, either add a Science resource to this card, or remove a Science resource from this card to draw a card.)
              </div>
          </div>
`],
["Rad-Suits",`
          <div class="title background-color-automated ">Rad-Suits</div>
          <div class="price ">6</div>
          <div class="corporate-icon project-icon"></div>
          <div class="content ">
            <div class="points points-big">1</div>
            <div class="requirements">2 Cities</div>
            <div class="production-box"><div  class="production money">1</div></div>
            <div class="description">
              (Requires two cities in play. Increase your MC up 1 step.)
            </div>
          </div>
`],
["Aquifer Pumping",`
          <div class="title background-color-active ">Aquifer Pumping</div>
          <div class="price ">18</div>
          <div class="tag tag1 tag-building "></div>
          <div class="content ">
              <div class=" money resource ">8</div> (<span class="steel " style="margin:0px;padding:2px;padding-top:3px;border-radius:5px; "></span>)
              <span class="red-arrow "></span> <div class="ocean-tile tile "></div>
              <div class="description ">
                (Action: Spend 8 MC to place 1 ocean tile. STEEL MAY BE USED as if you were playing a Building card.)
              </div>
          </div>
`],
["Flooding",`
          <div class="title background-color-events ">Flooding</div>
          <div class="price ">7</div>
          <div class="tag tag1 tag-event "></div>
          <div class="content ">
            <div class="points points-big">-1</div>
              <div class="tile ocean-tile " style="margin-right:20px"></div> - <div class="resource money red-outline" >4</div>*
              <div class="description ">
                (Place an ocean tile. IF THERE ARE TILES ADJACENT TO THIS OCEAN TILE, YOU MAY REMOVE 4 MC FROM THE OWNER OF ONE OF THOSE TILES.)
              </div>
          </div>
`],
["Energy Saving",`
        <div class="title background-color-automated">Energy Saving</div>
        <div class="price">15</div>
        <div class="tag tag1 tag-power"></div>
        <div class="content">
          <div class="production-box production-box-size2a">
            <div class="energy production"></div> / <div class="tile city-tile-small red-outline" style="margin-bottom:3px;"></div>
          </div>
          <div class="description">
            (Increase your Energy production 1 step for each City tile in play.)
          </div>
        </div>
`],
["Local Heat Trapping",`
          <div class="title background-color-events ">Local Heat Trapping</div>
          <div class="price ">1</div>
          <div class="tag tag1 tag-event "></div>
          <div class="content ">
              -5<div class="resource heat" style="margin-right:15px;"></div> + &nbsp;&nbsp;&nbsp;4<div class="resource plant"></div> OR 2<div class="resource animal"></div>*
              <div class="description ">
                (Spend 5 heat to gain either 4 Plants, or to add 2 Animals to ANOTHER card.)
              </div>
          </div>
`],
["Permafrost Extraction",`
          <div class="title background-color-events ">Permafrost Extraction</div>
          <div class="price ">8</div>
          <div class="tag tag1 tag-event "></div>
          <div class="content ">
            <div class="requirements">-8 C</div>
              <div class="tile ocean-tile "></div>
              <div class="description ">
                (Requires -8 C or warmer. Place 1 ocean tile.)
              </div>
          </div>
`],
["Invention Contest",`
          <div class="title background-color-events ">Invention Contest</div>
          <div class="price ">2</div>
          <div class="tag tag1 tag-event "></div>
          <div class="tag tag2 tag-science "></div>
          <div class="corporate-icon project-icon"></div>
          <div class="content " style="font-size:14px">
            LOOK AT THE TOP 3 CARDS FROM THE DECK. TAKE 1 OF THEM INTO HAND AND DISCARD THE OTHER 2
          </div>
`],
["Plantation",`
        <div class="title background-color-automated">Plantation</div>
        <div class="price">15</div>
        <div class="tag tag1 tag-plant"></div>
        <div class="content">
          <div class="requirements">2 Science</div>
          <div class="tile greenery-tile"></div>
          <div class="description">
            (Requires 2 Science tags. Place a greenery tile and raise oxygen 1 step.)
          </div>
        </div>
`],
["Power Infrastructure",`
          <div class="title background-color-active ">Power Infrastructure</div>
          <div class="price ">4</div>
          <div class="tag tag1 tag-building "></div>
          <div class="tag tag2 tag-power "></div>
          <div class="corporate-icon project-icon"></div>
          <div class="content ">
              X<div class="energy resource "></div> <div class="red-arrow "></div> <div class="money resource ">X</div>
              <div class="description ">
                (Action: Spend any amount of Energy and gain that amount of MC.)
              </div>
          </div>
`],
["Indentured Workers",`
          <div class="title background-color-events ">Indentured Workers</div>
          <div class="price ">0</div>
          <div class="tag tag1 tag-event "></div>
          <div class="corporate-icon project-icon"></div>
          <div class="content ">
            <div class="points points-big">-1</div>
            <span style="font-size:14px;">NEXT CARD: </span> <div class="resource money">-8</div>
              <div class="description ">
                (The next card you play this generation costs 8 MC less.)
              </div>
          </div>
`],
["Lagrange Observatory",`
          <div class="title background-color-automated ">Lagrange Observatory</div>
          <div class="price ">9</div>
          <div class="tag tag1 tag-space "></div>
          <div class="tag tag2 tag-science "></div>
          <div class="corporate-icon project-icon"></div>
          <div class="content ">
            <div class="points points-big">1</div>
            <div class="resource card"></div>
            <div class="description">
              (Draw 1 card.)
            </div>
          </div>
`],
["Terraforming Ganymede",`
          <div class="title background-color-automated ">Terraforming Ganymede</div>
          <div class="price ">33</div>
          <div class="tag tag1 tag-space "></div>
          <div class="tag tag2 tag-jovian "></div>
          <div class="corporate-icon project-icon"></div>
          <div class="content ">
              <div class="points points-big">2</div>
              <div class="tile rating"></div> / <div class="resource-tag tag-jovian"></div>
              <div class="description ">
                (Raise your TR 1 step for each Jovian tag you have, including this.)
              </div>
          </div>
`],
["Immigration Shuttles",`
          <div class="title background-color-automated ">Immigration Shuttles</div>
          <div class="price ">31</div>
          <div class="tag tag1 tag-space"></div>
          <div class="tag tag2 tag-earth"></div>
          <div class="content ">
            <div class="points big" style="font-size:24px">1/3<div class="tile city-tile-small red-outline"></div></div>
            <div class="production-box ">
                <div class="money production">5</div>
            </div>
            <div class="description" style="margin-top:-5px">
              (Increase your MC production 5 steps. 1 VP for every 3rd City in play.)
            </div>
          </div>
`],
["Restricted Area",`
          <div class="title background-color-active ">Restricted Area</div>
          <div class="price ">11</div>
          <div class="tag tag1 tag-science "></div>
          <div class="corporate-icon project-icon"></div>
          <div class="content ">
              <div class="money resource ">2</div> <div class="red-arrow "></div> <div class="card resource "></div>
              <div class="description ">
                  (Action: Spend 2 MC to draw a card.)
              </div><br>
              <div class="tile special-tile" style="font-size:38px;padding-top:15px;padding-bottom:15px;">&#x20e0;</div>
              <div class="description ">
                (Place this tile.)
              </div>
          </div>
`],
["Immigrant City",`
          <div class="title background-color-active ">Immigrant City</div>
          <div class="price ">13</div>
          <div class="tag tag1 tag-building "></div>
          <div class="tag tag2 tag-city "></div>
          <div class="content ">
              <div class="tile city-tile red-outline"></div> :&nbsp; <div class="production-box"><div class="production money">1</div></div>
              <div class="description ">
                (Effect: When a City tile is placed, including this, increase your MC production 1 step.)
              </div><br>
              <div class="production-box production-box-size2a">
                  <div class="production-prefix">&#x2796;&#xFE0E;</div><div class="production energy"></div><div class="production money">-2</div>
              </div> <div class="tile city-tile "></div>
              <div class="description ">
                (Decrease your Energy production 1 step and decrease your MC production 2 steps. Place a City tile.)
              </div>
          </div>
`],
["Energy Tapping",`
        <div class="title background-color-automated">Energy Tapping</div>
        <div class="price">3</div>
        <div class="tag tag1 tag-power"></div>
        <div class="corporate-icon project-icon"></div>
        <div class="content">
          <div class="points points-big">-1</div>
          <div class="production-box production-box-size1a">
              <div class="production-prefix">&#x2796;&#xFE0E;</div><div class="energy production red-outline"></div>
              <div class="production-prefix">&#x2795;&#xFE0E;</div><div class="energy production"></div>
          </div>
          <div class="description">
            (Decrease any Energy production 1 step and increase your own 1 step.)
          </div>
        </div>
`],
["Underground Detonations",`
          <div class="title background-color-active ">Underground Detonations</div>
          <div class="price ">6</div>
          <div class="tag tag1 tag-building "></div>
          <div class="content ">
            <div class="money resource ">10</div><div class="red-arrow " style="margin-left:5px; "></div>&nbsp;
              <div class="production-box production-box-size2 ">
                  <div class="heat production "></div><div class="heat production "></div>
              </div>
              <div class="description ">
                  (Action: Spend 10MC to increase your heat production 2 steps.)
              </div>
          </div>
`],
["Soletta",`
          <div class="title background-color-automated ">Soletta</div>
          <div class="price ">35</div>
          <div class="tag tag1 tag-space"></div>
          <div class="content ">
            <div class="production-box production-box-size1a">
                7 <div class="heat production"></div>
            </div>
            <div class="description">
              (Increase your heat production 7 steps.)
            </div>
          </div>
`],
["Technology Demonstration",`
          <div class="title background-color-events ">Technology Demonstration</div>
          <div class="price ">5</div>
          <div class="tag tag1 tag-event "></div>
          <div class="tag tag2 tag-space "></div>
          <div class="tag tag3 tag-science "></div>
          <div class="corporate-icon project-icon"></div>
          <div class="content ">
              <div class="resource card"></div> <div class="resource card"></div>
              <div class="description ">
                  (Draw two cards.)
              </div>
          </div>
`],
["Rad-chem Factory",`
        <div class="title background-color-automated">Rad-Chem Factory</div>
        <div class="price">8</div>
        <div class="tag tag1 tag-building"></div>
        <div class="content">
          <div class="production-box production-box-size1a">
            <div class="production-prefix">&#x2796;&#xFE0E;</div><div class="energy production"></div><br>
          </div><br> <div class="tile rating"></div><div class="tile rating"></div>
          <div class="description">
            (Decrease your Energy production 1 step. Raise your TR 2 steps.)
          </div>
        </div>
`],
["Special Design",`
        <div class="title background-color-events">Special Design</div>
        <div class="price">4</div>
        <div class="tag tag1 tag-event"></div>
        <div class="tag tag2 tag-science"></div>
        <div class="content">
          <div class="tile background-color-corporation" style="width:100px;text-shadow:none;color:black;font-size:11px;padding-top:5px;padding-bottom:5px;">Temp / O2 / Ocean</div>: +/- 2
          <div class="description">
            (The next card you play this generation is +2 or -2 steps in global requirements, your choice.)
          </div>
        </div>
`],
["Medical Lab",`
        <div class="title background-color-automated">Medical Lab</div>
        <div class="price">13</div>
        <div class="tag tag1 tag-building"></div>
        <div class="tag tag2 tag-science"></div>
        <div class="corporate-icon project-icon"></div>
        <div class="content">
          <div class="points points-big">1</div>
          <div class="production-box production-box-size3">
            <div class="money production">1</div> / 2 <div class="resource-tag tag-building"></div>
          </div>
          <div class="description">
            (Increase your MC production 1 step for every 2 Building tags you have, including this.)
          </div>
        </div>
`],
["AI Central",`
          <div class="title background-color-active ">AI Central</div>
          <div class="price ">21</div>
          <div class="tag tag1 tag-building "></div>
          <div class="tag tag2 tag-science "></div>
          <div class="corporate-icon project-icon"></div>
          <div class="content ">
            <div class="points points-big">1</div>
              <div class="requirements">3 Science</div>
              <span class="red-arrow "></span> <span class="card resource "></span><span class="card resource "></span>
              <div class="description ">
                  (Action: Draw 2 cards.)
              </div>
              <div class="production-box production-box-size1a" style="margin-right:135px;margin-top:10px;">
                  <div class="production-prefix">&#x2796;&#xFE0E;</div><div class="energy production"></div>
              </div>
              <div class="description" style="position:absolute;text-align:left;margin-top:-53px;margin-left:85px;">
                (Requires 3 Science tags to play. Decrease your Energy production 1 step.)
              </div>
          </div>
`],
["Small Asteroid",`
          <div class="title background-color-events ">Small Asteroid</div>
          <div class="price ">10</div>
          <div class="tag tag1 tag-event "></div>
          <div class="tag tag2 tag-space "></div>
          <div class="promo-icon project-icon"></div>
          <div class="content ">
              <div class="tile temperature-tile "></div><br>
               - <div class="resource plant red-outline "></div><div class="plant resource red-outline "></div>
              <div class="description ">
                  (Increase temperature 1 step. Remove up to 2 plants from any player.)
              </div>
          </div>
`],
["Self-replicating Robots",`
          <div class="title background-color-active ">Self-replicating robots</div>
          <div class="price ">7</div>
          ##RESOURCES##
          <div class="promo-icon project-icon"></div>
          <div class="content ">
            <div class="requirements">2 Science</div>
            <div class="red-arrow "></div>
            <div class="resource card"><div class="production" style="position:absolute;background:white;color:black;margin-left:-4px;margin-top:7px;">2</div><div class="card-icon card-icon-space">&#x2734;</div><div class="card-icon card-icon-building" style="margin-left:37px">&#x2617;</div></div>
            &nbsp;&nbsp;&nbsp;OR&nbsp;&nbsp;&nbsp;
            <div class="red-arrow "></div>
            <div class="production" style="background:white;color:black;vertical-align:middle">X</div> x2
            <div class="description">
              (Action: Reveal and place a SPACE OR BUILDING card here from hand, and place 2 resources on it, OR double the resources on a card here.) <br>
              (Effect: Cards here may be played as if from hand with its cost reduced by the number of resources on it.)<br>
              (Requires 2 Science tags.)
            </div>
          </div>
`],
["Snow Algae",`
        <div class="title background-color-automated">Snow Algae</div>
        <div class="price">12</div>
        <div class="tag tag1 tag-plant"></div>
        <div class="promo-icon project-icon"></div>
        <div class="content">
          <div class="requirements">2 Oceans</div>
          <div class="production-box production-box-size2">
            <div class="plant production"></div><div class="heat production"></div>
          </div>
          <div class="description">
            (Requires 2 oceans. Increase your Plant production and your heat production 1 step each.)
          </div>
        </div>
`],
["Penguins",`
            <div class="title background-color-active ">Penguins</div>
            <div class="price ">7</div>
            ##RESOURCES##
            <div class="tag tag1 tag-animal "></div>
            <div class="promo-icon project-icon"></div>
            <div class="content ">
                <div class="points ">1/<div class="animal resource "></div></div>
                <div class="requirements ">8 Oceans</div>
                <span class="red-arrow "></span> <div class="animal resource "></div>
                <div class="description ">
                    (Action: Add 1 animal to this card.)
                </div><br><br>
                <div class="description ">
                    (Requires 8 oceans. 1 VP for each animal on this card.)
                </div>
            </div>
`],
["Aerial Mappers",`
          <div class="title background-color-active">Aerial Mappers</div>
          <div class="price">11</div>
          ##RESOURCES##
          <div class="tag tag1 tag-venus"></div>
          <div class="venus-icon project-icon"></div>
          <div class="content">
            <div class="points points-big">1</div>
            <div class="red-arrow"></div>
            <div class="floater resource"></div>* OR <div class="floater resource"></div> <div class="red-arrow"></div> <div class="card resource"></div><br>
            <div class="description">
              (Action: Add 1 Floater to ANY card or spend 1 Floater here to draw 1 card).
            </div>
          </div>
`],
["Aerosport Tournament",`
            <div class="title background-color-events ">Aerosport Tournament</div>
            <div class="price ">7</div>
            <div class="tag tag1 tag-event "></div>
            <div class="venus-icon project-icon"></div>
            <div class="content ">
                <div class="points points-big ">1</div>
                <div class="requirements ">5 Floaters</div>
                <div class="resource money">1</div> / <div class="tile city-tile-small red-outline"></div>
                <div class="description">
                  (Requires that you have 5 Floaters. Gain 1 MC per each City tile in play)
                </div>
            </div>
`],
["Air-Scrapping Expedition",`
            <div class="title background-color-events ">Air-Scrapping Expedition</div>
            <div class="price ">13</div>
            <div class="tag tag1 tag-event "></div>
            <div class="tag tag2 tag-venus "></div>
            <div class="venus-icon project-icon"></div>
            <div class="content ">
              <div class="tile venus-tile">V</div> &nbsp;&nbsp;
                <div class="resource floater"><div class="card-icon card-icon-venus">V</div></div>
                  <div class="resource floater"><div class="card-icon card-icon-venus">V</div></div>
                    <div class="resource floater"><div class="card-icon card-icon-venus">V</div></div>
                <div class="description">
                  (Raise Venus 1 step. Add 3 Floaters to ANY Venus CARD)
                </div>
            </div>
`],
["Atalanta Planitia Lab",`
            <div class="title background-color-automated ">Atalanta Planitia Lab</div>
            <div class="price ">10</div>
            <div class="tag tag1 tag-science "></div>
            <div class="tag tag2 tag-venus "></div>
            <div class="venus-icon project-icon"></div>
            <div class="content ">
              <div class="points points-big">2</div>
              <div class="requirements">3 Science</div>
              <div class="resource card"></div> <div class="resource card"></div>
              <div class="description">
              (Requires 3 science tags. Draw 2 cards.)
              </div>
            </div>
`],
["Atmoscoop",`
            <div class="title background-color-automated ">Atmoscoop</div>
            <div class="price ">22</div>
            <div class="tag tag1 tag-space "></div>
            <div class="tag tag2 tag-jovian "></div>
            <div class="venus-icon project-icon"></div>
            <div class="content ">
              <div class="points points-big">1</div>
              <div class="requirements">3 Science</div>
              <div class="tile temperature-tile" style="width:24px"></div><div class="tile temperature-tile" style="width:24px"></div> OR
              <div class="tile venus-tile" style="width:20px">V</div><div class="tile venus-tile" style="width:20px">V</div>
              <div class="resource floater" style="margin-left:150px;"></div><div class="resource floater"></div>*
              <div class="description" style="text-align:left;position:absolute;margin-top:-50px;">
                (Requires 3 Science tags. <br>
                Either raise the temperature <br>
                2 steps, or raise Venus 2 steps.<br>
                Add 2 Floaters to ANY card).
              </div>
            </div>
`],
["Comet for Venus",`
            <div class="title background-color-events ">Comet for Venus</div>
            <div class="price ">11</div>
            <div class="tag tag1 tag-event "></div>
            <div class="tag tag2 tag-space "></div>
            <div class="venus-icon project-icon"></div>
            <div class="content ">
              <div class="tile venus-tile">V</div> &nbsp;&nbsp;
                - <div class="resource money red-outline">4<div class="card-icon card-icon-venus" style="color: white;margin-top: -39px;">V</div></div>
                <div class="description">
                  (Raise Venus 1 step. Remove up to 4MC from any player WITH A VENUS TAG IN PLAY.).
                </div>
            </div>
`],
["Corroder Suits",`
            <div class="title background-color-automated ">Corroder Suits</div>
            <div class="price ">8</div>
            <div class="tag tag1 tag-venus "></div>
            <div class="venus-icon project-icon"></div>
            <div class="content ">
              <div class="production-box"><div class="production money">2</div></div>
               <div class="resource" style="background:white;margin-left:20px;">?<div class="card-icon card-icon-venus" style="color: white;margin-top: -36px;margin-left: 16px;">V</div></div>
              <div class="description">
                (Increase your MC production 2 steps. Add 1 resource to ANY Venus CARD).
              </div>
            </div>
`],
["Dawn City",`
            <div class="title background-color-automated ">Dawn City</div>
            <div class="price ">15</div>
            <div class="tag tag1 tag-city "></div>
            <div class="tag tag2 tag-space "></div>
            <div class="venus-icon project-icon"></div>
            <div class="content ">
              <div class="points points-big">3</div>
                <div class="requirements">4 Science</div>
                  <div class="production-box production-box-size1a">
                      <div class="production-prefix">&#x2796;&#xFE0E;</div><div class="energy production"></div>
                      <div class="production-prefix">&#x2795;&#xFE0E;</div><div class="titanium production"></div>
                  </div> <div class="tile city-tile" style="margin-left:20px"></div>*
              <div class="description" style="margin-top:-5px;">
                (Requires 4 Science tags. Decrease your energy production 1 step. Increase your titanium production 1 step. Place a City tile on the RESERVED AREA).
              </div>
            </div>
`],
["Deuterium Export",`
            <div class="title background-color-active ">Deuterium Export</div>
            <div class="price ">11</div>
            <div class="tag tag1 tag-space "></div>
            <div class="tag tag2 tag-power "></div>
            <div class="tag tag3 tag-venus "></div>
            <div class="venus-icon project-icon"></div>
            <div class="content ">
                <div class="red-arrow " style="margin-left:53px;"></div> <div class="floater resource "></div> <br> OR
                <div class="floater resource "></div> <div class="red-arrow "></div>   <div class="production-box "><div class="energy production "></div></div>
                <div class="description ">
                  (Action: add 1 Floater to this card OR spend 1 Floater here to increase your energy production 1 step).
                </div>
            </div>
`],
["Dirigibles",`
            <div class="title background-color-active ">Dirigibles</div>
            <div class="price ">11</div>
            <div class="tag tag1 tag-venus "></div>
            <div class="venus-icon project-icon"></div>
            <div class="content ">
                <div class="red-arrow "></div> <div class="floater resource "></div>* &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<br>
              <div class="resource-tag tag-venus"></div>  : <div class="floater resource "></div> = <div class="money resource ">3</div>
                <div class="description ">
                  (Action: add 1 Floater to ANY card.)<br><br>
                  (Effect: when playing a Venus tag, Floaters here may be used as payment, and are worth 3MC each)
                </div>
            </div>
`],
["Extractor Balloons",`
            <div class="title background-color-active ">Extractor Balloons</div>
            <div class="price ">21</div>
            <div class="tag tag1 tag-venus "></div>
            <div class="venus-icon project-icon"></div>
            <div class="content ">
                <div class="red-arrow " style="margin-left:95px"></div> <div class="floater resource "></div> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<br>
              OR <div class="floater resource "></div><div class="floater resource "></div> <div class="red-arrow "></div> <div class="tile venus-tile ">V</div>
                <div class="description ">
                  (Action: add 1 Floater to this card, or remove 2 Floaters here to raise Venus 1 step).
                </div>
                <br>
                <div class="floater resource "></div><div class="floater resource "></div><div class="floater resource "></div>
                <div class="description ">
                  (Add 3 Floaters to this card).
                </div>
            </div>
`],
["Extremophiles",`
            <div class="title background-color-active ">Extremophiles</div>
            <div class="price ">3</div>
            <div class="tag tag1 tag-microbe "></div>
            <div class="tag tag2 tag-venus "></div>
            <div class="venus-icon project-icon"></div>
            <div class="content ">
              <div class="points">1/3<div class="resource microbe"></div></div>
              <div class="requirements">2 Science</div>
                <div class="red-arrow "></div> <div class="resource microbe"></div>*
                <div class="description ">
                  (Action: add 1 Microbe to ANY card)
                </div><br>
                <div class="description ">
                  (Requires 2 Science tags. 1 VP for every 3rd Microbe on this card).
                </div>
            </div>
`],
["Floating Habs",`
            <div class="title background-color-active ">Floating Habs</div>
            <div class="price ">5</div>
            <div class="tag tag1 tag-venus "></div>
            <div class="venus-icon project-icon"></div>
            <div class="content ">
              <div class="points">1/2<div class="resource floater"></div></div>
              <div class="requirements">2 Science</div>
                <div class="resource money">2</div> <div class="red-arrow "></div> <div class="resource floater"></div>*
                <div class="description ">
                  (Action: spend 2 MC to add 1 Floater to ANY card).
                </div><br>
                <div class="description ">
                  (Requires 2 Science tags. 1 VP for every 2nd Floater on this card).
                </div>
            </div>
`],
["Forced Precipitation",`
            <div class="title background-color-active ">Forced Precipitation</div>
            <div class="price ">8</div>
            <div class="tag tag1 tag-venus "></div>
            <div class="venus-icon project-icon"></div>
            <div class="content ">
                <div class="money resource " style="margin-left: 60px;">2</div> <div class="red-arrow "></div> <div class="floater resource "></div> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<br>
              OR <div class="floater resource "></div><div class="floater resource "></div> <div class="red-arrow "></div> <div class="tile venus-tile ">V</div>
                <div class="description ">
                  (Action: Spend 2 MC to add 1 Floater to this card, OR spend 2 Floaters here to increase Venus 1 step).
                </div>
            </div>
`],
["Freyja Biodomes",`
            <div class="title background-color-automated ">Freyja Biodomes</div>
            <div class="price ">14</div>
            <div class="tag tag1 tag-plant "></div>
            <div class="tag tag2 tag-venus "></div>
            <div class="venus-icon project-icon"></div>
            <div class="content ">
              <div class="points points-big">2</div>
                <div class="requirements">10% Venus</div>
               <div class="resource microbe"><div class="card-icon card-icon-venus" style="color: white;margin-top: -36px;font-weight:bold;">V</div></div> <div class="resource microbe"><div class="card-icon card-icon-venus" style="font-weight:bold;color: white;margin-top: -36px;">V</div></div>
              &nbsp;&nbsp;  OR &nbsp;&nbsp;
               <div class="resource animal"><div class="card-icon card-icon-venus" style="color: white;margin-top: -36px;font-weight:bold;">V</div></div> <div class="resource animal"><div class="card-icon card-icon-venus" style="font-weight:bold;color: white;margin-top: -36px;">V</div></div>
               <div class="production-box production-box-size1a" style="margin-left:135px;">
                   <div class="production-prefix">&#x2796;&#xFE0E;</div><div class="energy production"></div>
                   <div class="production-prefix">&#x2795;&#xFE0E;</div><div class="money production">2</div>
               </div>
               <div class="description" style="position:absolute;margin-top:-90px;margin-left:10px;text-align:left">
                 (Requires 10% on the <br>
                 Venus track. Add 2 <br>
                 Microbes or 2 Animals<br>
                 to another Venus card. <br>
                 Decrease your energy  <br>
                 production 1 step and <br>
                 increase your MC <br>
                 production 2 steps).
              </div>
            </div>
`],
["GHG Import From Venus",`
            <div class="title background-color-events ">GHG Import From Venus</div>
            <div class="price ">23</div>
            <div class="tag tag1 tag-event "></div>
            <div class="tag tag2 tag-space "></div>
            <div class="tag tag3 tag-venus "></div>
            <div class="venus-icon project-icon"></div>
            <div class="content ">
              <div class="tile venus-tile">V</div> &nbsp;&nbsp;
              <div class="production-box production-box-size3">
                <div class="production heat"></div><div class="production heat"></div><div class="production heat"></div>
              </div>
                <div class="description">
                  (Raise Venus 1 step. Increase your heat production 3 steps).
                </div>
            </div>
`],
["Giant Solar Shade",`
            <div class="title background-color-automated ">Giant Solar Shade</div>
            <div class="price ">27</div>
            <div class="tag tag1 tag-space "></div>
            <div class="tag tag2 tag-venus "></div>
            <div class="venus-icon project-icon"></div>
            <div class="content ">
            <div class="tile venus-tile">V</div><div class="tile venus-tile">V</div><div class="tile venus-tile">V</div>
               <div class="description">
                 (Raise Venus 3 steps).
            </div>
`],
["Gyropolis",`
            <div class="title background-color-automated ">Gyropolis</div>
            <div class="price ">20</div>
            <div class="tag tag1 tag-building "></div>
            <div class="tag tag2 tag-city "></div>
            <div class="venus-icon project-icon"></div>
            <div class="content ">
              <div class="production-box production-box-size3">
                  <div class="production-prefix">&#x2796;&#xFE0E;</div><div class="energy production"></div><div class="energy production"></div>
                  <div class="production-prefix">&#x2795;&#xFE0E;</div><div class="money production">1</div> / <div class="resource-tag tag-venus"></div>
                  <div class="production-prefix">&#x2795;&#xFE0E;</div><div class="money production">1</div> / <div class="resource-tag tag-earth"></div>
              </div>
              <div class="tile city-tile" style="margin-left:20px"></div>
               <div class="description">
                 (Decrease your energy production 2 steps. Increase your MC production 1 step for each Venus and Earth tag you have. Place a City tile).
            </div>
`],
["Hydrogen to Venus",`
            <div class="title background-color-events ">Hydrogen to Venus</div>
            <div class="price ">11</div>
            <div class="tag tag1 tag-event "></div>
            <div class="tag tag2 tag-space "></div>
            <div class="venus-icon project-icon"></div>
            <div class="content ">
              <div class="tile venus-tile">V</div><br><br>
              <div class="resource floater"><div class="card-icon card-icon-venus">V</div></div> / <div class="resource-tag tag-jovian"></div><br><br>
                <div class="description">
                  (Raise Venus 1 step. Add 1 Floater to A Venus CARD for each Jovian tag you have).
                </div>
            </div>
`],
["IO Sulphur Research",`
            <div class="title background-color-automated ">IO Sulphur Research</div>
            <div class="price ">17</div>
            <div class="tag tag1 tag-jovian "></div>
            <div class="tag tag2 tag-science "></div>
            <div class="venus-icon project-icon"></div>
            <div class="content ">
              <div class="points points-big">2</div>
              <div class="resource card"></div> OR <br>
              <div class="resource-tag tag-venus"></div>
              <div class="resource-tag tag-venus" style="margin-left:-15px;"></div>
              <div class="resource-tag tag-venus" style="margin-left:-15px;"></div> :
              <div class="resource card"></div><div class="resource card" style="margin-left:-15px;"></div><div class="resource card" style="margin-left:-15px;"></div>
               <div class="description">
                 (Draw 1 card, or draw 3 if you have at least 3 Venus tags).
            </div>
`],
["Ishtar Mining",`
            <div class="title background-color-automated ">Ishtar Mining</div>
            <div class="price ">5</div>
            <div class="tag tag1 tag-venus "></div>
            <div class="venus-icon project-icon"></div>
            <div class="content ">
              <div class="requirements">8% Venus</div>
                <div class="production-box ">
                    <div class="titanium production"></div>
                </div>
               <div class="description">
                 (Requires Venus 8%. Increase your titanium production 1 step).
            </div>
`],
["Jet Stream Microscrappers",`
            <div class="title background-color-active ">Jet Stream Microscrappers</div>
            <div class="price ">12</div>
            <div class="tag tag1 tag-venus "></div>
            <div class="venus-icon project-icon"></div>
            <div class="content ">
                <div class="titanium resource "></div> <div class="red-arrow "></div> <div class="floater resource "></div><div class="floater resource "></div><br>
              OR <div class="floater resource "></div><div class="floater resource "></div> <div class="red-arrow "></div> <div class="tile venus-tile ">V</div>
                <div class="description ">
                  (Action: Spend 1 titanium to add 2 Floaters here, OR spend 2 Floaters here to raise Venus 1 step).
                </div>
            </div>
`],
["Local Shading",`
            <div class="title background-color-active ">Local Shading</div>
            <div class="price ">4</div>
            <div class="tag tag1 tag-venus "></div>
            <div class="venus-icon project-icon"></div>
            <div class="content ">
                <div class="red-arrow "></div> <div class="floater resource "></div> <br>
              OR <div class="floater resource "></div> <div class="red-arrow "></div>
              <div class="production-box">
                  <div class="money production">1</div>
              </div>
                <div class="description ">
                  (Action: add 1 Floater to this card, or spend 1 Floater here to raise your MC production 1 step).
                </div>
            </div>
`],
["Luna Metropolis",`
            <div class="title background-color-automated ">Luna Metropolis</div>
            <div class="price ">21</div>
            <div class="tag tag1 tag-city "></div>
            <div class="tag tag2 tag-earth "></div>
            <div class="tag tag3 tag-space "></div>
            <div class="venus-icon project-icon"></div>
            <div class="content ">
              <div class="points points-big">2</div>
                <div class="production-box production-box-size2a">
                    <div class="money production">1</div> / <div class="resource-tag tag-earth"></div>
                </div>
                <div class="tile city-tile" style="margin-left:20px"></div>*
               <div class="description">
                 (Increase your MC production 1 step for each Earth tag you have, including this. Place a City tile on the RESERVED AREA).
            </div>
          </div>
`],
["Luxury Foods",`
            <div class="title background-color-automated ">Luxury Foods</div>
            <div class="price ">8</div>
            <div class="venus-icon project-icon"></div>
            <div class="content ">
              <div class="points points-big">2</div>
              <div class="requirements"> Venus Earth Jovian</div>
            </div>
`],
["Maxwell Base",`
            <div class="title background-color-active ">Maxwell Base</div>
            <div class="price ">18</div>
            <div class="tag tag1 tag-city "></div>
            <div class="tag tag2 tag-venus "></div>
            <div class="venus-icon project-icon"></div>
            <div class="content ">
              <div class="points points-big">3</div>
              <div class="requirements">12% Venus</div>
                <div class="red-arrow "></div> <div class="resource " style="background:white;">?<div class="card-icon card-icon-venus" style="color: white;margin-top: -36px;margin-left: 17px;font-weight:bold;">V</div></div>
                <div class="description " style="margin-top:-5px">
                  (Action: Add 1 resource to ANOTHER VENUS CARD).
                </div>
              <div class="production-box production-box-size1a">
                    <div class="production-prefix">&#x2796;&#xFE0E;</div><div class="energy production"></div>
              </div>
              <div class="tile city-tile" style="margin-left:20px"></div>*
                <div class="description " style="text-align:left;margin-top:-5px">
                  (Requires Venus 12%. Decrease your energy production 1 step. <br> Place a City tile ON THE <br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; RESERVED AREA.)
                </div>
            </div>
`],
["Mining Quota",`
            <div class="title background-color-automated ">Mining Quota</div>
            <div class="price ">5</div>
            <div class="tag tag1 tag-building"></div>
            <div class="venus-icon project-icon"></div>
            <div class="content ">
              <div class="requirements"> Venus Earth Jovian</div>
              <div class="production-box production-box-size2">
                  <div class="steel production"></div><div class="steel production"></div>
              </div>
              <div class="description">
              (Requires Venus, Earth and Jovian tags. Increase your steel production 2 steps).
              </div>
            </div>
`],
["Neutralizer Factory",`
            <div class="title background-color-automated ">Neutralizer Factory</div>
            <div class="price ">7</div>
            <div class="tag tag1 tag-venus"></div>
            <div class="venus-icon project-icon"></div>
            <div class="content ">
              <div class="requirements"> 10% Venus</div>
              <div class="tile venus-tile">V</div>
              <div class="description">
                (Requires Venus 10%. Increase the Venus track 1 step).
              </div>
            </div>
`],
["Omnicourt",`
            <div class="title background-color-automated ">Omnicourt</div>
            <div class="price ">11</div>
            <div class="tag tag1 tag-building"></div>
            <div class="venus-icon project-icon"></div>
            <div class="content ">
              <div class="requirements">Venus Earth Jovian</div>
              <div class="tile rating"></div>  <div class="tile rating"></div>
              <div class="description">
                (Requires Venus, Earth and Jovian tags. Increase your TR 2 steps.)
              </div>
            </div>
`],
["Orbital Reflectors",`
            <div class="title background-color-automated ">Orbital Reflectors</div>
            <div class="price ">26</div>
            <div class="tag tag1 tag-space"></div>
            <div class="tag tag2 tag-venus"></div>
            <div class="venus-icon project-icon"></div>
            <div class="content ">
              <div class="tile venus-tile">V</div>  <div class="tile venus-tile">V</div><br>
              <div class="production-box production-box-size2">
                  <div class="heat production"></div><div class="heat production"></div>
              </div>
              <div class="description">
                (Raise Venus 2 steps. Increase your heat production 2 steps).
              </div>
            </div>
`],
["Rotator Impacts",`
            <div class="title background-color-active ">Rotator Impacts</div>
            <div class="price ">6</div>
            <div class="tag tag1 tag-space "></div>
            <div class="venus-icon project-icon"></div>
            <div class="content ">
                <div class="requirements requirements-max">max 14% Venus</div>
                <div class=" money resource ">6</div> (<span class="titanium " style="margin:0px;padding:1px;padding-top:3px;border-radius:5px; "></span>)
                <span class="red-arrow "></span> <div class="resource" style="background:black;color:#bbb;">A</div> <br>
                OR <div class="resource" style="background:black;color:#bbb;">A</div> <span class="red-arrow "></span> <div class="tile venus-tile">V</div>
                <div class="description ">
                  (Action: spend 6 MC to add an asteroid resource to this card (TITANIUM MAY BE USED), or spend 1 resource from this card to increase Venus 1 step).
                  <br><br>(Venus must be 14% or lower).
                </div>
            </div>
`],
["Sister Planet Support",`
            <div class="title background-color-automated ">Sister Planet Support</div>
            <div class="price ">7</div>
            <div class="tag tag1 tag-earth"></div>
            <div class="tag tag2 tag-venus"></div>
            <div class="venus-icon project-icon"></div>
            <div class="content ">
              <div class="requirements">Venus Earth</div>
              <div class="production-box">
                  <div class="money production">3</div>
              </div>
              <div class="description">
                (Requires Venus and Earth tags. Increase your MC production 3 steps).
              </div>
            </div>
`],
["Solarnet",`
            <div class="title background-color-automated ">Solarnet</div>
            <div class="price ">7</div>
            <div class="venus-icon project-icon"></div>
            <div class="content ">
              <div class="points points-big">1</div>
              <div class="requirements"> Venus Earth Jovian</div>
              <div class="resource card"></div> <div class="resource card"></div>
              <div class="description">
                (Requires Venus, Earth and Jovian tags. Draw 2 cards).
              </div>
            </div>
`],
["Spin-Inducing Asteroid",`
            <div class="title background-color-events ">Spin-Inducing Asteroid</div>
            <div class="price ">16</div>
            <div class="tag tag1 tag-event "></div>
            <div class="tag tag2 tag-space "></div>
            <div class="venus-icon project-icon"></div>
            <div class="content ">
              <div class="requirements requirements-max">max 10% Venus</div>
              <div class="tile venus-tile">V</div> <div class="tile venus-tile">V</div>
                <div class="description">
                  (Venus must be 10% or lower. Raise Venus 2 steps).
                </div>
            </div>
`],
["Sponsored Academies",`
            <div class="title background-color-automated ">Sponsored Academies</div>
            <div class="price ">9</div>
            <div class="tag tag1 tag-earth"></div>
            <div class="tag tag2 tag-science"></div>
            <div class="venus-icon project-icon"></div>
            <div class="content ">
              <div class="points points-big">1</div>
              - <div class="resource card"></div><br>
              + <div class="resource card"></div><div class="resource card"></div><div class="resource card"></div>* + <div class="resource card red-outline"></div>*
              <div class="description">
                (Discard 1 card from your hand and THEN draw 3 cards. All OPPONENTS draw 1 card).
              </div>
            </div>
`],
["Stratopolis",`
            <div class="title background-color-active ">Stratopolis</div>
            <div class="price ">22</div>
            <div class="tag tag1 tag-city "></div>
            <div class="tag tag2 tag-venus "></div>
            <div class="venus-icon project-icon"></div>
            <div class="content ">
              <div class="points">1/3<div class="resource floater"></div></div>
              <div class="requirements" style="margin-bottom:15px;">2 Science</div>
                <div class="red-arrow "></div>
                <div class="resource floater"><div class="card-icon card-icon-venus">V</div></div>
                <div class="resource floater"><div class="card-icon card-icon-venus">V</div></div>
                <div class="description " style="margin-top:-5px">
                  (Action: Add 2 floaters to ANY VENUS CARD.)
                </div>
              <div class="production-box" style="margin-left:85px">
                <div class="money production">2</div>
              </div>
              &nbsp;<div class="tile city-tile"></div>*
                <div class="description " style="text-align:left;margin-top:-54px">
                  (Requires 2 <br> science tags.<br> Increase your <br> MC production <br>2 steps. Place a City tile ON <br>THE RESERVED AREA.<br>
                  1 VP for every 3rd Floater <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; on this card.)
                </div>
            </div>
`],
["Stratospheric Birds",`
            <div class="title background-color-active ">Stratospheric Birds</div>
            <div class="price ">12</div>
            <div class="tag tag1 tag-animal "></div>
            <div class="tag tag2 tag-venus "></div>
            <div class="venus-icon project-icon"></div>
            <div class="content ">
              <div class="points">1/<div class="resource animal"></div></div>
              <div class="requirements">12% Venus</div>
                <div class="red-arrow "></div>
                <div class="resource animal"></div>
                <div class="description " style="margin-top:-5px">
                  (Action: Add 1 animal to this card.)
                </div>
                - <div class="resource floater"></div>
                <div class="description " >
                  (Requires Venus 12% and that you spend 1 Floater from any card. 1 VP for each Animal on this card.)
                </div>
            </div>
`],
["Sulphur Exports",`
            <div class="title background-color-automated ">Sulphur Exports</div>
            <div class="price ">21</div>
            <div class="tag tag1 tag-space "></div>
            <div class="tag tag2 tag-venus "></div>
            <div class="venus-icon project-icon"></div>
            <div class="content ">
              <div class="tile venus-tile">V</div><br>
                <div class="production-box production-box-size2a">
                    <div class="money production">1</div> / <div class="resource-tag tag-venus"></div>
                </div>
               <div class="description">
                 (Increase Venus 1 step. Increase your MC production1 step for each Venus tag you have, including this.)
            </div>
          </div>
`],
["Sulphur-eating Bacteria",`
            <div class="title background-color-active ">Sulphur-eating Bacteria</div>
            <div class="price ">6</div>
            <div class="tag tag1 tag-microbe "></div>
            <div class="tag tag2 tag-venus "></div>
            <div class="venus-icon project-icon"></div>
            <div class="content ">
              <div class="requirements">6% Venus</div>
                <div class="red-arrow " style="margin-left:76px;"></div> <div class="microbe resource "></div><br>
              OR X<div class="microbe resource "></div> <div class="red-arrow "></div> <div class="resource money ">3X</div>
                <div class="description ">
                  (Action: add 1 Microbe to this card, or spend any number of Microbes here to gain triple amount of MC).
                  <br><br>
                  (Requires Venus 6%).
                </div>
            </div>
`],
["Terraforming Contract",`
            <div class="title background-color-automated ">Terraforming Contract</div>
            <div class="price ">8</div>
            <div class="tag tag1 tag-earth"></div>
            <div class="venus-icon project-icon"></div>
            <div class="content ">
              <div class="requirements">25 TR</div>
              <div class="production-box">
                  <div class="money production">4</div>
              </div>
              <div class="description">
                (Requires that you have at least 25 TR. Increase your MC production 4 steps.)
              </div>
            </div>
`],
["Thermophiles",`
            <div class="title background-color-active ">Thermophiles</div>
            <div class="price ">9</div>
            <div class="tag tag1 tag-microbe "></div>
            <div class="tag tag2 tag-venus "></div>
            <div class="venus-icon project-icon"></div>
            <div class="content ">
              <div class="requirements">6% Venus</div>
                <div class="red-arrow " style="margin-left:76px;"></div> <div class="resource microbe"><div class="card-icon card-icon-venus" style="color: white;margin-top: -36px;font-weight:bold;">V</div></div>
                <br>
              OR <div class="microbe resource "></div><div class="microbe resource "></div> <div class="red-arrow "></div> <div class="tile venus-tile">V</div>
                <div class="description ">
                  (Action: add 1 Microbe to ANY Venus CARD or spend 2 Microbes here to raise Venus 1 step).
                  <br><br>
                  (Requires Venus 6%).
                </div>
            </div>
`],
["Water to Venus",`
            <div class="title background-color-events ">Water to Venus</div>
            <div class="price ">9</div>
            <div class="tag tag1 tag-event "></div>
            <div class="tag tag2 tag-space "></div>
            <div class="venus-icon project-icon"></div>
            <div class="content ">
              <div class="tile venus-tile">V</div>
                <div class="description">
                  (Raise Venus 1 step.)
                </div>
            </div>
`],
["Venus Governor",`
            <div class="title background-color-automated ">Venus Governor</div>
            <div class="price ">4</div>
            <div class="tag tag1 tag-venus"></div>
            <div class="tag tag2 tag-venus"></div>
            <div class="venus-icon project-icon"></div>
            <div class="content ">
              <div class="requirements">Venus Venus</div>
              <div class="production-box">
                  <div class="money production">2</div>
              </div>
              <div class="description">
                (Requires 2 Venus tags. Increase your MC production 2 steps.)
              </div>
            </div>
`],
["Venus Magnetizer",`
            <div class="title background-color-active ">Venus Magnetizer</div>
            <div class="price ">7</div>
            <div class="tag tag1 tag-venus "></div>
            <div class="venus-icon project-icon"></div>
            <div class="content ">
              <div class="requirements">10% Venus</div>
                <div class="production-box production-box-size1a ">
                    <div class="production-prefix ">&#x2796;&#xFE0E;</div><div class="energy production "></div>
                </div>
                <span class="red-arrow " style="margin-left:5px; "></span>
                <div class="tile venus-tile ">V</div>
                <div class="description ">
                    (Action: Decrease your Energy production 1 step to raise Venus 1 step.)
                    <br><br>
                    (Requires Venus 10%.)
                </div>
            </div>
`],
["Venus Soils",`
            <div class="title background-color-automated ">Venus Soils</div>
            <div class="price ">20</div>
            <div class="tag tag1 tag-plant"></div>
            <div class="tag tag2 tag-venus"></div>
            <div class="venus-icon project-icon"></div>
            <div class="content ">
              <div class="tile venus-tile">V</div> <br>
              <div class="production-box">
                  <div class="plant production"></div>
              </div>
              <div class="resource microbe" style="margin-left:20px;"></div><div class="resource microbe"></div>*
              <div class="description">
                (Raise Venus 1 step. Increase your Plant production 1 step. Add 2 Microbes to ANOTHER card).
              </div>
            </div>
`],
["Venus Waystation",`
            <div class="title background-color-active ">Venus Waystation</div>
            <div class="price ">9</div>
            <div class="tag tag1 tag-space "></div>
            <div class="tag tag2 tag-venus "></div>
            <div class="venus-icon project-icon"></div>
            <div class="content ">
                <div class="points points-big ">1</div>
                <div class="resource-tag tag-venus"></div> : <div class="money resource ">-2</div>
                <div class="description ">
                    (Effect: When you play a Venus tag, you pay 2 MC less for it.)
                </div>
            </div>
`],
["Venusian Animals",`
            <div class="title background-color-active ">Venusian Animals</div>
            <div class="price ">15</div>
            <div class="tag tag1 tag-animal "></div>
            <div class="tag tag2 tag-science "></div>
            <div class="tag tag3 tag-venus "></div>
            <div class="venus-icon project-icon"></div>
            <div class="content ">
                <div class="points">1/<div class="animal resource "></div></div>
                <div class="requirements">18% Venus</div>
                <div class="resource-tag science"></div> : <div class="animal resource "></div>
                <div class="description ">
                  (Effect: when you play a Science tag, including this, add 1 Animal to this card).
                </div>
            </div>
`],
["Venusian Insects",`
            <div class="title background-color-active ">Venusian Insects</div>
            <div class="price ">5</div>
            <div class="tag tag1 tag-microbe "></div>
            <div class="tag tag2 tag-venus "></div>
            <div class="venus-icon project-icon"></div>
            <div class="content ">
              <div class="points">1/2<div class="resource microbe"></div></div>
              <div class="requirements">12% Venus</div>
                <div class="red-arrow "></div> <div class="resource microbe"></div>
                <div class="description ">
                  (Action: add 1 Microbe to this card.)
                </div><br>
                <div class="description ">
                  (Requires Venus 12%. 1 VP for every 2nd Microbe on this card.)
                </div>
            </div>
`],
["Venusian Plants",`
            <div class="title background-color-automated ">Venusian Plants</div>
            <div class="price ">13</div>
            <div class="tag tag1 tag-plant"></div>
            <div class="tag tag2 tag-venus"></div>
            <div class="venus-icon project-icon"></div>
            <div class="content ">
              <div class="points points-big">1</div>
              <div class="requirements">16% Venus</div>
              <div class="tile venus-tile">V</div>
              <br><div class="microbe resource"><div class="card-icon card-icon-venus" style="color: white;margin-top: -36px;font-weight:bold;">V</div></div> OR
              <div class="animal resource"><div class="card-icon card-icon-venus" style="color: white;margin-top: -36px;font-weight:bold;">V</div></div>
              <div class="description">
                (Requires Venus 16%. Raise Venus 1 step. Add 1 Microbe or 1 Animal to ANOTHER VENUS CARD).
              </div>
            </div>
`],
["House Printing",`
              <div class="title background-color-automated ">House Printing</div>
              <div class="price ">10</div>
              <div class="tag tag1 tag-building"></div>
              <div class="prelude-icon project-icon"></div>
              <div class="content ">
                <div class="points points-big">1</div>
                <div class="production-box">
                  <div class="production steel"></div>
                </div><br>
                <div class="description">
                  (Increase your steel production 1 step.)
                </div>
              </div>
`],
["Lava Tube Settlement",`
              <div class="title background-color-automated ">Lava Tube Settlement</div>
              <div class="price ">15</div>
              <div class="tag tag1 tag-building"></div>
              <div class="tag tag2 tag-city"></div>
              <div class="prelude-icon project-icon"></div>
              <div class="content ">
                <div class="production-box production-box-size1a">
                  <div class="production-prefix ">&#x2796;&#xFE0E;</div><div class="energy production "></div><br>
                  <div class="production-prefix ">&#x2795;&#xFE0E;</div><div class="money production ">2</div>
                </div><br>
                <div class="tile city-tile"></div>*
                <div class="description">
                  (Decrease your energy production 1 step and increase your MC production 2 steps. Place a City Tile on a VOLCANIC AREA regardless of adjacent cities.)
                </div>
              </div>
`],
["Martian Survey",`
              <div class="title background-color-events ">Martian Survey</div>
              <div class="price ">9</div>
              <div class="tag tag1 tag-event"></div>
              <div class="tag tag2 tag-science"></div>
              <div class="prelude-icon project-icon"></div>
              <div class="content ">
                <div class="points points-big">1</div>
                <div class="requirements requirements-max ">max 4% O2</div>
                <div class="resource card"></div> <div class="resource card"></div>
                <div class="description">
                  (Oxygen must be 4% or lower. Draw two cards.)
                </div>
              </div>
`],
["Psychrophiles",`
              <div class="title background-color-active ">PSYCHROPHILES</div>
              <div class="price ">2</div>
              ##RESOURCES##
              <div class="tag tag1 tag-microbe"></div>
              <div class="prelude-icon project-icon"></div>
              <div class="content ">
                <div class="requirements requirements-max ">max -20 C</div>
                <div class="red-arrow "></div> <div class="microbe resource "></div><br>
                <div class="resource-tag tag-plant"></div>  : <div class="microbe resource "></div> = <div class="money resource ">2</div>
                  <div class="description">
                  (Action: Add 1 microbe to this card.)
                  (Effect: When paying for a plant card, microbes here may be used as 2 MC each.)
                  <br><br>
                  (Temperature must be -20 C or lower.)
                </div>
              </div>
`],
["Research Coordination",`
              <div class="title background-color-automated ">RESEARCH COORDINATION</div>
              <div class="price ">4</div>
              <div class="tag tag1 tag-wild"></div>
              <div class="prelude-icon project-icon"></div>
              <div class="content ">
                After being played, when you perform an action, the wild tag counts as any tag of your choice.
              </div>
`],
["SF Memorial",`
              <div class="title background-color-automated ">SF MEMORIAL</div>
              <div class="price ">7</div>
              <div class="tag tag1 tag-building"></div>
              <div class="prelude-icon project-icon"></div>
              <div class="content ">
                <div class="points points-big">1</div>
                <div class="resource card"></div>
                <div class="description">
                  (Draw 1 card.)
                </div>
              </div>
`],
["Space Hotels",`
              <div class="title background-color-automated ">Space hotels</div>
              <div class="price ">12</div>
              <div class="tag tag1 tag-space"></div>
              <div class="tag tag2 tag-earth"></div>
              <div class="prelude-icon project-icon"></div>
              <div class="content ">
                <div class="requirements">Earth Earth</div>
                <div class="production-box">
                  <div class="production money">4</div>
                </div><br>
                <div class="description">
                  (Requires 2 Earth tags. Increase MC production 4 steps.)
                </div>
              </div>
`],
["Airliners",`
            <div class="title background-color-automated ">Airliners</div>
            <div class="price ">11</div>
            <div class="colonies-icon project-icon"></div>
            <div class="content ">
              <div class="points points-big ">1</div>
              <div class="requirements ">3 Floaters</div>
              <div class="production-box">
                <div class="money production">2</div>
              </div><br>
              <div class="floater resource "></div><div class="floater resource "></div>*
              <div class="description">
                (Requires that you have 3 floaters. Increase your MC production 2 steps. Add 2 floaters to ANY card.)
              </div>
            </div>
`],
["Air Raid",`
            <div class="title background-color-events">Air Raid</div>
            <div class="price">0</div>
            <div class="tag tag1 tag-event"></div>
            <div class="colonies-icon project-icon"></div>
            <div class="content">
              - <div class="resource floater" style="margin-right:20px;"></div>
              STEAL <div class="resource money red-outline">5</div>
              <div class="description">
                (Requires that you lose 1 floater. Steal 5 MC from any player.)
              </div>
            </div>
`],
["Atmo Collectors",`
            <div class="title background-color-active ">Atmo Collectors</div>
            <div class="price ">15</div>
            <div class="colonies-icon project-icon"></div>
            <div class="content ">
              <div class="red-arrow "></div> <div class="floater resource "></div> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; OR <br>
              <div class="floater resource "></div> <div class="red-arrow "></div> 2<div class="titanium resource "></div> / 3<div class="energy resource "></div> / 4<div class="heat resource "></div>
              <div class="description ">
                (Action: Add 1 floater here, or spend 1 floater here to gain 2 titanium, or 3 energy, or 4 heat.)
              </div>
              <div class="resource floater"></div><div class="resource floater"></div>*
              <br>
              <div class="description ">
                (Add 2 floaters to ANY card.)
              </div>
            </div>
`],
["Community Services",`
            <div class="title background-color-automated ">Community Services</div>
            <div class="price">13</div>
            <div class="colonies-icon project-icon"></div>
            <div class="content ">
              <div class="points points-big ">1</div>
              <div class="production-box">
                <div class="money production">1</div>
              </div>  / <div class="resource-tag" style="font-size: 42px; vertical-align: middle;background:white">X</div> *
              <div class="description">
                (Increase your MC production 1 step per CARD WITH NO TAGS, including this.)
              </div>
            </div>
`],
["Conscription",`
              <div class="title background-color-events ">Conscription</div>
              <div class="price ">5</div>
              <div class="tag tag1 tag-event "></div>
              <div class="tag tag2 tag-earth "></div>
              <div class="colonies-icon project-icon"></div>
              <div class="content ">
                <div class="points points-big">-1</div>
                <div class="requirements">Earth Earth</div>
                <span style="font-size:14px;">NEXT CARD: </span> <div class="resource money">-16</div>
                  <div class="description ">
                    (Requires 2 Earth tags. The next card you play this generation costs 16 MC less.)
                  </div>
              </div>
`],
["Corona Extractor",`
              <div class="title background-color-automated ">Corona Extractor</div>
              <div class="price ">10</div>
              <div class="tag tag1 tag-space"></div>
              <div class="tag tag2 tag-power"></div>
              <div class="colonies-icon project-icon"></div>
              <div class="content ">
                <div class="requirements">4 Science</div>
                  <div class="production-box production-box-size1a">
                      4 <div class="energy production"></div>
                  </div>
                  <div class="description ">
                      (Requires 4 science tags. Increase your energy production 4 steps.)
                  </div>
              </div>
`],
["Cryo Sleep",`
              <div class="title background-color-active ">Cryo Sleep</div>
              <div class="price ">10</div>
              <div class="tag tag1 tag-science"></div>
              <div class="colonies-icon project-icon"></div>
              <div class="content ">
                <div class="points points-big ">1</div>
                  <div class="triangle triangle-white"></div> : <div class="resource " style="background:white">-1</div>
                  <div class="description ">
                      (Effect: When you trade, you pay 1 less resource for it.)
                  </div>
              </div>
`],
["Earth Elevator",`
            <div class="title background-color-automated">Earth Elevator</div>
            <div class="price">43</div>
            <div class="tag tag1 tag-space"></div>
            <div class="tag tag2 tag-earth"></div>
            <div class="colonies-icon project-icon"></div>
            <div class="content">
              <div class="points points-big">4</div>
              <div class="production-box production-box-size3">
                <div class="production titanium"></div><div class="production titanium"></div><div class="production titanium"></div>
              </div>
              <div class="description">
                (Increase your titanium production 3 steps.)
              </div>
            </div>
`],
["Ecology Research",`
            <div class="title background-color-automated ">Ecology Research</div>
            <div class="price">21</div>
            <div class="tag tag1 tag-plant"></div>
            <div class="tag tag2 tag-microbe"></div>
            <div class="tag tag3 tag-animal"></div>
            <div class="tag tag-science" style="margin-left:56px;"></div>
            <div class="colonies-icon project-icon"></div>
            <div class="content ">
              <div class="points points-big ">1</div>
              <div class="production-box production-box-size2a">
                <div class="plant production"></div> / <div class="triangle triangle-black"></div>
              </div><br>
              <div class="resource animal"></div>* <div class="resource microbe" style="margin-left:20px;"></div><div class="resource microbe"></div>*
              <div class="description">
                (Increase your plant production 1 step for each colony you own. Add 1 animal to ANOTHER card and 2 microbes to ANOTHER card.)
              </div>
            </div>
`],
["Floater Leasing",`
            <div class="title background-color-automated ">Floater Leasing</div>
            <div class="price ">3</div>
            <div class="colonies-icon project-icon"></div>
            <div class="content ">
              <div class="production-box">
                <div class="money production">1</div>
              </div> &nbsp;/ 3<div class="resource floater"></div>
              <div class="description">
                (Increase your MC production 1 step per 3 floaters you have.)
              </div>
            </div>
`],
["Floater Prototypes",`
              <div class="title background-color-events ">Floater Prototypes</div>
              <div class="price ">2</div>
              <div class="tag tag1 tag-event "></div>
              <div class="tag tag2 tag-science "></div>
              <div class="colonies-icon project-icon"></div>
              <div class="content ">
                <div class="resource floater"></div><div class="resource floater"></div>*
                  <div class="description ">
                    (Add two floaters to ANOTHER card.)
                  </div>
              </div>
`],
["Floater Technology",`
              <div class="title background-color-active ">Floater Technology</div>
              <div class="price ">7</div>
              <div class="tag tag1 tag-science"></div>
              <div class="colonies-icon project-icon"></div>
              <div class="content ">
                  <div class="red-arrow "></div> <div class="floater resource "></div>*
                  <div class="description ">
                    (Action: Add 1 floater to ANOTHER card.)
                  </div>
              </div>
`],
["Galilean Waystation",`
            <div class="title background-color-automated ">Galilean Waystation</div>
            <div class="price ">15</div>
            <div class="tag tag1 tag-space "></div>
            <div class="colonies-icon project-icon"></div>
            <div class="content ">
              <div class="points points-big ">1</div>
              <div class="production-box production-box-size2a">
                <div class="money production">1</div> / <div class="resource-tag tag-jovian red-outline"></div>
              </div>
              <div class="description">
                (Increase your MC production 1 step for every Jovian tag in play.)
              </div>
            </div>
`],
["Heavy Taxation",`
              <div class="title background-color-automated ">Heavy Taxation</div>
              <div class="price ">3</div>
              <div class="tag tag1 tag-earth "></div>
              <div class="colonies-icon project-icon"></div>
              <div class="content ">
                <div class="points points-big">-1</div>
                <div class="requirements">Earth Earth</div>
                <div class="production-box"><div class="production money">2</div></div> <div style="margin-left:20px;" class="resource money">4</div>
                  <div class="description ">
                    (Requires 2 Earth tags. Increase your MC production 2 steps, and gain 4MC.)
                  </div>
              </div>
`],
["Ice Moon Colony",`
            <div class="title background-color-automated ">Ice Moon Colony</div>
            <div class="price ">23</div>
            <div class="tag tag1 tag-space"></div>
            <div class="colonies-icon project-icon"></div>
            <div class="content ">
              <div class="triangle triangle-black"></div> <div class="tile ocean-tile" style="margin-left:20px;"></div>
              <div class="description">
                (Place 1 colony and 1 ocean tile.)
              </div>
            </div>
`],
["Impactor Swarm",`
              <div class="title background-color-events ">Impactor Swarm</div>
              <div class="price ">11</div>
              <div class="tag tag1 tag-event "></div>
              <div class="tag tag2 tag-space "></div>
              <div class="colonies-icon project-icon"></div>
              <div class="content ">
                <div class="requirements">Jovian Jovian</div>
                12<div class="resource heat"></div><br>
                - <div class="resource plant red-outline"></div><div class="resource plant red-outline"></div>
                  <div class="description ">
                    (Requires 2 Jovian tags. Gain 12 heat. Remove up to 2 plants from any player.)
                  </div>
              </div>
`],
["Interplanetary Colony Ship",`
              <div class="title background-color-events ">Interplanetary Colony Ship</div>
              <div class="price ">12</div>
              <div class="tag tag1 tag-event "></div>
              <div class="tag tag2 tag-space "></div>
              <div class="tag tag3 tag-earth "></div>
              <div class="colonies-icon project-icon"></div>
              <div class="content ">
                <br>
                <div class="triangle triangle-black"></div><br><br>
                  <div class="description ">
                    (Place a colony.)
                  </div>
              </div>
`],
["Jovian Lanterns",`
            <div class="title background-color-active ">Jovian Lanterns</div>
            <div class="price ">20</div>
            <div class="tag tag1 tag-jovian "></div>
            <div class="colonies-icon project-icon"></div>
            <div class="content ">
                <div class="points">1/2<div class="resource floater"></div></div>
                <div class="requirements">Jovian</div>
                <div class="resource titanium"></div> <div class="red-arrow "></div> <div class="resource floater"></div><div class="resource floater"></div>
                <div class="description ">
                  (Action: Spend 1 titanium to add 2 floaters here.)
                </div>
                <div class="tile rating"></div> <div class="resource floater"></div><div class="resource floater"></div>*
                <div class="description " style="margin-top:-5px;text-align:left;">
                  (Requires 1 Jovian tag. Increase your TR 1 step. Add 2 floaters to ANY <br> card. 1VP per 2 floaters.)
                </div>
              </div>
`],
["Jupiter Floating Station",`
            <div class="title background-color-active ">Jupiter Floating Station</div>
            <div class="price ">9</div>
            <div class="tag tag1 tag-jovian "></div>
            <div class="colonies-icon project-icon"></div>
            <div class="content ">
                <div class="points points-big">1</div>
                <div class="requirements">3 Science</div>
                <div class="red-arrow "></div> <div class="resource floater" style="margin-right:10px;"><div class="card-icon tag-jovian"></div></div> OR<br>
                <div class="red-arrow "></div> <div class="resource money">1</div> / <div class="resource floater"></div> * (max 4)
                <div class="description ">
                  (Action: Add 1 floater to a JOVIAN CARD, or gain 1 MC for every floater here (MAX 4).)
                </div><br>
                <div class="description " style="margin-left:-90px;">
                  (Requires 3 Science tags.)
                </div>
              </div>
`],
["Luna Governor",`
              <div class="title background-color-automated ">Luna Governor</div>
              <div class="price ">4</div>
              <div class="tag tag1 tag-earth "></div>
              <div class="tag tag2 tag-earth "></div>
              <div class="colonies-icon project-icon"></div>
              <div class="content ">
                <div class="requirements">Earth Earth Earth</div>
                <div class="production-box"><div class="production money">2</div></div>
                  <div class="description ">
                    (Requires 3 Earth tags. Increase your MC production 2 steps.)
                  </div>
              </div>
`],
["Lunar Exports",`
            <div class="title background-color-automated ">Lunar Exports</div>
            <div class="price ">19</div>
            <div class="tag tag1 tag-earth"></div>
            <div class="tag tag2 tag-space"></div>
            <div class="colonies-icon project-icon"></div>
            <div class="content ">
              <div class="production-box production-box-size4">
                <div class="plant production"></div><div class="plant production"></div> OR <div class="money production">5</div>
              </div>
              <div class="description">
                (Increase your plant production 2 steps, or your MC production 5 steps.)
              </div>
            </div>
`],
["Lunar Mining",`
            <div class="title background-color-automated ">Lunar Mining</div>
            <div class="price ">11</div>
            <div class="tag tag1 tag-earth"></div>
            <div class="colonies-icon project-icon"></div>
            <div class="content ">
              <div class="production-box production-box-size3">
                <div class="titanium production"></div> / 2 <div class="resource-tag tag-earth"></div>
                </div>
              <div class="description">
                (Increase your titanium production 1 step for every 2 Earth tags you have in play, including this.)
              </div>
            </div>
`],
["Market Manipulation",`
              <div class="title background-color-events ">Market Manipulation</div>
              <div class="price ">1</div>
              <div class="tag tag1 tag-event "></div>
              <div class="tag tag2 tag-earth "></div>
              <div class="colonies-icon project-icon"></div>
              <div class="content ">
                INCREASE ONE COLONY TILE TRACK 1 STEP. <BR>
                DECREASE ANOTHER COLONY TILE TRACK 1 STEP.
`],
["Martian Zoo",`
              <div class="title background-color-active ">Martian Zoo</div>
              <div class="price ">12</div>
              <div class="tag tag1 tag-building"></div>
              <div class="tag tag2 tag-animal"></div>
              <div class="colonies-icon project-icon"></div>
              <div class="content ">
                <div class="points points-big">1</div>
                <div class="requirements">2 Cities</div>
                <div class="resource-tag tag-earth"></div> : <div class="resource animal"></div> <br>
                <div class="red-arrow"></div> <div class="resource money">1</div> / <div class="resource animal"></div>
                <div class="description">
                  (Effect: When you play an Earth tag, place an animal here.) <br><br>
                  (Action: Gain 1MC per animal here.)<br><br>
                  <div style="margin-left:-75px;">(Requires 2 city <br>tiles in play.)</div>
                </div>
              </div>
`],
["Mining Colony",`
            <div class="title background-color-automated ">Mining Colony</div>
            <div class="price ">20</div>
            <div class="tag tag1 tag-space"></div>
            <div class="colonies-icon project-icon"></div>
            <div class="content ">
              <div class="production-box">
                <div class="production titanium"></div>
              </div>
              <div class="triangle triangle-black" style="margin-left:20px;"></div>
              <div class="description" >
                (Increase your titanium production 1 step. Place a colony.)
              </div>
            </div>
`],
["Minority Refuge",`
            <div class="title background-color-automated ">Minority Refuge</div>
            <div class="price ">5</div>
            <div class="tag tag1 tag-space"></div>
            <div class="colonies-icon project-icon"></div>
            <div class="content ">
              <div class="production-box">
                <div class="production money">-2</div>
              </div>
              <div class="triangle triangle-black" style="margin-left:20px;"></div>
              <div class="description" >
                (Decrease your MC production 2 steps. Place a colony.)
              </div>
            </div>
`],
["Molecular Printing",`
              <div class="title background-color-automated ">Molecular Printing</div>
              <div class="price ">11</div>
              <div class="tag tag1 tag-science"></div>
              <div class="colonies-icon project-icon"></div>
              <div class="content ">
                <div class="points points-big ">1</div>
                  <div class="resource money">1</div> / <div class="tile city-tile-small red-outline"></div> <br>
                  <div class="resource money" style="margin-left:-14px;">1</div> / <div class="triangle triangle-red"></div>
                  <div class="description ">
                      (Gain 1Mc for each city tile in play.<br> Gain 1MC for each colony in play.)
                  </div>
              </div>
`],
["Nitrogen From Titan",`
              <div class="title background-color-automated ">Nitrogen From Titan</div>
              <div class="price ">25</div>
              <div class="tag tag1 tag-space"></div>
              <div class="tag tag2 tag-jovian"></div>
              <div class="colonies-icon project-icon"></div>
              <div class="content ">
                <div class="points points-big ">1</div>
                  <div class="tile rating"></div><div class="tile rating"></div>
                  <div class="resource floater"><div class="card-icon tag-jovian"></div></div>
                  <div class="resource floater"><div class="card-icon tag-jovian"></div></div>
                  <div class="description ">
                      (Raise your TR 2 steps. Add 2 floaters to a JOVIAN CARD.)
                  </div>
              </div>
`],
["Pioneer Settlement",`
            <div class="title background-color-automated ">Pioneer Settlement</div>
            <div class="price ">13</div>
            <div class="tag tag1 tag-space"></div>
            <div class="colonies-icon project-icon"></div>
            <div class="content ">
              <div class="points points-big ">2</div>
              <div class="requirements requirements-max">max 1 Colony</div>
              <div class="production-box">
                <div class="production money">-2</div>
              </div>
              <div class="triangle triangle-black" style="margin-left:20px;"></div>
              <div class="description" >
                (Requires that you have no more than 1 colony. Decrease your MC production 2 steps. Place a colony.)
              </div>
            </div>
`],
["Productive Outpost",`
            <div class="title background-color-automated ">Productive Outpost</div>
            <div class="price ">0</div>
            <div class="colonies-icon project-icon"></div>
            <div class="content ">
              GAIN ALL YOUR COLONY BONUSES
            </div>
`],
["Quantum Communications",`
            <div class="title background-color-automated ">Quantum Communications</div>
            <div class="price">8</div>
            <div class="colonies-icon project-icon"></div>
            <div class="content ">
              <div class="points points-big ">1</div>
              <div class="requirements">4 Science</div>
              <div class="production-box production-box-size2a">
                <div class="money production">1</div> / <div class="triangle triangle-red"></div>
              </div><br>
              <div class="description">
                (Requires 4 Science tags. Increase your MC production 1 step for each colony in play.)
              </div>
            </div>
`],
["Red Spot Observatory",`
            <div class="title background-color-active ">Red Spot Observatory</div>
            <div class="price ">17</div>
            <div class="tag tag1 tag-jovian "></div>
            <div class="tag tag2 tag-science "></div>
            <div class="colonies-icon project-icon"></div>
            <div class="content ">
                <div class="points points-big">2</div>
                <div class="requirements">3 Science</div>
                <div class="red-arrow "></div> <div class="resource floater"></div> OR
                <div class="resource floater"></div> <div class="red-arrow "></div>  <div class="resource card"></div>
                <div class="description ">
                  (Action: Add 1 floater to this card, or spend 1 floater here to draw a card.)
                </div>
                <div class="resource card"></div><div class="resource card"></div>
                <div class="description " style="margin-top:-5px;text-align:left;">
                  (Requires 3 Science tags.<br>&nbsp; Draw 2 cards.)
                </div>
              </div>
`],
["Refugee Camps",`
              <div class="title background-color-active ">Refugee Camps</div>
              <div class="price ">10</div>
              <div class="tag tag1 tag-earth"></div>
              <div class="colonies-icon project-icon"></div>
              <div class="content ">
                  <div class="points points-big">1/<div class="resource camp" style="vertical-align:middle;"></div></div>
                  <div class="production-box production-box-size1a ">
                      <div class="production-prefix ">&#x2796;&#xFE0E;</div><div class="money production ">1</div>
                  </div>
                  <span class="red-arrow " style="margin-left:5px; "></span>
                  <div class="resource camp"></div>
                  <div class="description ">
                      (Action: Decrease your MC production 1 step to add a camp resource to this card.)<br><br>
                      (1 VP for each camp resource on this card.)
                  </div>
              </div>
`],
["Research Colony",`
            <div class="title background-color-automated ">Research Colony</div>
            <div class="price ">20</div>
            <div class="tag tag1 tag-space"></div>
            <div class="tag tag2 tag-science"></div>
            <div class="colonies-icon project-icon"></div>
            <div class="content ">
              <div class="triangle triangle-black"></div>* <div class="resource card" style="margin-left:20px;"></div><div class="resource card"></div>
              <div class="description" >
                (Place a colony. MAY BE PLACED WHERE YOU ALREADY HAVE A COLONY. Draw 2 cards.)
              </div>
            </div>
`],
["Rim Freighters",`
              <div class="title background-color-active ">Rim Freighters</div>
              <div class="price ">4</div>
              <div class="tag tag1 tag-space"></div>
              <div class="colonies-icon project-icon"></div>
              <div class="content ">
                  <div class="triangle triangle-white"></div> : <div class="resource " style="background:white">-1</div>
                  <div class="description ">
                      (Effect: When you trade, you pay 1 less resource for it.)
                  </div>
              </div>
`],
["Sky Docks",`
              <div class="title background-color-active ">Sky Docks</div>
              <div class="price ">18</div>
              <div class="tag tag1 tag-space"></div>
              <div class="tag tag2 tag-earth"></div>
              <div class="colonies-icon project-icon"></div>
              <div class="content ">
                <div class="points points-big">2</div>
                <div class="requirements">Earth Earth</div>
                  : <span class="money resource ">-1</span>
                  <div class="description ">
                      (Effect: When you play a card, you pay 1 MC less for it.)
                  </div><br>
                  <div class="triangle triangle-white"></div>
                  <div class="description ">
                      (Requires 2 Earth tags. Gain 1 Trade Fleet.)
                  </div>
              </div>
`],
["Solar Probe",`
              <div class="title background-color-events ">Solar Probe</div>
              <div class="price ">9</div>
              <div class="tag tag1 tag-event "></div>
              <div class="tag tag2 tag-space "></div>
              <div class="tag tag3 tag-science "></div>
              <div class="colonies-icon project-icon"></div>
              <div class="content ">
                <div class="points points-big">1</div>
                  <div class="resource card"></div> /
                    <div class="resource-tag science"></div><div class="resource-tag science" style="margin-left:-10px"></div><div class="resource-tag science" style="margin-left:-10px"></div>
                  <div class="description ">
                      (Draw 1 card for every 3 science tags you have, including this.)
                  </div>
              </div>
`],
["Solar Reflectors",`
              <div class="title background-color-automated ">Solar Reflectors</div>
              <div class="price ">23</div>
              <div class="tag tag1 tag-space"></div>
              <div class="colonies-icon project-icon"></div>
              <div class="content ">
                <div class="production-box production-box-size1a">
                    5 <div class="heat production"></div>
                </div>
                <div class="description">
                  (Increase your heat production 5 steps.)
                </div>
              </div>
`],
["Space Port",`
              <div class="title background-color-automated ">Space Port</div>
              <div class="price ">22</div>
              <div class="tag tag1 tag-building "></div>
              <div class="tag tag2 tag-city "></div>
              <div class="colonies-icon project-icon"></div>
              <div class="content ">
                <div class="requirements">Colony</div>
                  <div class="production-box production-box-size1a ">
                      <div class="production-prefix ">&#x2796;&#xFE0E;</div><div class="energy production "></div>
                      <div class="production-prefix ">&#x2795;&#xFE0E;</div><div class="money production ">4</div>
                  </div>
                  <div class="tile city-tile " style="margin-left:10px "></div> <div class="triangle triangle-white" style="margin-left:10px "></div><br>
                  <div class="description ">
                      (Requires 1 colony. Decrease your Energy production 1 step and increase your MC production 4 steps.
                      Place a City tile. Gain 1 Trade Fleet.)
                  </div>
              </div>
`],
["Space Port Colony",`
              <div class="title background-color-automated ">Space Port Colony</div>
              <div class="price ">27</div>
              <div class="tag tag1 tag-space "></div>
              <div class="colonies-icon project-icon"></div>
              <div class="content ">
                <div class="points">1/2<div class="triangle triangle-red" style="vertical-align:middle;"></div></div>
                <div class="requirements">Colony</div>
                  <div class="triangle triangle-black"></div>* <div class="triangle triangle-white" style="margin-left:20px "></div><br>
                  <div class="description ">
                      (Requires a colony. Place a colony.<br> MAY BE PLACED ON A COLONY TILE WHERE YOU ALREADY HAVE A COLONY.<br> Gain 1 Trade Fleet. 1VP per 2 colonies in play.)
                  </div>
              </div>
`],
["Spin-off Department",`
            <div class="title background-color-active">Spin-off Department</div>
            <div class="price ">10</div>
            <div class="tag tag1 tag-building"></div>
            <div class="colonies-icon project-icon"></div>
            <div class="content ">
              <div class="resource money">20</div>* : <div class="resource card"></div>
              <div class="description" >
                (Effect: WHEN PLAYING A CARD WITH A BASIC COST OF 20MC OR MORE, draw a card.)
              </div><br>
              <div class="production-box"><div class="production money">2</div></div>
              <div class="description" >
                (Increase your MC production 2 steps.)
              </div>
            </div>
`],
["Sub-Zero Salt Fish",`
            <div class="title background-color-active">Sub-Zero Salt Fish</div>
            <div class="price">5</div>
            <div class="tag tag1 tag-animal"></div>
            <div class="colonies-icon project-icon"></div>
            <div class="content">
              <div class="points">1/2<div class="animal resource"></div>
              </div>
              <div class="requirements">-6 C</div>
              <span class="red-arrow"></span>
              <div class="animal resource"></div>
              <div class="description" style="margin-bottom:5px;">
                (Action: Add 1 Animal to this card.)
              </div>
              <div class="production-box production-box-size1a">
                <div class="production-prefix">&#x2796;&#xFE0E;</div><div class="plant production red-outline"></div>
              </div>
              <div class="description" style="text-align:left;">
                (Requires -6 C. Decrease any Plant production 1 step. 1 VP per<br> 2 Animals on this card.)
              </div>
            </div>
`],
["Titan Air-scrapping",`
            <div class="title background-color-active ">Titan Air-scrapping</div>
            <div class="price ">21</div>
            <div class="tag tag1 tag-jovian "></div>
            <div class="colonies-icon project-icon"></div>
            <div class="content ">
                <div class="points points-big">2</div>
                <div class="resource titanium"></div> <div class="red-arrow "></div> <div class="resource floater"></div><div class="resource floater"></div> <br>
                OR <div class="resource floater"></div><div class="resource floater"></div> <div class="red-arrow "></div> <div class="tile rating"></div>
                <div class="description ">
                  (Action: Spend 1 titanium to add 2 floaters here, or spend 2 floaters here to increase your TR 1 step.)
                </div>
              </div>
`],
["Titan Floating Launch-Pad",`
            <div class="title background-color-active ">Titan Floating Launch-Pad</div>
            <div class="price ">18</div>
            <div class="tag tag1 tag-jovian "></div>
            <div class="colonies-icon project-icon"></div>
            <div class="content ">
                <div class="points points-big">1</div>
                <div class="red-arrow "></div>
                <div class="resource floater"><div class="card-icon tag-jovian"></div></div> <br>
                OR <div class="resource floater"></div> <div class="red-arrow "></div> <div class="triangle triangle-white"></div>
                <div class="description ">
                  (Action: Add 1 floater to ANY JOVIAN CARD, or spend 1 floater here to trade for free.)
                </div>
                <div class="resource floater" style="margin-left:-130px;margin-top:15px;"><div class="card-icon tag-jovian"></div></div>
                <div class="resource floater"><div class="card-icon tag-jovian"></div></div>
                <div class="description" style="position: absolute; margin-left: 87px; margin-top: -36px;">
                  (Add two floaters to ANY JOVIAN CARD.)
                </div>
              </div>
`],
["Titan Shuttles",`
            <div class="title background-color-active ">Titan Shuttles</div>
            <div class="price ">23</div>
            <div class="tag tag1 tag-space "></div>
            <div class="tag tag2 tag-jovian "></div>
            <div class="colonies-icon project-icon"></div>
            <div class="content ">
                <div class="points points-big">1</div>
                <div class="red-arrow "></div>
                <div class="resource floater"><div class="card-icon tag-jovian"></div></div>
                <div class="resource floater"><div class="card-icon tag-jovian"></div></div> <br>
                OR X<div class="resource floater"></div> <div class="red-arrow "></div> X<div class="resource titanium"></div>
                <div class="description ">
                  (Action: Add 2 floaters to ANY JOVIAN CARD, or spend any number of floaters here to gain the same number of titanium.)
                </div>
              </div>
`],
["Trade Envoys",`
              <div class="title background-color-active ">Trade Envoys</div>
              <div class="price ">6</div>
              <div class="colonies-icon project-icon"></div>
              <div class="content ">
                  <div class="triangle triangle-white"></div> : <span style="font-family:Prototype;font-size:23px;font-weight:normal;vertical-align:middle">+1</span>
                  <div class="description " style="margin-top:5px">
                      (Effect: When you trade, you may first increase that Colony Tile track 1 step.)
                  </div>
              </div>
`],
["Trading Colony",`
              <div class="title background-color-active ">Trading Colony</div>
              <div class="price ">18</div>
              <div class="tag tag1 tag-space "></div>
              <div class="colonies-icon project-icon"></div>
              <div class="content ">
                <div class="triangle triangle-white"></div> : <span style="font-family:Prototype;font-size:23px;font-weight:normal;vertical-align:middle">+1</span>
                  <br>
                  <div class="description " style="margin-top:5px;margin-bottom:5px">
                      (Effect: When you trade, you may first increase that Colony Tile track 1 step.)
                  </div>
                  <div class="triangle triangle-black"></div>
                  <br>
                  <div class="description " style="margin-top:5px">
                      (Place a colony.)
                  </div>
              </div>
`],
["Urban Decomposers",`
            <div class="title background-color-automated">Urban Decomposers</div>
            <div class="price">6</div>
            <div class="tag tag1 tag-microbe"></div>
            <div class="colonies-icon project-icon"></div>
            <div class="content">
              <div class="requirements">Colony City</div>
              <div class="production-box">
                <div class="production plant"></div>
              </div>
              <div class="resource microbe" style="margin-left:20px;"></div><div class="resource microbe"></div>*
              <div class="description">
                (Requires that you have 1 city tile and 1 colony in play. Increase your plant production 1 step, and add 2 microbes to ANOTHER card.)
              </div>
            </div>
`],
["Warp Drive",`
              <div class="title background-color-active ">Warp Drive</div>
              <div class="price ">14</div>
              <div class="tag tag1 tag-science"></div>
              <div class="colonies-icon project-icon"></div>
              <div class="content ">
                <div class="points points-big ">2</div>
                <div class="requirements">5 Science</div>
                  <div class="resource-tag tag-space"></div> : <div class="money resource ">-4</div>
                  <div class="description ">
                      (Effect: When you play a Space card, you pay 4 MC less for it.)
                  </div><br>
                  <div class="description ">
                      (Requires 5 Science tags.)
                  </div>
              </div>
`],
["CrediCor",`
      <div class="corporationLabel ">CORPORATION</div>
      <div class="contentCorporation ">
          <div class="corporationEffectBox ">
              <div class="corporationEffectBoxLabel ">EFFECT</div>
              -<div class="resource money ">20</div> : <div class="resource money ">4</div>
              <div class="description " style="text-align:center;margin-top:0px; ">
                  (Effect: After you pay for a card or standard project with a basic cost of 20MC or more, you gain 4MC.)
              </div>
          </div>
          <span style="font-size:40px; color: white; font-family: 'Times New Roman'; font-weight:normal;line-height:60px; border:2px solid purple; padding-left:5px; padding-bottom:5px; margin-left:10px; box-shadow: 6px 6px 10px grey; text-shadow:
      -1px 0 purple, 0 1px purple, 1px 0 purple, 0 -1px purple, 6px 6px 10px grey; ">
              credicor
          </span><br><br>
          <div class="description " style="text-align:center ">
          <div class="resource money" style="margin-top:-10px;">57</div><br>
              (You start with 57 MC.)
          </div>
      </div>
`],
["EcoLine",`
    <div class="tag tag1 tag-plant"></div>
    <div class="corporationLabel">CORPORATION</div>
    <div class="contentCorporation">
      <div class="corporationEffectBox">
        <div class="corporationEffectBoxLabel">EFFECT</div>
        7
        <div class="resource plant"></div> <span class="red-arrow"></span>
        <div class="greenery-tile tile"></div><br>
        <div class="description" style="text-align:center;margin-top:0px;">
          (Effect: You may always pay 7 plants, instead of 8, to place greenery.)
        </div>
      </div>
      <span style="font-size:50px;
                      font-weight:normal;
                      color:rgb(0,180,0);
                      letter-spacing:2px;
                      margin-left:5px;
                      text-shadow: -1px 0 #404040, 0 1px #404040, 1px 0 #404040, 0 -1px #404040, 5px 5px 5px grey;
                      ">
                  ecoline
              </span><br>
      <div class="production-box production-box-size2" style="margin-top:5px;margin-right:10px;">
        <div class="production plant"></div><div class="production plant"></div>
      </div>
       <div class="resource money">36</div> 3<div class="resource plant"></div>
      <div class="description" style="margin-top:0px;text-align:center;">(You start with 2 plant production, 3 plants, and 36MC)</div>
    </div>
`],
["Helion",`
    <div class="tag tag1 tag-space"></div>
    <div class="corporationLabel">CORPORATION</div>
    <div class="contentCorporation">
      <div class="corporationEffectBox">
        <div class="corporationEffectBoxLabel">EFFECT</div>
        X<div class="resource heat"></div> :
        <div class="resource money">X</div>
        <div class="description" style="text-align:center;margin-top:0px;">
          (Effect: Your may use heat as MC. You may not use MC as heat.)
        </div>
      </div>
      <div style="font-size:34px;
                      width:140px;
                      text-align: center;
                      margin-top:5px;
                      border:2px solid black;
                      margin-left:8px;
                      background: #e6e600;
                      box-shadow: 6px 6px 6px grey;
                      border-radius:2px;">
                  helion</div><br>
      <div class="production-box production-box-size3" style="margin-left:20px;margin-top:-50px;">
        <div class="production heat"></div><div class="production heat"></div><div class="production heat"></div>
      </div>
        <div class="resource money" style="margin-left:20px;">42</div>
      <div class="description" style="text-align:center;">
        (You start with 3 heat production and 42 MC.)
      </div>
    </div>
`],
["Mining Guild",`
    <div class="tag tag1 tag-building"></div>
    <div class="tag tag2 tag-building"></div>
    <div class="corporationLabel">CORPORATION</div>
    <div class="contentCorporation">
      <div class="corporationEffectBox">
        <div class="corporationEffectBoxLabel">EFFECT</div>
        <div class="resource steel"></div> /
        <div class="resource titanium"></div> :
        <div class="production-box">
          <div class="production steel"></div>
        </div>
        <div class="description" style="text-align:center;margin-top:0px;">
          (Effect: Each time you get any steel or titanium as a placement bonus on the map, increase your steel production 1 step.)
        </div>
      </div>
      <span class=" mining guild" style="font-size:24px;
              margin-left:20px;
                      color:#c9380e;
                      text-shadow: -1px 0 #333333, 0 1px #333333, 1px 0 #333333, 0 -1px #333333, 2px 2px 2px  black;
                      display:inline-block;
                      -webkit-transform:scale(1.5,1); /* Safari and Chrome */
                      -moz-transform:scale(1.5,1); /* Firefox */
                      -ms-transform:scale(1.5,1); /* IE 9 */
                      -o-transform:scale(1.5,1); /* Opera */
                      transform:scale(1.5,1); /* W3C */
                      ">
                  MINING<br>GUILD
              </span><br>
      <div class="resource money" style="margin-left:35px;">30</div>&nbsp;&nbsp;
      5<div class="production steel"></div>
      <div class="production-box" style="margin-top:5px;margin-left:20px;">
        <div class="production steel"></div>
      </div>
      <div class="description" style="margin-top:-5px;text-align:center;">
        (You start with 30 MC, 5 steel, and 1 steel production)
      </div>
    </div>
`],
["Interplanetary Cinematics",`
    <div class="tag tag1 tag-building"></div>
      <div class="corporationLabel ">CORPORATION</div>
      <div class="contentCorporation ">
          <div class="corporationEffectBox ">
              <div class="corporationEffectBoxLabel ">EFFECT</div>
              <div class="resource-tag tag-event"></div> : <div class="resource money">2</div>
              <div class="description " style="text-align:center;margin-top:0px; ">
                  (Effect: Each time you play an event, you gain 2 MC.)
              </div>
          </div>
          <div class="INTERPLANETARY CINEMATICS" style="font-size:17px">
            INTERPLANETARY
          </div>
          <div style="height:5px;margin-top:-2px;width:143px;background:linear-gradient(to right, yellow,black,yellow,black,yellow);border:5px solid #cc3333;box-shadow:3px 3px 6px grey;">
          </div>
          <div class="INTERPLANETARY CINEMATICS" style="font-size:24px;margin-left:3px;margin-top:-5px;
          display:inline-block;
          -webkit-transform:scale(0.5,1); /* Safari and Chrome */
          -moz-transform:scale(0.5,1); /* Firefox */
          -ms-transform:scale(0.5,1); /* IE 9 */
          -o-transform:scale(0.5,1); /* Opera */
          transform:scale(1,0.5); /* W3C */
          ;
          margin-bottom:15px;">CINEMATICS
        </div><br>
          <div class="resource money " style="margin-left:40px;">30</div>&nbsp;&nbsp;&nbsp;&nbsp; 20<div class="resource steel"></div>
          <div class="description " style="text-align:center ">
              (You start with 20 steel and 30 MC.)
          </div>
      </div>
`],
["Inventrix",`
    <div class="tag tag1 tag-science"></div>
      <div class="corporationLabel ">CORPORATION</div>
      <div class="contentCorporation ">
          <div class="corporationEffectBox ">
              <div class="corporationEffectBoxLabel ">EFFECT</div>
                <div class="tile background-color-corporation" style="width:100px;text-shadow:none;color:black;font-size:11px;padding-top:5px;padding-bottom:5px;">Temp / O2 / Ocean</div>: +/- 2
              <div class="description " style="text-align:center;margin-top:0px; ">
                  (Effect: Your temperature, oxygen and ocean requirements are +2 or -2 steps, your choice in each case.)
              </div>
          </div>
          <span style="font-size:24px;
          padding-left:5px;
          padding-bottom:5px;
          text-shadow: 6px 6px 5px grey;
          ;">
            <span style="background-color:#6bb5c7;padding-left:4px;padding-right:4px;font-size:26px;box-shadow: 6px 6px 10px grey;">X</span> INVENTRIX
          </span>
          <div class="description " style="text-align:center ">
            <div class="resource money " style="margin-left:20px;">45</div> <div class="resource card" style="margin-left:20px"></div><div class="resource card"></div><div class="resource card"></div><br>
              (As you first action in the game, draw 3 cards. Start with 45MC.)
          </div>
      </div>
`],
["PhoboLog",`
    <div class="tag tag1 tag-space"></div>
    <div class="corporationLabel">CORPORATION</div>
    <div class="contentCorporation">
      <div class="corporationEffectBox">
        <div class="corporationEffectBoxLabel">EFFECT</div>
        <div class="resource titanium"></div> : +
        <div class="resource money">1</div>
        <div class="description" style="text-align:center;margin-top:0px;">
          (Effect: Your titanium resources are each worth 1 MC extra.)
        </div>
      </div>
      <span style="font-size:24px;
                      margin-left:15px;
                      color:white;
                      line-height:40px;
                      background: #32004d;
                      padding-left:5px;
                      padding-right:5px;
                      border:1px solid #444;
                      border-radius:10px;
                      font-family: 'Times New Roman';
                      display:inline-block;
                      -webkit-transform:scale(1.2,1); /* Safari and Chrome */
                      -moz-transform:scale(1.2,1); /* Firefox */
                      -ms-transform:scale(1.2,1); /* IE 9 */
                      -o-transform:scale(1.2,1); /* Opera */
                      transform:scale(1.2,1); /* W3C */
                      box-shadow:  6px 6px 5px  grey;">
                  PHOBOLOG
              </span><br><br>
      <div class="resource money" style="margin-left:45px;">23</div>
      10<div class="resource titanium"></div>
      <div class="description" style="text-align:center;">
        (You start with 10 titanium and 23 MC.)
      </div>
    </div>
`],
["Tharsis Republic",`
    <div class="tag tag1 tag-building"></div>
      <div class="corporationLabel ">CORPORATION</div>
      <div class="contentCorporation ">
          <div class="corporationEffectBox ">
              <div class="corporationEffectBoxLabel ">EFFECT</div>
              <div class="tile city-tile-small red-outline"></div>*: <div class="production-box"><div class="production money">1</div></div>&nbsp;&nbsp;
                <div class="tile city-tile-small"></div>:<div class="resource money">3</div>
              <div class="description " style="text-align:center;margin-top:0px; ">
                  (Effect: When any city tile is placed ON MARS, increase your MC production 1 step. When you place a city tile, gain 3 MC.)
              </div>
          </div>
          <div style="font-size:24px;text-shadow:6px 6px 6px grey;">
            <div style="text-shadow:none;box-shadow:3px 3px 6px grey;margin-right:2px;border: 1px solid red;display:inline-block;background-color:#ff5f00;">&#x25b2<span style="font-size:14px;padding:0px;border:none;margin-left:-5px;">&#x25b2</span>
            </div>THARSIS<br>&nbsp; REPUBLIC</div>
          <div class="description " style="text-align:center ">
          <div class="resource money " style="margin-left:60px;">40</div> <div class="tile city-tile" style="margin-left:40px;margin-top:-20px;"> </div><br>
              (You start with 40 MC. As your first action in the game,place a city tile.)
          </div>
      </div>
`],
["Thorgate",`
    <div class="tag tag1 tag-power"></div>
    <div class="corporationLabel">CORPORATION</div>
    <div class="contentCorporation">
      <div class="corporationEffectBox">
        <div class="corporationEffectBoxLabel">EFFECT</div>
        <div class="resource-tag tag-power"></div> * :
        <div class="resource money">-3</div>
        <div class="description" style="text-align:center;margin-top:0px;">
          (Effect: When playing a power card OR THE STANDARD PROJECT POWER PLANT, you pay 3 MC less for it.)
        </div>
      </div>
      <span style="font-size:32px;
                      font-family: 'Arial Narrow','Verdana';
                      font-weight:normal;
                       text-shadow: 6px 3px 5px  grey;">
                  THORGATE
              </span><br><br>
      <div class="production-box" style="margin-left:45px;margin-top:-10px;">
        <div class="production energy"></div>
      </div>
      <div class="resource money" style="margin-left:20px;">48</div>
      <div class="description" style="text-align:center;">
        (You start with 1 energy production and 48 MC.)
      </div>
    </div>
`],
["United Nations Mars Initiative",`
    <div class="tag tag1 tag-earth"></div>
    <div class="corporationLabel">CORPORATION</div>
    <div class="contentCorporation">
      <div class="corporationEffectBox">
        <div class="corporationEffectBoxLabel">ACTION</div>
        <div class="resource money">3</div> <span class="red-arrow"></span>
        <div class="tile rating"></div>*
        <div class="description" style="text-align:center;margin-top:0px;">
          (Action:If your Terraform Rating was raised this generation, you may pay 3 MC to raise it 1 step more.)
        </div>
      </div>
      <div class="background-color-active" style="font-size:16px;
                      width:100px;
                      color: white;
                      margin-left:19px;
                      margin-bottom:10px;
                      padding:5px;
                      padding-top:10px;
                      padding-bottom:10px;
                      text-align:center;
                      font-weight:normal;
                      box-shadow:3px 3px 6px grey;
                      ">
                  UNITED NATIONS MARS INITIATIVE
              </div>
      <div class="description" style="text-align:center;margin-left:50px;">
        <div class="resource money">40</div> &nbsp;&nbsp;&nbsp;(You start with 40 MC.)
      </div>
    </div>
`],
["Teractor",`
    <div class="tag tag1 tag-earth"></div>
    <div class="corporationLabel">CORPORATION</div>
    <div class="corporate-icon corporation-icon"></div>
    <div class="contentCorporation">
      <div class="corporationEffectBox">
        <div class="corporationEffectBoxLabel">EFFECT</div>
        <div class="resource-tag tag-earth"></div> :
        <div class="resource money">-3</div>
        <div class="description" style="text-align:center;margin-top:0px;">
          (Effect: When playing an Earth card, you pay 3 MC less for it.)
        </div>
      </div>
      <span style="font-size:34px;
                      color: orangered;
                      font-family: 'Times New Roman';
                      font-weight:normal;
                      text-shadow: -1px 0 #333333, 0 1px #333333, 1px 0 #333333,0px -1px #333333, 6px 3px 5px  grey;">
                  TERACTOR
              </span><br><br>
      <div class="description" style="text-align:center;">
        <div class="resource money">60</div><br> (You start with 60 MC.)
      </div>
    </div>
`],
["Saturn Systems",`
    <div class="tag tag1 tag-jovian"></div>
    <div class="corporationLabel">CORPORATION</div>
    <div class="corporate-icon corporation-icon"></div>
    <div class="contentCorporation">
      <div class="corporationEffectBox">
        <div class="corporationEffectBoxLabel">EFFECT</div>
        <span class="resource-tag tag-jovian red-outline"></span>&nbsp;:
        <div class="production-box">
          <div class="production money">1</div>
        </div>
        <div class="description" style="text-align:center;margin-top:0px;">
          (Effect: Each time any Jovian tag is put into play, including this, increase your MC production 1 step.)
        </div>
      </div>
      <span style="font-size:14px;
                      color:white;
                      line-height:40px;
                      background: #32004d;
                      padding-top:8px;
                      padding-bottom:8px;
                      padding-left:20px;
                      padding-right:20px;
                      border-radius:50%;
                      font-weight:normal;
                      border:2px solid white;
                      box-shadow:  6px 6px 5px  grey;">
                  SATURN <span style="font-size:20px;display:inline-block;">&#x25CF;</span> SYSTEMS
      </span><br><br>
      <div class="production-box" style="margin-left:45px;margin-top:-10px;">
        <div class="production titanium"></div>
      </div>
      <div class="resource money" style="margin-left:20px;">42</div>
      <div class="description" style="text-align:center;margin-top:0px;">
        (You start with 1 titanium production and 42 MC.)
      </div>
    </div>
`],
["Aphrodite",`
    <div class="tag tag1 tag-plant"></div>
    <div class="tag tag2 tag-venus"></div>
    <div class="corporationLabel">CORPORATION</div>
    <div class="venus-icon corporation-icon"></div>
    <div class="contentCorporation">
      <div class="corporationEffectBox">
        <div class="corporationEffectBoxLabel">EFFECT</div>
        <div class="tile venus-tile">V</div> : <div class="resource money">2</div>
        <div class="description" style="text-align:center;margin-top:0px;">
          (Effect: Whenever Venus is terraformed 1 step, you gain 2MC.)
        </div>
      </div>
      <div style="font-size:23px;
                    color: orange;
                    font-weight:bold;
                    margin-top:10px;
                    text-shadow:  6px 6px 6px  grey;
                    text-shadow: -1px 0 #333333, 0 1px #333333, 1px 0 #333333,0px -1px #333333, 6px 3px 5px  grey;">
                APHRODITE</div>
                <br><div class="production-box " style="margin-top:5px;margin-left:50px; ">
                <div class="production plant "></div>
            </div>
            <div class="resource money " style="margin-left:20px; ">47</div>
            <div class="description " style="text-align:center; ">
                (You start with 1 plant production and 47 MC)
            </div>
        </div>
`],
["Celestic",`
      <div class="tag tag1 tag-venus"></div>
      <div class="corporationLabel">CORPORATION</div>
      <div class="venus-icon corporation-icon"></div>
      <div class="contentCorporation">
        <div class="points" style="z-index:1;margin-top:231px;margin-left:124px;">1/3<div class="resource floater"></div></div>
        <div class="corporationEffectBox">
          <div class="corporationEffectBoxLabel">ACTION</div>
          <div class="red-arrow"></div> <div class="resource floater"></div>*
          <div class="description" style="text-align:center;margin-top:0px;">
            (Action: Add a floater to ANY card.) <br>
          </div>
          <div class="description" style="margin-top:17px;margin-left:17px;text-align:left;">
          (1 VP per 3 floaters <br>
          on this card.)
          </div>
        </div>
        <div  class="celestic" style="font-size:24px;box-shadow:6px 6px 6px grey;margin-left: 9px;
                        ">
                    <span style="background:linear-gradient(to right, rgb(251,192,137),rgb(251,192,137),rgb(23,185,236));padding-left:5px;">CEL</span><span
                    style="background:linear-gradient(to right,rgb(23,185,236),rgb(251,192,137))">ES</span><span style="background:rgb(251,192,137);padding-right:5px;">TIC</span>
                </div>
      </div><br>
        <div class="resource money" style="margin-left:30px;">42</div>
        <div class="resource card" style="margin-left:15px;"><div class="card-icon card-icon-floater">&#x2601;</div></div>
        <div class="resource card"><div class="card-icon card-icon-floater">&#x2601</div></div>
        <div class="description" style="text-align:center;margin-top:-5px;font-size:10px;">
          (You start with 42 MC. As your first action, reveal cards from the deck until you have revealed 2 cards with a floater icon on it. Take those 2 cards into hand and discard the rest.)
        </div>
`],
["Manutech",`
      <div class="tag tag1 tag-building"></div>
      <div class="corporationLabel">CORPORATION</div>
      <div class="venus-icon corporation-icon"></div>
      <div class="contentCorporation">
        <div class="corporationEffectBox">
          <div class="corporationEffectBoxLabel">EFFECT</div>
          <div class="production-box">
            <div class="production" style="background:white;">?</div>
          </div> :
          <div class="resource" style="background:white;">?</div>
          <div class="description" style="text-align:center;margin-top:0px;">
            (Effect: For each step you increase the production of a resource, including this, you also gain that resource.)
          </div>
        </div>
        <span class="manutech" style="font-size:30px;
                        color: #e63900;
                        text-shadow:  6px 3px 5px  grey;">
                    <span style="color:white;background:#e63900;text-shadow:none;padding-left:2px;">MA</span>NUTECH
                </span><br>
        <div class="production-box" style="margin-top:15px;margin-left:50px;">
          <div class="production steel"></div>
        </div>
        <div class="resource money" style="margin-left:20px;">35</div>
        <div class="description" style="text-align:center;">
          (You start with 1 steel production, and 35 MC)
        </div>
      </div>
`],
["Morning Star Inc.",`
      <div class="tag tag1 tag-venus"></div>
      <div class="corporationLabel">CORPORATION</div>
      <div class="venus-icon corporation-icon"></div>
      <div class="contentCorporation">
        <div class="corporationEffectBox">
          <div class="corporationEffectBoxLabel">EFFECT</div>
          <div class="tile venus-tile">V</div> : +/- 2
          <div class="description" style="text-align:center;margin-top:0px;">
            (Effect: Your Venus requirements are +/- 2 steps, your choice in each case.)
          </div>
        </div>
        <div  style="font-size:18px; color:white;margin-top:5px;margin-bottom:-10px;
        text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black, 6px 3px 5px  grey;
                        ">
                    MORNING STAR INC.
                </div><br>
        <div class="resource money" style="margin-left:10px;">50</div>
        <div class="resource card" style="margin-left:15px;"><div class="card-icon card-icon-venus">V</div></div>
        <div class="resource card"><div class="card-icon card-icon-venus">V</div></div>
        <div class="resource card"><div class="card-icon card-icon-venus">V</div></div>
        <div class="description" style="text-align:center;margin-top:-5px;">
          (You start with 50 MC. As your first action, reveal cards from the deck until you have revealed 3 Venus-tag cards. Take those into hand and discard the rest.)
        </div>
      </div>
`],
["Viron",`
      <div class="tag tag1 tag-microbe"></div>
      <div class="corporationLabel">CORPORATION</div>
      <div class="venus-icon corporation-icon"></div>
      <div class="contentCorporation">
        <div class="corporationEffectBox">
          <div class="corporationEffectBoxLabel">ACTION</div>
          <div class="red-arrow" style="font-size:30px;"></div>
          <div class="description" style="text-align:center;margin-top:0px;">
            (Action: Use a blue card action that has already been used this generation.)
          </div>
        </div>
        <div  style="font-size:50px; font-family: Prototype;margin-left: 15px;
        text-shadow: -1px 0 white, 0 1px white, 1px 0 white, 0 -1px white, 6px 3px 5px  grey;
                        ">
                    VIRON
                </div><br>
        <div class="resource money" style="margin-left:65px;">48</div>
        <div class="description" style="text-align:center;">
          (You start with 48 MC.)
        </div>
      </div>
`],
["Cheung Shing MARS",`
      <div class="tag tag1 tag-building"></div>
      <div class="corporationLabel">CORPORATION</div>
      <div class="prelude-icon corporation-icon"></div>
      <div class="contentCorporation">
        <div class="corporationEffectBox">
          <div class="corporationEffectBoxLabel">EFFECT</div>
          <div class="resource-tag tag-building"></div> :
          <div class="resource money">-2</div>
          <div class="description" style="text-align:center;margin-top:0px;">
            (Effect: When you play a building tag, you pay 2 MC less for it.)
          </div>
        </div>
        <div style="margin-top:20px;width:50px;display:inline-block;"><span style="color:red;border:4px solid red;border-radius:50%;padding:3px 5px 3px 5px;font-size:30px;line-height:14px;box-shadow: 3px 3px 3px grey, inset 0 0 3px 3px grey;text-shadow: 3px 3px 3px grey;">㨐</span></div>
        <div style="display: inline-block; width:140px; font-size:19px; line-height: 22px; vertical-align: middle; margin-bottom: 15px;
                        font-family: 'Prototype';
                        font-weight:normal;
                        ">
                    &nbsp;Cheung Shing <br><div style="margin-left:10px">	■■MARS■■ </div>
                </div>
        <div class="production-box" style="margin-left:45px;margin-top:-10px;">
          <div class="production money">3</div>
        </div>
        <div class="resource money" style="margin-left:20px;">44</div>
        <div class="description" style="text-align:center;">
          (You start with 3 MC production and 44 MC.)
        </div>
      </div>
`],
["Point Luna",`
      <div class="tag tag1 tag-space"></div>
      <div class="tag tag2 tag-earth"></div>
        <div class="corporationLabel ">CORPORATION</div>
        <div class="prelude-icon corporation-icon"></div>
        <div class="contentCorporation ">
            <div class="corporationEffectBox ">
                <div class="corporationEffectBoxLabel ">EFFECT</div>
                <div class="resource-tag tag-earth"></div> : <div class="resource card"></div>
                <div class="description " style="text-align:center;margin-top:0px; ">
                    (Effect: When you play an Earth tag, including this, draw a card.)
                </div>
            </div>
            <div class="point luna" style="font-size:22px;
            font-family: Prototype;
            font-weight: normal;
            display:inline-block;
            margin-top: 35px;
            margin-bottom: 5px;
            text-decoration: underline;
            margin-left: 40px;
            -webkit-transform:scale(1.5,1); /* Safari and Chrome */
            -moz-transform:scale(1.5,1); /* Firefox */
            -ms-transform:scale(1.5,1); /* IE 9 */
            -o-transform:scale(1.5,1); /* Opera */
            transform:scale(1.5,1); /* W3C */
            ">POINT<span>&nbsp;</span>LUNA</div>
            </div>
            <div class="description " style="text-align:center;margin-top:0px ">
            <div class="production-box" style="margin-left:-30px;margin-top:-5px;margin-bottom:-5px;"><div class="production titanium"></div></div>
            <div class="resource money" style="margin-left:60px">38</div><br>
              (You start with 1 titanium production<br> and 38 MC.)
            </div>
        </div>
`],
["Robinson Industries",`
      <div class="corporationLabel">CORPORATION</div>
      <div class="prelude-icon corporation-icon"></div>
      <div class="contentCorporation">
        <div class="corporationEffectBox">
          <div class="corporationEffectBoxLabel">EFFECT</div>
          <div class="resource money">4</div>
          <div class="red-arrow"></div>
          <div class="production-box">
            <div class="production" style="background:white;">?</div>
          </div>
          <div class="description" style="text-align:center;margin-top:0px;">
            (Action: Spend 4 MC to increase (one of) your LOWEST PRODUCTION 1 step.)
          </div>
        </div>
        <div class="robinson" style="letter-spacing:4px;border-bottom:3px solid #ccc;margin-top:5px;">ROBINSON</div>
        <div class="robinson" style="border-bottom:3px solid #ccc;">•—•—•—•—•—•—•&nbsp;</div>
        <div class="robinson" style="letter-spacing:2px;">INDUSTRIES</div>
        <div class="resource money" style="margin-left:59px;margin-top:20px;">47</div>
        <div class="description" style="text-align:center;">
          (You start with 47 MC.)
        </div>
`],
["Valley Trust",`
      <div class="tag tag1 tag-earth"></div>
        <div class="corporationLabel ">CORPORATION</div>
        <div class="prelude-icon corporation-icon"></div>
        <div class="contentCorporation ">
            <div class="corporationEffectBox ">
                <div class="corporationEffectBoxLabel ">EFFECT</div>
                <div class="resource-tag science"></div> : <div class="resource money">-2</div>
                <div class="description " style="text-align:center;margin-top:0px; ">
                    (Effect: When you play an Science tag, you pay 2MC less for it.)
                </div>
            </div>
            <div style="color:rgb(2,125,195);background:linear-gradient(to right,rgb(2,125,195) 10%,white,white,white, white,white,white, white);box-shadow:3px 3px 10px 1px rgb(58,58,58);width:135px;line-height:24px;border-radius:10px 0px 0px 10px">
              <div style="display:inline-block;margin-left:25px;margin-top: 3px;font-size:26px;text-shadow: 2px 2px #ccc;text-align:center">VALLEY TRUST</div>
            </div>
            <div class="description" style="text-align:center;">
            <div class="resource money" style="margin-left:12px;margin-top:10px;">37</div> <div class="resource card-corporation" style="margin-left:50px"><span style="background:linear-gradient(to right, rgb(235,118,171), #e64d91);padding-left:4px;padding-right:4px;border-radius:2px;">PREL</span></div>
            <div class="description" style="margin-top:-2px;">
              (You start with 37 MC. As your first action, draw 3 Prelude cards, and play one of them. Discard the other two.)
            </div>
        </div>
`],
["Vitor",`
      <div class="tag tag1 tag-earth"></div>
        <div class="corporationLabel ">CORPORATION</div>
        <div class="prelude-icon corporation-icon"></div>
        <div class="contentCorporation ">
            <div class="corporationEffectBox ">
                <div class="corporationEffectBoxLabel ">EFFECT</div>
                <div class="resource points-big"
                style="background: linear-gradient(#cc8b00, rgb(128, 87, 0),rgb(128, 87, 0));
                width: 40px;
                height: 34px;
                font-weight: normal;
                line-height: 31px;
                font-size: 28px;
                text-align: center;
                border-radius: 12px;
                border-style: outset;
                background-color: rgb(205,162,130);
                background: linear-gradient(#cc8b00, rgb(128, 87, 0),rgb(128, 87, 0));
                box-shadow: 0 0 0 1px rgba(0,0,0,0.6), 0 0 0 2px rgba(0,0,0,0.3);
                "
                >?</div> : <div class="resource money">3</div>
                <div class="description " style="text-align:center;margin-top:0px; ">
                    (Effect: When you play a card with a NON-NEGATIVE VP icon, including this, gain 3MC.)
                </div>
            </div>
            <div class="vitor" style="font-size:24px;
            margin-top:10px;
            margin-left:50px;
            margin-bottom:35px;
            display:inline-block;
            box-shadow:6px 6px 6px grey;
            -webkit-transform:scale(2,1); /* Safari and Chrome */
            -moz-transform:scale(2,1); /* Firefox */
            -ms-transform:scale(2,1); /* IE 9 */
            -o-transform:scale(2,1); /* Opera */
            transform:scale(2,1); /* W3C */
            ;">
            <span style="color:white;background:orangered;padding-left:3px;">VIT</span>
            <span style="background:linear-gradient(to right, orangered,white);margin-left:-8px;">O</span>
            <span style="margin-left:-7px;background:white;padding-right:3px;">R</span>
            </div>
            <div class="description " style="text-align:center;margin-top:-5px ">
            <div class="resource money">45</div><span
            style="background:orange;padding:2px;padding-left:25px;padding-right:25px;
            font-size:14px;font-weight:bold;margin-left:20px;border-radius:3px;box-shadow: 0 0 0 1px rgba(0,0,0,0.6), 0 0 0 2px rgba(0,0,0,0.3);">AWARDS</span> <br>
              (You start with 45 MC. As your first action, fund an award for free.)
            </div>
        </div>
`],
["Aridor",`
      <div class="corporationLabel">CORPORATION</div>
      <div class="colonies-icon corporation-icon"></div>
      <div class="contentCorporation">
        <div class="corporationEffectBox">
          <div class="corporationEffectBoxLabel">EFFECT</div>
          <span class="resource-tag" style="background:linear-gradient(to bottom right, green, yellow, red)">&nbsp;</span>&nbsp;:
          <div class="production-box">
            <div class="production money">1</div>
          </div>
          <div class="description" style="text-align:center;margin-top:0px;">
            (When you get a new type of tag in play (event cards do not count), increase your MC production 1 step.)
          </div>
        </div>
        <div class="aridor">ARIDOR</div>
        <div class="resource money" style="margin-left:20px;">40</div>
        <span style="background:#444;color:#eee;padding:4px;padding-left: 8px;padding-right: 8px; border-radius:20px;font-weight:normal;margin-left:20px;
        box-shadow: 0 0 0 1px rgba(0,0,0,0.6), 0 0 0 2px rgba(0,0,0,0.3); border:1px solid #eee;">COLONY</span>
        <div class="description" style="text-align:center;margin-top:0px;">
          (You start with 40MC. As your first action add a colony tile.)
        </div>
      </div>
`],
["Arklight",`
      <div class="tag tag1 tag-animal"></div>
      <div class="corporationLabel">CORPORATION</div>
      <div class="colonies-icon corporation-icon"></div>
      <div class="contentCorporation">
        <div class="points" style="z-index:1;margin-top:231px;margin-left:124px;">1/2<div class="resource animal"></div></div>
        <div class="corporationEffectBox">
          <div class="corporationEffectBoxLabel">EFFECT</div>
          <div class="resource-tag tag-animal"></div> / <div class="resource-tag tag-plant"></div> : <div class="resource animal"></div>
          <div class="description" style="margin-top:0px;text-align:left;margin-left:20px;">
            (Effect: When you play an animal or plant tag, including<br> this, add 1 animal<br> to this card.) <br>
          </div>
        </div>
        <div  class= "arklight" style="font-size:19px;
          font-family: Prototype;
          margin-left: 74px;
          letter-spacing: 1px;
          background: linear-gradient(to right,#000089, lightblue, white);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          -webkit-transform:scale(2,1); /* Safari and Chrome */
          -moz-transform:scale(2,1); /* Firefox */
          -ms-transform:scale(2,1); /* IE 9 */
          -o-transform:scale(2,1); /* Opera */
          transform:scale(2,1); /* W3C */
          margin-top: 3px;
          margin-bottom: -12px;
          "> ARKLIGHT
        </div><br>
        <div class="resource money" style="margin-right:30px;margin-left:30px;">45</div>
        <div class="production-box ">
            <div class="money production ">2</div>
        </div>
        <div class="description" style="text-align:center;">
          (You start with 45 MC. Increase your MC production 2 steps. 1 VP per 2 animals on this card.)
        </div>
`],
["Polyphemos",`
      <div class="corporationLabel">CORPORATION</div>
      <div class="colonies-icon corporation-icon"></div>
      <div class="contentCorporation">
        <div class="corporationEffectBox">
          <div class="corporationEffectBoxLabel">EFFECT</div>
          <div class="resource card"></div>* &nbsp;: <div class="resource money">5</div>
          <div class="description" style="text-align:center;margin-top:0px;">
            (Effect: When you buy a card to hand, pay 5MC instead of 3, including the starting hand.)
          </div>
        </div>
        <div class="polyphemos"><span class="polyphemos2">POL</span>YPHEMOS</div>
        <div class="resource money" style="margin-left:20px;">50</div> <div  style="margin-left:15px;margin-right:15px" class="production-box"><div class="production money">5</div></div> 5<div class="resource titanium"></div>
        <div class="description" style="text-align:center;margin-top:0px;">
          (You start with 50MC. Increase your MC production 5 steps. Gain 5 titanium.)
        </div>
      </div>
`],
["Poseidon",`
      <div class="corporationLabel">CORPORATION</div>
      <div class="colonies-icon corporation-icon"></div>
      <div class="contentCorporation">
        <div class="corporationEffectBox">
          <div class="corporationEffectBoxLabel">EFFECT</div>
          <div class="tringle triangle-red"></div>: <div class="production-box"><div class="resource money">1</div></div>
          <div class="description" style="text-align:center;margin-top:0px;">
            (Effect: When any colony is placed, including this, raise your MC production 1 step.)
          </div>
        </div>
        <div class="poseidon">POSEIDON</div>
        <div class="resource money" style="margin-left:50px;margin-right:20px;">45</div> <div class="triangle triangle-black"></div>
        <div class="description" style="text-align:center;margin-top:0px;">
          (You start with 45MC. As your first acton, place a colony.)
        </div>
      </div>
`],
["Stormcraft",`
      <div class="tag tag1 tag-jovian"></div>
      <div class="corporationLabel">CORPORATION</div>
      <div class="colonies-icon corporation-icon"></div>
      <div class="contentCorporation">
        <div class="corporationEffectBox">
          <div class="corporationEffectBoxLabel" style="margin-bottom:5px;" >ACTION</div>
          <div class="red-arrow"></div> <div class="resource floater" style="margin-bottom:5px;"></div>* <br>
          <div class="resource floater"></div> = <div class="resource heat"></div><div class="resource heat"></div>
          <div class="description" style="text-align:center;margin-top:-5px;">
            (Action: Add a floater to ANY card.<br> Effect: Floaters on this card may be used as 2 heat each.) <br>
          </div>
        </div>
        <div class="stormcraft1">STORM</div><div class="stormcraft2">CRAFT</div>
        <div class="stormcraft3">INCOR</div><div class="stormcraft4">PORATED</div>
        <div class="resource money" style="margin-left:60px;">48</div>
        <div class="description" style="margin-left: 20px">
          (You start with 48 MC.)
        </div>
      </div>
`],
["Arcadian Communities",`
      <div class="corporationLabel">CORPORATION</div>
      <div class="promo-icon corporation-icon"></div>
      <div class="contentCorporation">
        <div class="corporationEffectBox">
          <div class="corporationEffectBoxLabel">ACTION</div>
          <div style="font-size:10px;line-height:12px;margin-top:-5px;margin-bottom:10px;"><span class="red-arrow"></span>ACTION: PLACE A COMMUNITY (PLAYER MARKER) ON A NON-RESERVED AREA ADJACENT TO ONE OF YOUR TILES OR MARKED AREAS</div>
          <div class="corporationEffectBoxLabel">EFFECT</div>
            <div style="font-size:10px;line-height:12px;margin-top:-5px;">EFFECT: MARKED AREAS ARE RESERVED FOR YOU. WHEN YOU PLACE A TILE THERE, GAIN 3 MC</div>
        </div>
        <div style="font-size:20px;
        padding-left:3px;width:147px;background:#eeeeee;box-shadow: 0 0 0 1px rgba(0,0,0,0.6), 3px 3px 3px grey;margin-left:10px;border-radius:5px;
        border-top: 2px solid rgb(221,221,221);
        border-left: 2px solid rgb(221,221,221);
        border-bottom: 2px solid rgb(137,137,137);
        border-right: 2px solid rgb(137,137,137);">
                    &nbsp;&nbsp;&nbsp;ARCADIAN <br>COMMUNITIES
                </div>
                <div class="resource money" style="margin-left:15px;margin-right:15px;">40</div>
                10<div class="resource steel" style="margin-right:20px;"></div>
                <div class="resource" style="background: linear-gradient(orange, orangered);">&nbsp;</div>*
        <div class="description" style="margin-top:-5px;text-align:center;">(You start with 40 MC and 10 steel. AS YOUR FIRST ACTION, PLACE A COMMUNITY (PLAYER MARKER) ON A NON-RESERVED AREA.)</div>
      </div>
`],
["Beginner Corporation",`
      <div class="corporationLabel">CORPORATION</div>
      <div class="contentCorporation">
        <div style="font-size:20px;
        margin-top:10px;
        padding-left:3px;width:160px;background:#eeeeee;box-shadow: 0 0 0 1px rgba(0,0,0,0.6), 3px 3px 3px grey;margin-left:10px;border-radius:5px;
        border-top: 2px solid rgb(221,221,221);
        border-left: 2px solid rgb(221,221,221);
        border-bottom: 2px solid rgb(137,137,137);
        border-right: 2px solid rgb(137,137,137);">
                    &nbsp;&nbsp;&nbsp;BEGINNER <br>CORPORATION&nbsp;&nbsp;&nbsp;
                </div>
                <div class="resource money" style="margin-left:85px;margin-right:15px;margin-top:10px;">42</div>
        <div class="description" style="text-align:center;">(You start with 42 MC. Instead of choosing from 10 cards during setup, you get 10 cards for free.)</div>
      </div>
`],
["Recyclon",`
      <div class="tag tag1 tag-building"></div>
      <div class="tag tag2 tag-microbe"></div>
      <div class="corporationLabel">CORPORATION</div>
      <div class="promo-icon corporation-icon"></div>
      <div class="contentCorporation">
        <div class="corporationEffectBox">
          <div class="corporationEffectBoxLabel" style="margin-bottom:10px">EFFECT</div>
          <div class="resource-tag tag-building"></div> :<div class="resource microbe"></div> OR
          2<div class="resource microbe"></div>:<div class="production-box" style="margin-left:5px;"><div class="production plant"></div></div><br>
          <div class="description" style="margin-top:-3px;text-align:center;">(Effect: When you play a building tag, including this, gain 1 microbe to this card, or remove 2 microbes here and raise your plant production 1 step.)
        </div>
        </div>
        <div  style="font-size:20px;margin-top:5px;margin-bottom:5px; border-radius:25px;padding:10px;font-weight:bold;
        background:red;color:white; box-shadow: 0 0 0 1px rgba(0,0,0,0.6), 0 0 0 2px rgba(0,0,0,0.3), 3px 3px 3px #444; font-family: Prototype;
        font-weight: normal;text-shadow: 0 0 1px black;"> RECYCLON</div>
                </div>
                <div class="resource money" style="margin-left:60px;margin-right:25px;">38</div>
                <div class="production-box" style="margin-left:20px;"><div class="production steel"></div></div>
        <div class="description" style="margin-top:0px;text-align:center;">(You start with 38 MC and 1 steel production.)</div>
      </div>
`],
["Tactical Genomics",`
      <div class="tag tag1 tag-microbe"></div>
      <div class="corporationLabel">CORPORATION</div>
      <div class="promo-icon corporation-icon"></div>
      <div class="contentCorporation">
        <div class="corporationEffectBox">
          <div class="corporationEffectBoxLabel" style="margin-bottom:2px">EFFECT</div>
          <div class="resource-tag tag-microbe red-outline"></div> : <div class="resource money red-outline">2</div> * OR <div class="resource microbe red-outline"></div> *<br>
          <div class="resource-tag tag-microbe red-outline" style="margin-top:-4px;"></div> : <div class="resource money" style="margin-right:91px;margin-left:5px;margin-top:-4px;">2</div> <br>
          <div class="description" style="margin-top:-3px;text-align:center;">(Effect: when a microbe tag is played, incl. this, THAT PLAYER gains 2 MC, or adds a microbe to THAT card, and you gain 2 MC.)
        </div>
        </div>
        <div class="splice" style="margin-left: 19px;font-size:29px;font-weight:bold; width:109px;background:#eeeeee;box-shadow: 0 0 0 1px rgba(0,0,0,0.2), 3px 3px 3px grey;"><div style="margin-left:2px"> SPLI<span style="color:red">C</span>E</div>
                    <div STYLE="height:3px;background:red;margin-top:-3px;"></div>
                    <div STYLE="font-size:10px">TACTICAL GENOMICS</div>
                </div>
                <div class="resource money" style="margin-left:60px;margin-right:25px;">44</div>
                <div class="resource card" style="margin-left:20px;"><div class="card-icon card-icon-microbe">&#x2042;</div></div>
        <div class="description" style="margin-top:-8px;text-align:center;">(You start with 44 MC. As your first action, reveal cards until you have revealed a microbe tag. Take that card into hand, and discard the rest.)</div>
      </div>
`],
["Lakefront Resorts",`
      <div class="tag tag1 tag-building"></div>
        <div class="corporationLabel ">CORPORATION</div>
        <div class="turmoil-icon corporation-icon"></div>
        <div class="contentCorporation ">
            <div class="corporationEffectBox ">
                <div class="corporationEffectBoxLabel" style="margin-bottom:0px;">EFFECT</div>
                <div class="resource ocean-resource red-outline"></div>*: <div class="production-box"><div class="production money">1</div></div>&nbsp;&nbsp;
                  <div class="resource" style="height:29px;width:32px;background:#eee"></div>
                  <div class="resource ocean-resource" style="position:absolute;margin-left:-39px;margin-top:36px;"></div>
                  :<div class="resource money">3</div>
                <div class="description " style="text-align:center;margin-top:0px; ">
                    (Effect: When any ocean tile is placed, increase your MC production 1 step. Your bonus for placing adjacent to oceans in 3MC instead of 2MC.)
                </div>
            </div>
            <div style="font-size:30px;font-style: italic;margin-top:10px;margin-left:30px;font-family:Times;color:#222;">
              Lakefront <br> &nbsp;&nbsp;Resorts
              </div>
            <div class="resource money " style="margin-left:75px;">52</div>
            <div class="description " style="text-align:center;margin-left:15px;">
                (You start with 52 MC.)
            </div>
        </div>
`],
["Terralabs",`
      <div class="tag tag1 tag-earth"></div>
      <div class="tag tag2 tag-science"></div>
        <div class="corporationLabel ">CORPORATION</div>
        <div class="turmoil-icon corporation-icon"></div>
        <div class="contentCorporation ">
            <div class="corporationEffectBox ">
                <div class="corporationEffectBoxLabel">EFFECT</div>
                  <div class="resource card"></div> : <div class="resource money">1</div>
                <div class="description " style="text-align:center;margin-top:0px; ">
                    (Effect: Buying cards to hand costs 1MC.)
                </div>
            </div>
            <div style="font-size:24px;margin-top:33px;margin-left:5px;margin-bottom:5px; font-family:Prototype;letter-spacing:5px;color:#222;">
              TERRALABS
              </div>
            <div class="resource money " style="margin-left:25px;margin-right:20px;">20</div> -1 <div class="tile rating"></div>
            <div class="description " style="text-align:center;">
                (You start with 20 MC. Lower your TR 1 step.)
            </div>
        </div>
`],
["Allied Banks",`
      <div class="title background-color-prelude">Allied Banks</div>
      <div class="tag tag1 tag-earth"></div>
      <div class="prelude-label">PRELUDE</div>
      <div class="prelude-icon preludeCard-icon"></div>
      <div class="content">
        <div class="production-box">
          <div class="production money">4</div>
        </div><br>
        <div class="resource money">3</div>
        <div class="description">
          (Increase your MC production 4 steps. Gain 3 MC .)
        </div>
      </div>
`],
["Aquifer Turbines",`
      <div class="title background-color-prelude">Aquifer Turbines</div>
      <div class="tag tag1 tag-power"></div>
      <div class="prelude-label">PRELUDE</div>
      <div class="prelude-icon preludeCard-icon"></div>
      <div class="content">
        <div class="tile ocean-tile"></div>
        <div class="production-box production-box-size2">
          <div class="production energy"></div><div class="production energy"></div>
        </div><br>
        - <div class="resource money">3</div>
        <div class="description">
          (Place an Ocean. Increase your energy production 2 steps. Pay 3 MC .)
        </div>
      </div>
`],
["Biofuels",`
      <div class="title background-color-prelude">Biofuels</div>
      <div class="tag tag1 tag-microbe"></div>
      <div class="prelude-label">PRELUDE</div>
      <div class="prelude-icon preludeCard-icon"></div>
      <div class="content">
        <div class="production-box production-box-size2">
          <div class="production energy"></div><div class="production plant"></div>
        </div><br>
        <div class="resource plant"></div><div class="resource plant"></div>
        <div class="description">
          (Increase your energy and plant production 1 step. Gain 2 plants.)
        </div>
      </div>
`],
["Biolab",`
      <div class="title background-color-prelude">Biolab</div>
      <div class="tag tag1 tag-science"></div>
      <div class="prelude-label">PRELUDE</div>
      <div class="prelude-icon preludeCard-icon"></div>
      <div class="content">
        <div class="production-box ">
          <div class="production plant"></div>
        </div><br>
        <div class="resource card"></div><div class="resource card"></div><div class="resource card"></div>
        <div class="description">
          (Increase your plant production 1 step. Draw 3 cards.)
        </div>
      </div>
`],
["Biosphere Support",`
      <div class="title background-color-prelude">Biosphere Support</div>
      <div class="tag tag1 tag-plant"></div>
      <div class="prelude-label">PRELUDE</div>
      <div class="prelude-icon preludeCard-icon"></div>
      <div class="content">
        <div class="production-box production-box-size2a">
          <div class="production-prefix ">&#x2796;&#xFE0E;</div><div class="production money">1</div><br>
          <div class="production-prefix ">&#x2795;&#xFE0E;</div><div class="production plant"></div><div class="production plant"></div>
        </div><br>
        <div class="description">
          (Increase your plant production 2 steps. Decrease your MC production 1 step.)
        </div>
      </div>
`],
["Business Empire",`
      <div class="title background-color-prelude">Business Empire</div>
      <div class="tag tag1 tag-earth"></div>
      <div class="prelude-label">PRELUDE</div>
      <div class="prelude-icon preludeCard-icon"></div>
      <div class="content">
        <div class="production-box">
          <div class="production money">6</div>
        </div><br>
        - <div class="resource money">6</div>
        <div class="description">
          (Increase your MC production 6 steps. Pay 6 MC.)
        </div>
      </div>
`],
["Dome Farming",`
      <div class="title background-color-prelude">Dome Farming</div>
      <div class="prelude-label">PRELUDE</div>
      <div class="tag tag1 tag-plant"></div>
      <div class="tag tag2 tag-building"></div>
      <div class="prelude-icon preludeCard-icon"></div>
      <div class="content">
        <div class="production-box">
          <div class="production money">2</div><div class="production plant"></div>
        </div><br>
        <div class="description">
          (Increase your MC production 2 steps and plant production 1 step.)
        </div>
      </div>
`],
["Donation",`
      <div class="title background-color-prelude">Donation</div>
      <div class="prelude-label">PRELUDE</div>
      <div class="prelude-icon preludeCard-icon"></div>
      <div class="content">
        <div class="resource money">21</div>
        <div class="description">
          (Gain 21 MC.)
        </div>
      </div>
`],
["Early Settlement",`
      <div class="title background-color-prelude">Early Settlement</div>
      <div class="prelude-label">PRELUDE</div>
      <div class="tag tag1 tag-building"></div>
      <div class="tag tag2 tag-city"></div>
      <div class="prelude-icon preludeCard-icon"></div>
      <div class="content">
        <div class="production-box">
          <div class="production plant"></div>
        </div> <div class="tile city-tile"></div>
        <div class="description">
          (Increase your plant production 1 step. Place a city tile.)
        </div>
      </div>
`],
["Ecology Experts",`
      <div class="title background-color-prelude">Ecology Experts</div>
      <div class="prelude-label">PRELUDE</div>
      <div class="tag tag1 tag-microbe"></div>
      <div class="tag tag2 tag-plant"></div>
      <div class="prelude-icon preludeCard-icon"></div>
      <div class="content">
        <div class="production-box">
          <div class="production plant"></div>
        </div><br>
        <div class="requirements" style="margin-left:31px; width:70%;"><div style="color:red;font-size:56px;display:inline-block;">X</div><div style="position:absolute;margin-top:-40px;margin-left:6px;">Project Requirements</div></div>
        <div class="description">
          (Increase your plant production 1 step. Play a card from hand, ignoring global requirements.)
        </div>
      </div>
`],
["Eccentric Sponsor",`
      <div class="title background-color-prelude">Eccentric Sponsor</div>
      <div class="prelude-label">PRELUDE</div>
      <div class="prelude-icon preludeCard-icon"></div>
      <div class="content">
        <div class="resource card"></div> : <div class="resource money">-25</div>
        <div class="description">
          (Play 1 card from hand with a 25 MC reduction.)
        </div>
      </div>
`],
["Experimental Forest",`
      <div class="title background-color-prelude">Experimental Forest</div>
      <div class="prelude-label">PRELUDE</div>
      <div class="tag tag1 tag-plant"></div>
      <div class="prelude-icon preludeCard-icon"></div>
      <div class="content">
        <div class="tile greenery-tile"></div>
        <div class="resource card"><div class="card-icon card-icon-plant">&#x1F331&#xFE0E;</div></div> <div class="resource card"><div class="card-icon card-icon-plant">&#x1F331&#xFE0E;</div></div>
        <div class="description">
          ( Place 1 Greenery Tile. Reveal cards until you reveal two cards with plant tags on them. Take them into your hand and discard the rest.)
        </div>
      </div>
`],
["Galilean Mining",`
      <div class="title background-color-prelude">Galilean Mining</div>
      <div class="prelude-label">PRELUDE</div>
      <div class="tag tag1 tag-jovian"></div>
      <div class="prelude-icon preludeCard-icon"></div>
      <div class="content">
        <div class="production-box production-box-size2">
          <div class="production titanium"></div><div class="production titanium"></div>
        </div><br>
        - <div class="resource money">5</div>
        <div class="description">
          (Increase your titanium production 2 steps. Pay 5 MC.)
        </div>
      </div>
`],
["Great Aquifer",`
      <div class="title background-color-prelude">Great Aquifer</div>
      <div class="prelude-label">PRELUDE</div>
      <div class="prelude-icon preludeCard-icon"></div>
      <div class="content">
        <div class="tile ocean-tile"></div> <div class="tile ocean-tile"></div>
        <div class="description">
          (Place 2 Ocean tiles.)
        </div>
      </div>
`],
["Huge Asteroid",`
      <div class="title background-color-prelude">Huge Asteroid</div>
      <div class="prelude-label">PRELUDE</div>
      <div class="prelude-icon preludeCard-icon"></div>
      <div class="content">
        <div class="tile temperature-tile"></div><div class="tile temperature-tile"></div><div class="tile temperature-tile"></div><br>
        - <div class="resource money">5</div>
        <div class="description">
          (Increase Temperature 3 steps. Pay 5 MC.)
        </div>
      </div>
`],
["Io Research Outpost",`
      <div class="title background-color-prelude">IO Research Outpost</div>
      <div class="prelude-label">PRELUDE</div>
      <div class="tag tag1 tag-jovian"></div>
      <div class="tag tag2 tag-science"></div>
      <div class="prelude-icon preludeCard-icon"></div>
      <div class="content">
        <div class="production-box"><div class="production titanium"></div></div></br>
        <div class="resource card"></div>
        <div class="description">
          (Increase your titanium production 1 step. Draw a card.)
        </div>
      </div>
`],
["Loan",`
      <div class="title background-color-prelude">Loan</div>
      <div class="prelude-label">PRELUDE</div>
      <div class="prelude-icon preludeCard-icon"></div>
      <div class="content">
        <div class="production-box production-box-size1a">
          <div class="production-prefix">&#x2796;&#xFE0E;</div><div class="money production">2</div>
        </div><br>
        <div class="resource money">30</div>
        <div class="description">
          (Gain 30 MC. Decrease your MC production 2 steps.)
        </div>
      </div>
`],
["Martian Industries",`
      <div class="title background-color-prelude">Martian Industries</div>
      <div class="tag tag1 tag-building"></div>
      <div class="prelude-label">PRELUDE</div>
      <div class="prelude-icon preludeCard-icon"></div>
      <div class="content">
        <div class="production-box production-box-size2" style="vertical-align: bottom;">
          <div class="production energy"></div><div class="production steel"></div>
        </div><br>
        <div class="resource money">6</div>
        <div class="description">
          (Increase your energy and steel production 1 step. Gain 6 MC.)
        </div>
      </div>
`],
["Metal-Rich Asteroid",`
      <div class="title background-color-prelude">Metal-Rich Asteroid</div>
      <div class="prelude-label">PRELUDE</div>
      <div class="prelude-icon preludeCard-icon"></div>
      <div class="content">
        <div class="tile temperature-tile"></div>
        <div class="resource titanium"></div><div class="resource titanium"></div><div class="resource titanium"></div><div class="resource titanium"></div><br>
        <div class="resource steel"></div><div class="resource steel"></div><div class="resource steel"></div><div class="resource steel"></div>
        <div class="description">
          (Increase temperature 1 step. Gain 4 titanium and 4 steel.)
        </div>
      </div>
`],
["Metals Company",`
      <div class="title background-color-prelude">Metals Company</div>
      <div class="prelude-label">PRELUDE</div>
      <div class="prelude-icon preludeCard-icon"></div>
      <div class="content">
        <div class="production-box production-box-size3">
          <div class="production money">1</div><div class="production steel"></div><div class="production titanium"></div>
        </div><br>
        <div class="description">
          (Increase your MC, steel and titanium production 1 step.)
        </div>
      </div>
`],
["Mining Operations",`
      <div class="title background-color-prelude">Mining Operations</div>
      <div class="tag tag1 tag-building"></div>
      <div class="prelude-label">PRELUDE</div>
      <div class="prelude-icon preludeCard-icon"></div>
      <div class="content">
        <div class="production-box production-box-size2">
          <div class="production steel"></div><div class="production steel"></div>
        </div><br>
        <div class="resource steel"></div><div class="resource steel"></div><div class="resource steel"></div><div class="resource steel"></div>
        <div class="description">
          (Increase your steel production 2 steps. Gain 4 steel.)
        </div>
      </div>
`],
["Mohole",`
      <div class="title background-color-prelude">Mohole</div>
      <div class="prelude-label">PRELUDE</div>
      <div class="tag tag1 tag-building"></div>
      <div class="prelude-icon preludeCard-icon"></div>
      <div class="content">
        <div class="production-box production-box-size3">
          <div class="production heat"></div><div class="production heat"></div><div class="production heat"></div>
        </div><br>
        <div class="resource heat"></div><div class="resource heat"></div><div class="resource heat"></div>
        <div class="description">
          (Increase your heat production 3 steps. Gain 3 heat.)
        </div>
      </div>
`],
["Mohole Excavation",`
      <div class="title background-color-prelude">Mohole Excavation</div>
      <div class="prelude-label">PRELUDE</div>
      <div class="tag tag1 tag-building"></div>
      <div class="prelude-icon preludeCard-icon"></div>
      <div class="content">
        <div class="production-box production-box-size2">
          <div class="production steel"></div><br>
          <div class="production heat"></div><div class="production heat"></div>
        </div> &nbsp;&nbsp;
        <div class="resource heat"></div><div class="resource heat"></div>
        <div class="description">
          (Increase your steel production 1 step and heat production 2 steps. Gain 2 heat.)
        </div>
      </div>
`],
["Nitrogen Shipment",`
      <div class="title background-color-prelude">Nitrogen Shipment</div>
      <div class="prelude-label">PRELUDE</div>
      <div class="prelude-icon preludeCard-icon"></div>
      <div class="content">
        <div class="production-box ">
          <div class="production plant"></div>
        </div> &nbsp; <div class="tile rating"></div><br>
        <div class="resource money">5</div>
        <div class="description">
          (Increase your plant production 1 step. Increase your TR 1 step. Gain 5 MC.)
        </div>
      </div>
`],
["Orbital Construction Yard",`
      <div class="title background-color-prelude">Orbital Construction Yard</div>
      <div class="tag tag1 tag-space"></div>
      <div class="prelude-label">PRELUDE</div>
      <div class="prelude-icon preludeCard-icon"></div>
      <div class="content">
        <div class="production-box"><div class="production titanium"></div></div></br>
        <div class="resource titanium"></div><div class="resource titanium"></div><div class="resource titanium"></div><div class="resource titanium"></div>
        <div class="description">
          (Increase your titanium production 1 step. Gain 4 titanium.)
        </div>
      </div>
`],
["Polar Industries",`
      <div class="title background-color-prelude">Polar Industries</div>
      <div class="prelude-label">PRELUDE</div>
      <div class="tag tag1 tag-building"></div>
      <div class="prelude-icon preludeCard-icon"></div>
      <div class="content">
        <div class="production-box production-box-size2">
          <div class="production heat"></div><div class="production heat"></div>
        </div> &nbsp; <div class="tile ocean-tile"></div><br>
        <div class="description">
          (Increase your heat production 2 steps. Place an Ocean tile.)
        </div>
      </div>
`],
["Power Generation",`
      <div class="title background-color-prelude">Power Generation</div>
      <div class="prelude-label">PRELUDE</div>
      <div class="tag tag1 tag-power"></div>
      <div class="prelude-icon preludeCard-icon"></div>
      <div class="content">
        <div class="production-box production-box-size3">
          <div class="production energy"></div><div class="production energy"></div><div class="production energy"></div>
        </div>
        <div class="description">
          (Increase your energy production 3 steps.)
        </div>
      </div>
`],
["Research Network",`
      <div class="title background-color-prelude">Research Network</div>
      <div class="prelude-label">PRELUDE</div>
      <div class="tag tag1 tag-wild"></div>
      <div class="prelude-icon preludeCard-icon"></div>
      <div class="content">
        <div class="production-box ">
          <div class="production money">1</div>
        </div><br>
        <div class="resource card"></div><div class="resource card"></div><div class="resource card"></div>
        <div class="description">
          (Increase your money production 1 step. Draw 3 cards.)
        </div>
      </div>
`],
["Self-Sufficient Settlement",`
      <div class="title background-color-prelude">Self-Sufficient Settlement</div>
      <div class="prelude-label">PRELUDE</div>
      <div class="tag tag1 tag-building"></div>
      <div class="tag tag2 tag-city"></div>
      <div class="prelude-icon preludeCard-icon"></div>
      <div class="content">
        <div class="production-box ">
          <div class="production money">2</div>
        </div><br>
        <div class="tile city-tile"></div>
        <div class="description">
          (Increase your money production 2 step. Place a City tile.)
        </div>
      </div>
`],
["Smelting Plant",`
      <div class="title background-color-prelude">Smelting Plant</div>
      <div class="tag tag1 tag-building"></div>
      <div class="prelude-label">PRELUDE</div>
      <div class="prelude-icon preludeCard-icon"></div>
      <div class="content">
        <div class="tile oxygen-tile"></div><div class="tile oxygen-tile"></div><br>
        <div class="resource steel"></div><div class="resource steel"></div><div class="resource steel"></div><div class="resource steel"></div><div class="resource steel"></div>
        <div class="description">
          (Raise oxygen 2 steps. Gain 5 steel.)
        </div>
      </div>
`],
["Society Support",`
      <div class="title background-color-prelude">Society Support</div>
      <div class="prelude-label">PRELUDE</div>
      <div class="prelude-icon preludeCard-icon"></div>
      <div class="content">
        <div class="production-box production-box-size2">
          <div class="production money">-1</div><div class="production plant"></div><br>
          <div class="production energy"></div><div class="production heat"></div>
        </div>
        <div class="description">
          (Increase your plant, energy and heat production 1 step. Decrease money production 1 step.)
        </div>
      </div>
`],
["Supplier",`
      <div class="title background-color-prelude">Supplier</div>
      <div class="tag tag1 tag-power"></div>
      <div class="prelude-label">PRELUDE</div>
      <div class="prelude-icon preludeCard-icon"></div>
      <div class="content">
        <div class="production-box production-box-size2">
          <div class="production energy"></div><div class="production energy"></div>
        </div><br>
        <div class="resource steel"></div><div class="resource steel"></div><div class="resource steel"></div><div class="resource steel"></div>
        <div class="description">
          (Increase your energy production 2 steps. Gain 4 steel.)
        </div>
      </div>
`],
["Supply Drop",`
      <div class="title background-color-prelude">Supply Drop</div>
      <div class="prelude-label">PRELUDE</div>
      <div class="prelude-icon preludeCard-icon"></div>
      <div class="content">
        3<div class="resource titanium"></div> 8<div class="resource steel"></div> 3<div class="resource plant"></div>
        <div class="description">
          (Gain 3 titanium, 8 steel and 3 plants.)
        </div>
      </div>
`],
["UNMI Contractor",`
      <div class="title background-color-prelude">UNMI Contractor</div>
      <div class="tag tag1 tag-earth"></div>
      <div class="prelude-label">PRELUDE</div>
      <div class="prelude-icon preludeCard-icon"></div>
      <div class="content">
        <div class="tile rating"></div><div class="tile rating"></div><div class="tile rating"></div> <div class="resource card"></div>
        <div class="description">
          (Increase your TR 3 steps. Draw a card.)
        </div>
      </div>
`],
["Acquired Space Agency",`
      <div class="title background-color-prelude">Acquired Space Agency</div>
      <div class="prelude-label">PRELUDE</div>
      <div class="prelude-icon preludeCard-icon"></div>
      <div class="content">
        <div class="resource titanium"></div><div class="resource titanium"></div><div class="resource titanium"></div><div class="resource titanium"></div><div class="resource titanium"></div><div class="resource titanium"></div>
        <div class="resource card"><div class="card-icon card-icon-space">&#x2734;</div></div> <div class="resource card"><div class="card-icon card-icon-space">&#x2734;</div></div>
        <div class="description">
          (Gain 6 titanium. Reveal cards until you reveal two cards with Space Tags. Take them into your hand, discard the rest.)
        </div>
      </div>
    </div>
`]
]);
