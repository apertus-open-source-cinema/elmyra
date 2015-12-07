import bpy

from common import append_from_library


def none(options):
    pass


def explosion(options):
    pass


def layout(options):
    pass


def section(options):
    # Avoid transparency glitches (section is based on transparency)
    # Might be still too little for some meshes
    # (encountered models which needed 42 bounces ...)
    bpy.context.scene.cycles.transparent_max_bounces = 16

    axis = options.modifier_section_axis

    append_from_library("section", "NodeTree", "section")

    # TODO: DO THIS WITH SUPER CARE:
    #       Find out what is the difference between
    #       section_node_group  vs.  section_node_group_node
    #       and check the implications for which one needs
    #       to be used when and what it implies for actually
    #       keeping the section node group working!!!
    #       HINT: Group default value in n panel is not the same
    #             as input on actualy group NODE (this is ignored??)

    section_node_group = bpy.data.node_groups["section"]

    for obj in bpy.data.objects:
        if obj.type == 'MESH':
            pass

    for mat in bpy.data.materials:
        section_node_group_node = mat.node_tree.nodes.new("ShaderNodeGroup")
        section_node_group_node.node_tree = bpy.data.node_groups["section"]

        if options.modifier_section_animated:
            bpy.context.scene.frame_current = 1
            section_node_group.inputs[axis].default_value = options.modifier_section_animate_progress_from
            section_node_group.inputs[axis].keyframe_insert("default_value")

            bpy.context.scene.frame_current = bpy.context.scene.frame_end
            section_node_group.inputs[axis].default_value = options.modifier_section_animate_progress_to
            section_node_group.inputs[axis].keyframe_insert("default_value")

            # for fc in section_node_group.inputs[axis].animation_data.action.fcurves:
            #     fc.extrapolation = 'LINEAR'
            #     for kp in fc.keyframe_points:
            #         kp.interpolation = 'LINEAR'
        else:
            section_node_group.inputs[axis].default_value = options.modifier_section_level

        surface_shader = None
        for node in mat.node_tree.nodes:
            if node.type == 'OUTPUT_MATERIAL':
                output_material_node = node
                for input in node.inputs:
                    for link in input.links:
                        surface_shader = link.from_node

        mat.node_tree.links.new(surface_shader.outputs[0],
                                section_node_group_node.inputs["Shader"])

        mat.node_tree.links.new(section_node_group_node.outputs["Shader"],
                                output_material_node.inputs["Surface"])


def setup(options):
    function = {
        "none": none,
        "explosion": explosion,
        "layout": layout,
        "section": section
    }[options.modifier_type]

    function(options)
