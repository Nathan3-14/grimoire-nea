extends Node2D
class_name Player

@export var player_name: String
@export var character: String #? can be any character from the script
@export var type: String #? can only be townsfolk, outsider, minion, demon or traveller
@export var alignment: String #? can only be good or evil
@export var reminders: Array[String] #? array of reminder strings formatted as <character_name>.<reminder_name> i.e., imp.dead or washerwoman.townsfolk

func error(message: String):
	print("An error occurred: " + message)
	get_tree().quit()

func reminder_to_regex(parent_character: String, reminder_text: String) -> RegEx:
	match reminder_text[0]:
		"@", "%": return RegEx.create_from_string(parent_character + r"\." + reminder_text.erase(0))
		"*": return RegEx.create_from_string(r"[a-zA-Z_]+\." + reminder_text.erase(0))
		_: error("Invalid reminder prefix '" + reminder_text[0] + "'")
	return RegEx.new()

func has_reminder(parent_character: String, reminder_text: String) -> bool:
	for reminder in self.reminders:
		if reminder_to_regex(parent_character, reminder_text).search(reminder):
			return true
	return false

func add_reminder(parent_character: String, reminder_text: String) -> void:
	match reminder_text[0]:
		"@", "%": reminders.append(parent_character + "." + reminder_text.erase(0))
		_: error("Invalid reminder prefix for adding '" + reminder_text[0] + "'")
