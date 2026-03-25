from rich import print as rprint
import yaml
from typing import Any, Dict, List, Literal, Tuple
import re

class Player:
    def __init__(self, name: str, character: str, reminders: List[str], alignment: Literal["good", "evil"], waking: str) -> None:
        self.name = name
        self.character = character
        self.reminders = reminders
        self.alignment = alignment
        self.waking = waking
        self.did_wake = False

    def has_reminder(self, reminder_regex: str) -> bool:
        ...

players = [
    Player("A", "fortune_teller", ["washerwoman.townsfolk"], "good", "all"),
    Player("B", "imp", [], "evil", "other"),
    Player("C", "empath", ["fortune_teller.redherring"], "good", "all"),
    Player("D", "spy", ["washerwoman.wrong"], "evil", "all"),
    Player("E", "washerwoman", [], "good", "first")
]

def error(message: str="") -> None:
    print(f"An error occured{f": {message}" if message != "" else ""}")
    quit()

def pick(number: int) -> List[Player]:
    selected_players: List[Player] = []
    for count in range(number):
        display = [f"{index}: {player.name}" for index, player in enumerate(players)]
        user_input = input(f"Pick player {count+1}/{number}:\n{"\n".join(display)}\n>> ")
        selected_players.append(players[int(user_input)])
    
    return selected_players
        

def resolve_ability(parent_character: str, ability: List[str]) -> Any:
    for action in ability:
        print(resolve_action(parent_character, action))

def reminder_to_regex(parent_character: str, reminder_text: str) -> str:
    match reminder_text[0]:
        case "&"|"%": return f"{parent_character}\\.{reminder_text[1:]}"
        case "*" : return f"[a-zA-Z_]+\\.{reminder_text[1:]}"
        case _: error(f"Invalid reminder prefix '{reminder_text[0]}'")

def resolve_action(parent_character: str, action: str) -> Any:
    current_object: Any = None
    is_getting_item = False
    comparing: Tuple[bool, str] = (False, "") #? whether a comparison is occuring and what its operator is
    for token in action.split(" "):
        print(f"Resolving '{token}', current_object: {current_object}")

        if comparing[0]:
            result = False
            match comparing[1]:
                case "==":
                    result = str(current_object[0]) == str(token)
                case "!=":

                    result = str(current_object[0]) != str(token)
                case "<=":
                    result = int(current_object[0]) <= int(token)
                case ">=":
                    result = int(current_object[0]) >= int(token)
                case "<":
                    result = int(current_object[0]) < int(token)
                case ">":
                    result = int(current_object[0]) > int(token)

                case "is":
                    mode: Literal["&", "|"] = "&"
                    for compare_part in re.split(r"(?<=[\|&])|(?=[\|&])", token):
                        #? Ran if it is a reminder denoted as (@*%)name
                        if match := re.match(r"^[\@\*\%][a-zA-Z_]+", compare_part):
                            match mode:
                                case "&":
                                    result = result and current_object.has_reminder(reminder_to_regex(match))
                                case "|":
                                    result = result or current_object.has_reminder(reminder_to_regex(match))

                        elif compare_part in ["townsfolk", "outsider", "minion", "demon"]:
                            match mode:
                                #TODO check char type is townsfolk or outsider etc
                                #TODO check alignment is good or evil in next one
                                case "&":
                                    result = result and current_object.type(reminder_to_regex(match))
                                case "|":
                                    result = result or current_object.type(reminder_to_regex(match))
                        
                        elif compare_part in ["|", "&"]:
                            mode = compare_part
                
                case _:
                    error(f"Unrecognised comparator '{comparing[1]}'")
                                

            current_object = result
            comparing = (False, "")
        else:
            continue

        match token:
            #? If there is a "pick" command, e.g. "pick(2)" for selecting 2 players
            case _ if (match := re.search(r"(?<=pick\()\d+(?=\))", token)) != None:
                current_object = pick(int(match.group()))
            
            #? Used to reduce down a list if not stated
            case _ if token in ["[]", "()"]:
                if token == "[]":
                    current_object = current_object
                else:
                    current_object = current_object[0]
            
            case _ if token == "->":
                is_getting_item = True
            
            case _ if token in ["==", ">=", "<=", ">", "<", "!=", "is"]:
                comparing = (True, token)
            
            case _ if token in ["Wake", "Name", "Character", "Count"] and is_getting_item:
                match token:
                    case "Wake":
                        if type(current_object) != Player:
                            error("Can't get Wake of non-player")
                        current_object = current_object.did_wake
                    case "Name":
                        if type(current_object) != Player:
                            error("Can't get Name of non-player")
                        current_object = current_object.name
                    case "Character":
                        if type(current_object) != Player:
                            error("Can't get Character of non-player")
                        current_object = current_object.character
                    case "Count":
                        if type(current_object) != list:
                            error("Can't get Count of non-list")
                        current_object = len(current_object) #type:ignore
                    case _:
                        error(f"Unrecognised feature '{token}'")
            
            case "players":
                current_object = players
            
            case _:
                error(f"Unrecognised token '{token}'")
    
    return current_object[0]

            

if __name__ == "__main__":
    characters: Dict[str, Dict[str, Any]] = yaml.safe_load(open("trouble_brewing.yaml", "r")) #type:ignore
    # rprint(abilities)
    # rprint(abilities["ravenkeeper"])
    # rprint(abilities["washerwoman"])
    # rprint(abilities["fortune_teller"])
    # rprint(abilities["empath"])

    # resolve_ability(characters["ravenkeeper"]["ability"])
    resolve_ability("washerwoman", characters["washerwoman"]["ability"])
