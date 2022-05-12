import { range } from "lodash";
import { noteNameOrder } from "./constants";

export function getNotesForRange(octaves: number) {
  return range(24, 24 + 12 * octaves + 1);
}

export function toNote(noteName: string, octave: number) {
  return 12 * (octave + 1) + noteNameOrder.indexOf(noteName);
}

export function getName(note: number) {
  return noteNameOrder[note % 12];
}

export function getOctave(note: number) {
  return Math.floor(note / 12) - 1;
}

export function getFullName(note: number) {
  return getName(note) + getOctave(note);
}
