extends OptionButton

var id_to_language = {
	0: "en",
	1: "pir"
}

var language_to_id = {
	"en": 0,
	"pir": 1 # will never be used
}

# Called when the node enters the scene tree for the first time.
func _ready() -> void:
	selected = language_to_id[TranslationServer.get_locale().split("_")[0]]


# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta: float) -> void:
	pass


func _on_item_selected(index: int) -> void:
	TranslationServer.set_locale(id_to_language[index])
