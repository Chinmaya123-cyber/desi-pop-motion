import {z} from 'zod';

/**
 * Everything a guest version can change. Edit defaults here, or pass props per guest
 * (see guests.json + tools/render-guests.mjs).
 */
export const inviteSchema = z.object({
  /** Guest's name shown on the personal card ("HEY RAHUL!"). */
  guestName: z.string(),
  /** Guest photo, path inside public/ (e.g. "guests/rahul.jpg"). Empty = fun placeholder. */
  guestPhoto: z.string(),
  /** Birthday host shown in the reveal. */
  host: z.string(),
  /** Party date line. Empty = hidden. */
  date: z.string(),
  /** Arrival time line. */
  time: z.string(),
  /** The joke under the time. */
  timeJoke: z.string(),
  addressLine1: z.string(),
  addressLine2: z.string(),
  /** Host's real photo cutout for the reveal scene (public/ path). */
  hostPhoto: z.string(),
  /** Music slice in public/ (e.g. audio/song_cut.wav). Empty = silent. */
  music: z.string(),
});

export type InviteProps = z.infer<typeof inviteSchema>;

export const defaultInvite: InviteProps = {
  guestName: 'YOU',
  guestPhoto: '',
  host: 'YOUR NAME',
  date: '',
  time: '8 PM ONWARDS',
  timeJoke: 'pehle aa gaye toh bhi chalega',
  addressLine1: 'YOUR BUILDING',
  addressLine2: 'FLAT · TOWER',
  hostPhoto: 'img/host_photo.png',
  music: '',
};
