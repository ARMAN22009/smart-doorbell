import { useEffect, useRef, useState } from "react";
import { useDoorbellScreen } from "./useDoorbellScreen";
import {
  ringDoorbell,
  getCast,
  resetFeed,
  addPersonToCast,
  unflaggedVisitor,
} from "./doorbellFeed";

function formatClock(date) {
  return new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatTodayLabel() {
  return new Date().toLocaleDateString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function OdometerCount({ value, pulse }) {
  const digits = String(value).padStart(3, "0").split("");

  return (
    <div className="flex gap-0.5">
      {digits.map((d, i) => (
        <span
          key={i}
          className={`inline-flex items-center justify-center w-8 h-10 rounded bg-[#2a2620] text-[#d4c5a9] font-mono text-2xl font-light ${pulse ? "scale-105 text-[#e8d5b5] shadow-lg" : ""
            } transition-all duration-200`}
        >
          {d}
        </span>
      ))}
    </div>
  );
}

function VisitorRow({ visitor, isNewest }) {
  return (
    <div
      className={`flex items-center gap-3 px-4 py-3.5 border-b border-[#e8e0d8]/20 last:border-0 ${isNewest ? "bg-[#8b9a8b]/5" : ""
        } hover:bg-[#8b9a8b]/5 transition-colors`}
    >
      <span className="font-mono text-[11px] text-[#8a8580] w-16 shrink-0">
        {formatClock(visitor.timestamp)}
      </span>

      <div className="w-1.5 h-1.5 rounded-full bg-[#8b9a8b] shrink-0" />

      <span className="flex-1 font-serif text-[15px] text-[#3d3a35] tracking-wide">
        {visitor.name}
      </span>

      {isNewest && (
        <span className="text-[10px] font-serif uppercase tracking-[0.2em] text-[#8b9a8b]">
          now
        </span>
      )}
    </div>
  );
}

export default function App() {
  const { totalRingsToday, visibleVisitors, mostRecentRingOverall } =
    useDoorbellScreen();

  const [pulse, setPulse] = useState(false);
  const [flashNote, setFlashNote] = useState(null);
  const [customPerson, setCustomPerson] = useState("");
  const [cast, setCast] = useState(getCast());
  const [isFocused, setIsFocused] = useState(false);

  const prevCount = useRef(totalRingsToday);

  const handleAddPerson = () => {
    if (!customPerson.trim()) return;
    const added = addPersonToCast(customPerson.trim());
    if (added) {
      setCast(getCast());
      setCustomPerson("");
    }
  };

  const handleRingVisitor = () => {
    if (!customPerson.trim()) return;
    unflaggedVisitor(customPerson.trim());
    setCustomPerson("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleRingVisitor();
    }
  };

  useEffect(() => {
    if (totalRingsToday !== prevCount.current) {
      setPulse(true);
      const timer = setTimeout(() => setPulse(false), 300);
      prevCount.current = totalRingsToday;
      return () => clearTimeout(timer);
    }
  }, [totalRingsToday]);

  useEffect(() => {
    if (mostRecentRingOverall?.flagged) {
      setFlashNote(mostRecentRingOverall.name);
      const timer = setTimeout(() => setFlashNote(null), 2400);
      return () => clearTimeout(timer);
    }
  }, [mostRecentRingOverall]);

  const newestVisibleId = visibleVisitors[0]?.id;

  return (
    <div className="min-h-screen bg-[#f0e8e0] flex items-center justify-center p-4 font-serif">
      <div className="w-full max-w-sm">
        {/* Main card - more textured and organic */}
        <div className="bg-[#f8f4ef] rounded-3xl shadow-[0_8px_32px_rgba(60,50,40,0.12)] border border-[#e8e0d8] overflow-hidden">

          {/* Header - warmer, more lived-in feel */}
          <div className="bg-[#e8ddd0] px-5 py-5 border-b border-[#d8cec0]">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-[10px] font-mono tracking-[0.15em] text-[#8a8075] uppercase">
                  {formatTodayLabel()}
                </div>
                <h1 className="text-xl font-serif text-[#3d3a35] mt-0.5 tracking-wide">
                  Front Door
                </h1>
              </div>

              <div className="text-right">
                <div className="text-[9px] font-mono tracking-[0.15em] text-[#8a8075] uppercase mb-1">
                  rings today
                </div>
                <OdometerCount value={totalRingsToday} pulse={pulse} />
              </div>
            </div>
          </div>

          {/* Flash note - more subtle */}
          {flashNote && (
            <div className="px-5 py-2 bg-[#d4c8b8]/20 border-b border-[#d4c8b8]/30">
              <p className="text-[11px] font-serif text-[#8a7a6a] italic">
                “{flashNote}” flagged — kept off the list
              </p>
            </div>
          )}

          {/* Visitor list - with organic spacing */}
          <div className="min-h-[280px] max-h-[320px] overflow-y-auto">
            {visibleVisitors.length === 0 ? (
              <div className="px-5 py-16 text-center">
                <p className="text-[#b0a89a] font-serif text-sm tracking-wide">
                  Quiet at the door
                </p>
                <p className="text-[#c8c0b5] text-xs mt-1">— no one waiting —</p>
              </div>
            ) : (
              visibleVisitors.map((visitor) => (
                <VisitorRow
                  key={visitor.id}
                  visitor={visitor}
                  isNewest={visitor.id === newestVisibleId}
                />
              ))
            )}
          </div>

          {/* Footer note - more conversational */}
          <div className="px-5 py-3 bg-[#f0e8e0] border-t border-[#e0d8d0]">
            <p className="text-[10px] text-[#b0a89a] font-serif tracking-wide">
              <span className="inline-block w-1 h-1 rounded-full bg-[#8b9a8b] mr-2 align-middle"></span>
              Unflagged rings show up here
            </p>
          </div>
        </div>

        {/* Control panel - more tactile */}
        <div className="mt-5 bg-[#f8f4ef] rounded-2xl p-4 border border-[#e8e0d8] shadow-[0_4px_16px_rgba(60,50,40,0.08)]">
          <p className="text-[10px] font-mono tracking-[0.2em] text-[#b0a89a] uppercase mb-3">
            ring the bell
          </p>

          <div className="flex flex-wrap gap-2">
            {cast.map((name) => (
              <button
                key={name}
                onClick={() => ringDoorbell(name)}
                className="px-3.5 py-2 rounded-full bg-[#e8ddd0] hover:bg-[#d4c8b8] text-[#4a4035] text-xs font-serif transition-all hover:scale-105 active:scale-95"
              >
                {name}
              </button>
            ))}

            <button
              onClick={resetFeed}
              className="px-3.5 py-2 rounded-full bg-[#d4c8b8]/40 hover:bg-[#c8bcaa] text-[#8a7a6a] text-xs font-serif transition-all ml-auto hover:text-[#4a4035]"
            >
              reset
            </button>
          </div>

          <div className="flex gap-2 mt-3">
            <input
              type="text"
              placeholder="name..."
              value={customPerson}
              onChange={(e) => setCustomPerson(e.target.value)}
              onKeyDown={handleKeyPress}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className={`flex-1 px-3.5 py-2 rounded-full bg-[#f0e8e0] border-2 ${isFocused ? 'border-[#b0a89a]' : 'border-[#e8e0d8]'
                } text-[#3d3a35] placeholder-[#b0a89a] text-xs font-serif focus:outline-none transition-colors`}
            />

            <button
              onClick={handleAddPerson}
              className="px-3.5 py-2 rounded-full bg-[#8b9a8b]/20 hover:bg-[#8b9a8b]/40 text-[#6a7a6a] text-xs font-serif transition-all"
            >
              flag
            </button>

            <button
              onClick={handleRingVisitor}
              className="px-4 py-2 rounded-full bg-[#3d3a35] hover:bg-[#2a2620] text-[#f0e8e0] text-xs font-serif transition-all hover:scale-105 active:scale-95"
            >
              ring
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}