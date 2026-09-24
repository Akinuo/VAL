// Which meshes in /models/shunfa-sf5550.gltf make up each part in content.json (matched by part slug).
const teeth = [0, 1, 2, 3, 4].flatMap(i => [`feeddog_tooth_0${i}`, `feeddog_tooth_1${i}`])

export const PART_NODES: Record<string, string[]> = {
  'spool-pin': ['spool_pin_top', 'spool_pad'],
  'bobbin-winder': ['bwinder_base', 'bwinder_spindle', 'bwinder_bobbin', 'bwinder_thread', 'bwinder_tire'],
  'take-up-lever': ['takeup_lever', 'takeup_slot'],
  'tension-dial': ['tension_dial', 'tension_dial_cap'],
  'stitch-selector': ['stitch_dial', 'stitch_dial_cap', 'stitch_scale'],
  'needle': ['needle', 'needle_clamp'],
  'presser-foot': ['presser_foot', 'presser_ankle', 'presser_toe_a', 'presser_toe_b'],
  'feed-dogs': [...teeth, 'feeddog_slot_a', 'feeddog_slot_b', 'needle_plate'],
  'handwheel': ['handwheel', 'handwheel_hub', 'handwheel_recess', 'handwheel_mark'],
  'foot-pedal': ['foot_pedal', 'pedal_hinge'],
  'thread-guide': [0, 1, 2, 3].flatMap(i => [`guide_post_${i}`, `guide_disc_${i}`]),
  'needle-bar': ['needle_bar'],
  'presser-foot-lever': ['lifter_lever', 'lifter_pivot', 'lifter_knob'],
  'bobbin-case': ['bobbin_case', 'bobbin_race', 'bobbin_thread', 'bobbin_spool_flange_a', 'bobbin_spool_flange_b'],
}
