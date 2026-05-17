extends Control
class_name ButtonController

func go_to(page: NodePath):
	var new_page = get_node(page)
	for child in get_children():
		child.visible = false
	new_page.visible = true

func _ready():
	go_to("Home")
