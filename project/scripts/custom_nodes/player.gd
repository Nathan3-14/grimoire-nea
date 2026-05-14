extends Node2D
class_name Player

@export var player_name: String
@export var character: String #? can be any character from the script
@export var type: String #? can only be townsfolk, outsider, minion, demon or traveller
@export var alignment: String #? can only be good or evil

func has_reminder(parent_character: String, reminder_text: String) -> bool:
	return true
