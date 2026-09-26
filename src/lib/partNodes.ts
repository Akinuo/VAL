// Which meshes in /models/shunfa-sf5550.glb make up each part in content.json (matched by part slug).
const teeth = [0, 1, 2, 3, 4].flatMap(i => [`feeddog_tooth_0${i}`, `feeddog_tooth_1${i}`])
const handwheelHoles = [0, 1, 2, 3, 4, 5].map(i => `handwheel_hole_${i}`)

export const PART_NODES: Record<string, string[]> = {
  'spool-pin': ['spool_pin_top', 'spool_pad'],
  'bobbin-winder': ['bwinder_base', 'bwinder_spindle', 'bwinder_bobbin', 'bwinder_thread', 'bwinder_tire'],
  'take-up-lever': ['thread_lever_arm', 'thread_lever_axis', 'take_up_slot_cover'],
  'tension-dial': ['tension_dial', 'tension_dial_cap'],
  'stitch-selector': ['stitch_dial', 'stitch_dial_cap', 'stitch_scale'],
  'needle': ['needle', 'needle_clamp'],
  'presser-foot': ['presser_foot', 'presser_ankle', 'presser_toe_a', 'presser_toe_b'],
  'feed-dogs': [...teeth, 'feeddog_slot_a', 'feeddog_slot_b', 'needle_plate'],
  'handwheel': ['handwheel_rim', 'handwheel_face', 'handwheel_hub', 'handwheel_bolt', ...handwheelHoles],
  'foot-pedal': ['foot_pedal_body', 'foot_pedal_tread', 'pedal_hinge'],
  'thread-guide': [0, 1, 2, 3].flatMap(i => [`guide_post_${i}`, `guide_disc_${i}`]),
  'needle-bar': ['needle_bar'],
  'presser-foot-lever': ['lifter_lever', 'lifter_pivot', 'lifter_knob'],
  'bobbin-case': ['bobbin_case', 'bobbin_race', 'bobbin_thread', 'bobbin_spool_flange_a', 'bobbin_spool_flange_b'],
}
