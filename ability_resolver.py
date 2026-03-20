import re
from typing import Any, List, Literal

tokenise_regex = r"(?<!^)(?<![a-zA-Z0-9&*%_])(?=[a-zA-Z0-9&*%_])|(?=\+|\(|\)|\[|\]|\=\=|-\>|\>\=|\<\=)(?<!^)"

class Player:
    def __init__(self, name: str, character: str, reminders: List[str], alignment: Literal["good", "evil"]) -> None:
        self.name = name
        self.character = character
        self.reminders = reminders
        self.alignment = alignment
        self.neighbours: List[Player] = []

players = [
    Player("A", "fortuneteller", ["washerwoman.townsfolk"], "good"),
    Player("B", "imp", [], "evil"),
    Player("C", "empath", ["fortuneteller.redherring"], "good"),
    Player("D", "spy", ["washerwoman.wrong"], "evil"),
    Player("E", "washerwoman", [], "good")
]


def tokenise(action: str) -> List[str]:
    return re.split(tokenise_regex, action)

def resolve_ability(ability: List[str]) -> Any:
    for action in ability:
        resolve_action(action)

def resolve_action(action: str) -> Any:
    level = 0
    index_pairs: List[List[int]] = []
    action_tokens = tokenise(action)
    for index, token in enumerate(action_tokens):
        print(f"{level}: '{token}'")
        
        match token.strip():
            case "(" | "[":
                if level == 0:
                    index_pairs.append([index]) #? stores the starting index of a set of parenthesis
                level += 1

            case ")" | "]":
                level -= 1
                if level == 0:
                    index_pairs[-1].append(index) #? stores the ending index of a set of parenthesis

            case _:
                ...
        
    for index_pair in index_pairs:
        resolve_action("".join(action_tokens[index_pair[0]+1:(index_pair[1])]))
            

if __name__ == "__main__":
    resolve_ability(["([pick(2) == (demon or &red_herring)] -> Count) >= 1"])
    # resolve_ability(["[[self -> Neighbours] == evil] -> Count"])
    # resolve_ability([
    #     "(players == &townsfolk) -> Name",
    #     "(players == &wrong) -> Name",
    #     "(players == &townsfolk) -> Character"
    # ])
