from types import NoneType
from rich import print as rprint
import yaml
from typing import Any, List, Literal, Tuple
import re

class Player:
    def __init__(self, name: str, character: str, reminders: List[str], alignment: Literal["good", "evil"], waking: str) -> None:
        self.name = name
        self.character = character
        self.reminders = reminders
        self.alignment = alignment
        self.waking = waking
        self.did_wake = False

players = [
    Player("A", "fortune_teller", ["washerwoman.townsfolk"], "good", "all"),
    Player("B", "imp", [], "evil", "other"),
    Player("C", "empath", ["fortune_teller.redherring"], "good", "all"),
    Player("D", "spy", ["washerwoman.wrong"], "evil", "all"),
    Player("E", "washerwoman", [], "good", "first")
]
night = 1

def error(message: str="") -> None:
    print(f"An error occured{f": {message}" if message != "" else ""}")
    quit()

def pick(number: int) -> List[Player]:
    for count in range(number):
        display = [f"{index}: {player.name}" for index, player in enumerate(players)]
        user_input = input(f"Pick player {count+1}/{number}:\n{"\n".join(display)}\n>> ")
    
    return []
        

def resolve_ability(ability: List[str]) -> Any:
    for action in ability:
        resolve_action(action)

def resolve_action(action: str) -> Any:
    current_object: Tuple[Any, str] = (None, "None")
    is_getting_item = False
    for token in action.split(" "):
        print(f"Resolving '{token}'")

        match token:
            case _ if (match := re.search(r"(?<=pick\()\d+(?=\))", token)) != None:
                current_object = (pick(int(match.group())), "None")
            case _ if token in ["[]", "()"]:
                if token == "[]":
                    current_object = (current_object[0], "list")
                else:
                    current_object = (current_object[0][0], "item")
            case _ if token == "->":
                is_getting_item = True
            case _ if token in ["Wake", "Name", "Character", "Count"] and is_getting_item:
                match token:
                    case "Wake":
                        if current_object[1] != "item" or type(current_object[0]) != Player:
                            error("Can't get Wake of object")
                        current_object = (current_object[0].did_wake, "item")
                    case "Name":
                        if current_object[1] != "item" or type(current_object[0]) != Player:
                            error("Can't get Name of object")
                        current_object = (current_object[0].name, "item")
                    case "Character":
                        if current_object[1] != "item" or type(current_object[0]) != Player:
                            error("Can't get Character of object")
                        current_object = (current_object[0].character, "item")
                    case "Count":
                        if current_object[1] != "list":
                            error("Can't get Count of object")
                        current_object = (len(current_object[0]), "item")

                    case _:
                        ...
            case _:
                ...
    
    return ""

            

if __name__ == "__main__":
    characters = yaml.safe_load(open("trouble_brewing.yaml", "r"))
    # rprint(abilities)
    # rprint(abilities["ravenkeeper"])
    # rprint(abilities["washerwoman"])
    # rprint(abilities["fortune_teller"])
    # rprint(abilities["empath"])

    resolve_ability(characters["ravenkeeper"]["ability"])
