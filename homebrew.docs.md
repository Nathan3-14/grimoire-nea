# Homebrew Docs
## Layout
```yaml
character_name:
    image_url: "https://placehold.co/256.png"
    type: "townsfolk/outsider/minion/demon"
    reminders:
        - "reminder1"
        - "%reminder2"
    ability_text: "You start knowing..."
    ability:
        - pick(1) add @reminder1
```

## Resolving
Abilities are resolved left to right, brackets do nothing

## Reminders
- @name = reminder with this name from self
- *name = any reminder with this name
- %name = is a global (always available) reminder

## Global Variables:
- players = all players in the game

## Non-Waking Abilities:
- registers alignment, type = character can register as these, e.g. spy regestering as good
- setup = affects setup

## Waking Abilities:
- pick(n) = choose n players
- object -> Feature = return that feature from the object
- player add (@\*%)name = adds the reminder with name (@\*%)name

## Features:
- Wake = is this player alive and do they wake tonight
- Name = the player's name
- Character = the player's character
- (of a list) Count = length of that list

## Comparisons:
- object (==)/(>=)/(<=)/(>)/(<)/(!=) object = is object (equal) / (greater than or equal to) / (less than or equal to) / (greater than) / (less than) / (not equal) to object
- player is ((@\*%)name)/(townsfolk/outsider/minion/demon/dead/alive) = does the player have (@*%)name reminder / is the player (townsfolk/outsider/minion/demon/dead/alive)

## Misc:
- statement [] = create a list of this (not needed)
- statement () = select the first item of this list