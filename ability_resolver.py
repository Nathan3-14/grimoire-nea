import re
from typing import Any, List, Literal

tokenise_regex = r"(?<!^)(?<![a-zA-Z0-9&*%_])(?=[a-zA-Z0-9&*%_])|(?=\+|\(|\)|\[|\]|\=\=|\>|\<)(?<!^)"

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

def resolve(ability: List[str]) -> Any:
    for action in ability:
        print(tokenise(action))

if __name__ == "__main__":
    resolve(["([pick(2) == (demon or &red_herring)] -> Count) >= 1"])
    resolve(["[[self -> Neighbours] == evil] -> Count"])
    resolve([
        "(players == &townsfolk) -> Name",
        "(players == &wrong) -> Name",
        "(players == &townsfolk) -> Character"
    ])
