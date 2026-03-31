import yaml
from typing import Any, Dict, List, Literal, Tuple
import re
from rich import print as rprint

characters: Dict[str, Dict[str, Any]] = yaml.safe_load(open("trouble_brewing.yaml", "r")) #type:ignore

class Player:
    def __init__(self, name: str, character: str, reminders: List[str], alignment: Literal["good", "evil"], waking: str) -> None:
        self.name = name
        self.character = character
        self.type = characters[character]["type"]
        self.reminders = reminders
        self.alignment = alignment
        self.waking = waking
        self.did_wake = False

    def reminder_to_regex(self, parent_character: str, reminder_text: str) -> str:
        match reminder_text[0]:
            case "@"|"%": return parent_character + r"\." + reminder_text[1:]
            case "*" : return r"[a-zA-Z_]+\." + reminder_text[1:]
            case _: error(f"Invalid reminder prefix '{reminder_text[0]}'")
        return "something horrendous has happened"

    def has_reminder(self, parent_character: str, reminder_text: str) -> bool:
        for reminder in self.reminders:
            # print(f"Checking if reminder '{reminder}' matches regex '{self.reminder_to_regex(parent_character, reminder_text)}'") #! DEBUG
            if re.match(self.reminder_to_regex(parent_character, reminder_text), reminder):
                return True
        return False

    def add_reminder(self, parent_character: str, reminder_text: str) -> None:
        match reminder_text[0]:
            case "@"|"%": self.reminders.append(f"{parent_character}.{reminder_text[1:]}")
            case _: error(f"Invalid reminder prefix for adding '{reminder_text[0]}'")

players = [
    Player("A", "fortune_teller", ["washerwoman.townsfolk"], "good", "all"),
    Player("B", "imp", [], "evil", "other"),
    Player("C", "empath", ["fortune_teller.red_herring"], "good", "all"),
    Player("D", "spy", ["washerwoman.wrong"], "evil", "all"),
    Player("E", "washerwoman", [], "good", "first"),
    Player("F", "ravenkeeper", ["undertaker.executed"], "good", "other"),
]

#* Non-necessary functions *#
#? Just used for debugging / testing
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
        
def display_grim() -> None:
    for player in players:
        print(f"{player.name} ({player.character}): {', '.join(player.reminders)}")


#* Comparison *#
def compare(parent_character: str, object: Any, comparator: str, value: Any) -> bool:
    result = False
    match comparator:
        case "==":
            result = str(object) == str(value)
        case "!=":
            result = str(object) != str(value)
        case "<=":
            result = int(object) <= int(value)
        case ">=":
            result = int(object) >= int(value)
        case "<":
            result = int(object) < int(value)
        case ">":
            result = int(object) > int(value)

        case "is":
            mode: Literal["&", "|"] = "|"
            for compare_part in re.split(r"(?<=[\|&])|(?=[\|&])", value):
                #? Ran if it is a reminder, denoted by (@*%)name
                if match := re.match(r"^[\@\*\%][a-zA-Z_]+", compare_part):
                    match mode:
                        case "&":
                            result = result and object.has_reminder(parent_character, match.group())
                        case "|":
                            result = result or object.has_reminder(parent_character, match.group())

                #? Ran if if it an alignment
                elif compare_part in ["good", "evil"]:
                    match mode:
                        case "&":
                            result = result and object.alignment == compare_part
                        case "|":
                            result = result or object.alignment == compare_part
                
                #? Ran if it is a type of character
                elif compare_part in ["townsfolk", "outsider", "minion", "demon"]:
                    match mode:
                        case "&":
                            result = result and object.type == compare_part
                        case "|":
                            result = result or object.type == compare_part
                
                elif compare_part in ["|", "&"]:
                    mode = compare_part #type:ignore
        
        case _:
            error(f"Unrecognised comparator '{comparator}'")
    return result


#* Main Resolving Function *#
def resolve_action(parent_character: str, action: str) -> Any:
    current_object: Any = None
    doing_thing: Tuple[str, str] = ("", "")    
    for token in action.split(" "):
        current_object_type = type(current_object)
        # print(f"Resolving '{token}', current_object: {current_object}") #! DEBUG

        if doing_thing[0] == "comparing":
            if type(current_object) == list:
                current_object = [item for item in current_object if compare(parent_character, item, doing_thing[1], token) ]
            else:
                current_object = compare(parent_character, current_object, doing_thing[1], token)
            doing_thing = ("", "")
            continue
        
        if doing_thing[0] == "adding_reminder":
            if current_object_type != Player:
                error("Can only add reminders to players")
            
            current_object.add_reminder(parent_character, token)

            doing_thing = ("", "")
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
                    current_object = current_object[0] #type:ignore
            
            #? All modifiers that use the next token
            case _ if token == "->":
                doing_thing = ("getting_feature", "")
            case _ if token in ["==", ">=", "<=", ">", "<", "!=", "is"]:
                doing_thing = ("comparing", token)
            case "add":
                doing_thing = ("adding_reminder", token)
                
            
            #? Features
            case _ if token in ["Wake", "Name", "Character", "Count"] and doing_thing[0] == "getting_feature":
                match token:
                    case "Wake":
                        if current_object_type != Player:
                            error(f"Can't get Wake of non-player ({current_object_type})")
                        current_object = current_object.did_wake
                    case "Name":
                        if current_object_type != Player:
                            error(f"Can't get Name of non-player ({current_object_type})")
                        current_object = current_object.name
                    case "Character":
                        if current_object_type != Player:
                            error(f"Can't get Character of non-player ({current_object_type})")
                        current_object = current_object.character
                    case "Count":
                        if current_object_type != list:
                            error(f"Can't get Count of non-list ({current_object_type})")
                        current_object = len(current_object) #type:ignore
                    case _:
                        error(f"Unrecognised feature '{token}'")
            
            #? Global Variables
            case _ if token == "players":
                current_object = players
            
            #? Abilties that have no effect here
            case _ if token in ["registers", "setup"]:
                return
            
            case _:
                error(f"Unrecognised token '{token}'")
    
    return current_object


#* Resolve per ability in character *#
def resolve_ability(parent_character: str, ability: List[str]) -> Any:
    for action in ability:
        print(resolve_action(parent_character, action))            

if __name__ == "__main__":
    rprint(characters)
    for character_name, character_data in characters.items():
        print(f"{character_name.upper()}")
        display_grim()
        try:
            resolve_ability(character_name, character_data["ability"])
        except Exception as e:
            print(f"Error: {e}")
        print("\n\n\n")
    display_grim()
