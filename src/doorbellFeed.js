let CAST = [
  { name: "Jyanta-owner", isSonLike: true },
  { name: "Sumita-owner", isSonLike: false },
  { name: "Oli-owner", isSonLike: false },
  { name: "Neighbour", isSonLike: false },
  { name: "Courier—Parcel", isSonLike: false },
  { name: "housekeeper", isSonLike: false },
  { name: "gardener", isSonLike: false },

];

let ringHistory = {};
let listeners = [];
let allRings = [];

export function subscribe(fn) {
  listeners.push(fn);

  return () => {
    listeners = listeners.filter((l) => l !== fn);
  };
}

function emit() {
  listeners.forEach((fn) => fn(getState()));
}

export function getState() {
  return {
    rings: [...allRings],
    totalRingsToday: allRings.length,
  };
}

export function ringDoorbell(personName) {
  const person =
    CAST.find((p) => p.name === personName) ||
    CAST[Math.floor(Math.random() * CAST.length)];

  const priorCount = ringHistory[person.name] || 0;
  const flagged = priorCount >= 1;

  ringHistory[person.name] = priorCount + 1;

  const event = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: person.name,
    timestamp: new Date(),
    flagged,
  };

  allRings = [...allRings, event];
  emit();

  return event;
}

export function unflaggedVisitor(personName) {
  if (!personName?.trim()) return;

  const event = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: personName.trim(),
    timestamp: new Date(),
    flagged: false,
  };

  allRings = [...allRings, event];
  emit();

  return event;
}

export function getCast() {
  return CAST.map((p) => p.name);
}

export function addPersonToCast(personName) {
  if (!personName.trim()) return false;

  if (CAST.find((p) => p.name === personName)) {
    return false;
  }

  CAST.push({
    name: personName,
    isSonLike: false,
  });

  return true;
}

export function resetFeed() {
  ringHistory = {};
  allRings = [];
  emit();
}