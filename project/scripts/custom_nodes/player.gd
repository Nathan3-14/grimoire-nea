extends Node2D
class_name Player

@export var type: String #Can only be townsfolk, outsider, minion, demon or traveller
@export var alignment: String #Can only be good or evil

func has_reminder(parent_character: String, reminder_text: String) -> bool:
	return true
