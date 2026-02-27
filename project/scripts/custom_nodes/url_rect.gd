extends TextureRect
class_name URLRect

@export var url: String = "https://placehold.co/256.png"
@export var timeout: int = 10

func _ready() -> void:
	#USED FROM https://docs.godotengine.org/en/4.5/classes/class_httprequest.html
	var http_request = HTTPRequest.new()
	add_child(http_request)
	http_request.timeout = timeout
	http_request.request_completed.connect(self._http_request_completed)
	get_node("../AlwaysPresentStuff/Label").text = "Haa"
	
	var error = http_request.request(url)
	if error != OK:
		push_error("An error occurred in the HTTP request.")


func _http_request_completed(result, response_code, headers, body) -> void:
	if result != HTTPRequest.RESULT_SUCCESS:
		push_error("HTTP Request did not return 200 " + result)
	
	var image = Image.new()
	var error = image.load_png_from_buffer(body)
	if error != OK:
		push_error("Error occurred while loading image")
	var texture = ImageTexture.create_from_image(image)
	self.texture = texture
	get_node("../AlwaysPresentStuff/Label").text = "AAAH"
