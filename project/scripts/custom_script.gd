extends Control
class_name CustomScript

@onready var options = $OptionButton
@onready var url_input = $URLInput
@onready var url_button = $URLSubmit
@onready var json_input = $JSONInput
@onready var json_button = $JSONSubmit
@onready var clipboard_button = $ClipboardButton
@export var grimoire: Control

func new_custom_script_input(index: int) -> void:
	match index:
		0: #URL
			url_input.visible = true
			url_button.visible = true
			url_button.disabled = false
			json_button.visible = false
			json_input.visible = false
			clipboard_button.visible = false
		1: #JSON
			url_input.visible = false
			url_button.visible = false
			json_input.visible = true
			json_button.visible = true
			json_button.disabled = false
			clipboard_button.visible = false
		2: #CLIPBOARD
			url_input.visible = false
			url_button.visible = false
			url_button.disabled = false
			json_input.visible = false
			json_input.disabled = false
			clipboard_button.visible = true

#! Used from https://docs.godotengine.org/en/stable/classes/class_httprequest.html
func http_request_complete(_result, _response_code, _headers, body):
	var json = JSON.new()
	json.parse(body.get_string_from_utf8())
	grimoire.botc_script = json.get_data()
	url_button.disabled = true

#! Used from https://docs.godotengine.org/en/stable/classes/class_httprequest.html
func url_submit(_text="") -> void:
	var request = HTTPRequest.new()
	add_child(request)
	request.request_completed.connect(self.http_request_complete)
	
	var error = request.request(url_input.text)
	if error != OK:
		push_error("An error occurred in the HTTP request.")

func json_submit(_text="") -> void:
	var json = JSON.new()
	json.parse(json_input.text)
	grimoire.botc_script = json.get_data()
	json_button.disabled = true

func url_changed(_text="") -> void: url_button.disabled = false
func json_changed(_text="") -> void: json_button.disabled = false

func clipboard_submit() -> void:
	#No functionality due to lack of clipboard access in Godot for the Web
	pass
