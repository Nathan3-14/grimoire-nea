extends Node2D

const TYPE_PLAYER: int = 24

var reminder_regex = RegEx.create_from_string(r"^[\@\*\%][a-zA-Z_]+")
#var compare_split_regex = RegEx.create_from_string(r"(?<=[\|&])|(?=[\|&])")
var compare_split_regex_2 = RegEx.create_from_string(r"([\|&])|(([a-zA-Z0-9@]+)(?=[\|&]))|((?<=[\|&])([a-zA-Z0-9@]+))|(^[a-zA-Z0-9@]+$)")
var pick_regex = RegEx.create_from_string(r"(?<=pick\()\d+(?=\))")
var players: Array[Player]

func new_player(player_name: String, character: String, type: String, alignment: String, reminders: Array[String]=[]) -> Player:
	var new_player_object = Player.new()
	new_player_object.player_name = player_name
	new_player_object.character = character
	new_player_object.type = type
	new_player_object.alignment = alignment
	new_player_object.reminders = reminders
	return new_player_object

func error(message: String):
	push_error(message)

#used from https://docs.godotengine.org/en/stable/classes/class_regex.html
func re_split(pattern: RegEx, input: String):
	var results = []
	for result in pattern.search_all(input):
		results.push_back(result.get_string())
	if results == []: return [input]
	else: return results

func pick(count: int=1) -> Array[Player]:
	#TODO Implement actually picking players
	return [players[-2]]

func compare(parent_character: String, object, comparator: String, value) -> bool:
	var result = false
	match comparator:
		#Basic Comparators
		"==": result = str(object) == str(value)
		"!=": result = str(object) != str(value)
		"<=": result = int(object) <= int(value)
		">=": result = int(object) >= int(value)
		"<": result = int(object) < int(value)
		">": result = int(object) > int(value)
		
		"is":
			var mode = "|" #can only be "|" or "&"
			for compare_part in re_split(compare_split_regex_2, value):
				#? Ran if `compare_part` is a reminder, denoted by "(@*%)name"
				var match_object = reminder_regex.search(compare_part)
				if match_object:
					match mode:
						"&":
							result = result and object.has_reminder(parent_character, match_object.get_string())
						"|":
							result = result or object.has_reminder(parent_character, match_object.get_string())

				#? Ran if if it an alignment
				elif compare_part in ["good", "evil"]:
					match mode:
						"&":
							result = result and object.alignment == compare_part
						"|":
							result = result or object.alignment == compare_part
				
				#? Ran if it is a type of character
				elif compare_part in ["townsfolk", "outsider", "minion", "demon"]:
					match mode:
						"&":
							result = result and object.type == compare_part
						"|":
							result = result or object.type == compare_part
				
				elif compare_part in ["|", "&"]:
					mode = compare_part
			
		_:
			error("Unrecognised comparator " + comparator)
	return result

func get_feature(object: Variant, object_type: Variant, feature: String) -> Variant:
	match feature:
		"Wake":
			if object_type != TYPE_PLAYER: error("Can't get Wake of non-player (" + str(object_type) + ")")
			else: object = object.did_wake
		"Name":
			if object_type != TYPE_PLAYER: error("Can't get Name of non-player (" + str(object_type) + ")")
			else: object = object.player_name
		"Character":
			if object_type != TYPE_PLAYER: error("Can't get Character of non-player (" + str(object_type) + ")")
			else: object = object.character
		"Count":
			if object_type != TYPE_ARRAY: error("Can't get Count of non-array (" + str(object_type) + ")")
			else: object = len(object)
		_:
			error("Unrecognised feature '" + feature + "'")
	return object

func resolve_action(parent_character: String, action: String):
	var current_object = null
	var current_action = ["", ""]
	#? current_action is sed by the program to determine what functions to run
	#? it's formatted as [action, extra information]
	
	for token in action.split(" "):
		var current_object_type = typeof(current_object)
		
		#* perform any actions located in current_action
		#? performing comparisons
		if current_action[0] == "comparing":
			if current_object_type == TYPE_ARRAY:
				#? return only items that fit the comparison
				var temp_current_object = current_object
				current_object = []
				
				for item in temp_current_object:
					if compare(parent_character, item, current_action[1], token):
						current_object.append(item)
			else:
				current_object = compare(parent_character, current_object, current_action[1], token) #boolean value of if it fits the comparison
				
			current_action = ["", ""] #? resets current_action
			continue
		
		#? adding reminders
		if current_action[0] == "adding_reminder":
			if current_object_type != TYPE_PLAYER:
				error("Can only add reminders to players")
			
			current_object.add_reminder(parent_character, token)
			current_action = ["", ""] #resets current_action
			continue
		
		#? getting feature / attribute of current_object
		if current_action[0] == "getting_feature":
			if current_object_type == TYPE_ARRAY:
				if token == "Count": return len(current_object)
				else:
					var new_object = []
					for item in current_object:
						new_object.append(get_feature(
							item,
							typeof(item),
							token
						))
					current_object = new_object
			else:
				current_object = get_feature(current_object, current_object_type, token)
			current_action = ["", ""]
			continue
		
		#* check for other possible actions
		#? "pick" command
		var pick_match = pick_regex.search(token)
		if pick_match != null:
			current_object = pick(int(pick_match.get_string()))
			continue
		
		#? convert current_object
		if token in ["[]", "()"]:
			if token == "[]":
				current_object = current_object
			else:
				current_object = current_object[0] #type:ignore
			continue
		
		#? tokens that use the next one
		if token == "->":
			current_action = ["getting_feature", ""]
			continue
		if token in ["==", ">=", "<=", ">", "<", "!=", "is"]:
			current_action = ["comparing", token]
			continue
		if token == "add":
			current_action = ["adding_reminder", ""]
			continue
		
		#? global variables
		if token == "players":
			current_object = players
			continue
		
		#? abilties that have no effect here
		if token in ["registers", "setup"]:
			return
		
		#? only reached if all else fails
		error("Unrecognised token '" + token + "'")
	
	return current_object

func resolve_ability(parent_character: String, ability: Array[String]) -> void:
	for action in ability:
		print(resolve_action(parent_character, action))  

func _ready():
	players = [
		new_player("A", "imp", "demon", "evil"),
		new_player("B", "washerwoman", "townsfolk", "good"),
		new_player("C", "spy", "minion", "evil"),
		new_player("D", "poisoner", "minion", "evil"),
		new_player("E", "saint", "outsider", "good")
	]
