/** Rooms visible on the public site (not archived). */
export function selectPublicRooms(state) {
  return state.rooms.items.filter((r) => !r.archived);
}
