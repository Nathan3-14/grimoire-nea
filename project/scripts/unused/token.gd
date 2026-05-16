extends Sprite2D
class_name Token

var is_mouse_in = false
var is_moving = false
var mouse_offset = Vector2.ZERO
@export var token_holder: Node2D

# Called when the node enters the scene tree for the first time.
func _ready():
	pass # Replace with function body.


# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta):
	if is_mouse_in:
		if Input.is_action_pressed("click"):
			if token_holder.current_moving == null:
				token_holder.current_moving = self
		else:
			token_holder.current_moving = null
	
	is_moving = token_holder.current_moving == self
	if is_moving:
		global_position = get_global_mouse_position() + mouse_offset
	mouse_offset = global_position - get_global_mouse_position()


func _on_area_2d_mouse_entered():
	is_mouse_in = true

func _on_area_2d_mouse_exited():
	is_mouse_in = false
	
