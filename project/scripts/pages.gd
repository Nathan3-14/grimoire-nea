extends Control
class_name ButtonController

@export var backgrounds: Control

func go_to(page: NodePath, background: NodePath):
	var new_page = get_node(page)
	for child in get_children():
		child.visible = false
	new_page.visible = true
	
	var new_background = get_node(background)
	for child in backgrounds.get_children():
		child.visible = false
	new_background.visible = true

func _ready():
	go_to("Home", "../Background/Menu")
