extends Node2D

var reminder_regex = RegEx.create_from_string(r"^[\@\*\%][a-zA-Z_]+")
var compare_split_regex = RegEx.create_from_string(r"(?<=[\|&])|(?=[\|&])")
var compare_split_regex_2 = RegEx.create_from_string(r"([\|&])|(([a-zA-Z0-9@]+)(?=[\|&]))|((?<=[\|&])([a-zA-Z0-9@]+))|(^[a-zA-Z0-9@]+$)")

#used from https://docs.godotengine.org/en/stable/classes/class_regex.html
func re_split(pattern: RegEx, input: String):
	var results = []
	for result in pattern.search_all(input):
		results.push_back(result.get_string())
	if results == []: return [input]
	else: return results

func pick(count: int=1) -> Player:
	#TODO Implement actually picking players
	var test_player = Player.new()
	test_player.alignment = "good"
	test_player.type = "outsider"
	return test_player

#TODO DOCUMENT FULLY
func compare(parent_character: String, object, comparator: String, value) -> bool:
	var result = false
	match comparator:
		"==":
			result = str(object) == str(value)
		"!=":
			result = str(object) != str(value)
		"<=":
			result = int(object) <= int(value)
		">=":
			result = int(object) >= int(value)
		"<":
			result = int(object) < int(value)
		">":
			result = int(object) > int(value)

		"is":
			var mode = "|" #can only be "|" or "&"
			print(re_split(compare_split_regex_2, value))
			for compare_part in re_split(compare_split_regex_2, value):
				print(compare_part)
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
			print("ERR: Unrecognised comparator " + comparator)
	return result

func _ready():
	print(compare("imp", pick(1), "is", "evil&outsider"))
