"use client";

export default function MovingCircleBg() {
  return (
    <>
      <style jsx>{`
        @keyframes drift-lines {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(-18px, 12px, 0); }
        }
        .civic-bg-lines {
          animation: drift-lines 18s ease-in-out infinite;
        }
      `}</style>
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div
          className="absolute inset-0 opacity-[0.28]"
          style={{
            backgroundImage:
              "linear-gradient(115deg, transparent 0 44%, rgba(45,106,79,0.10) 44% 45%, transparent 45% 100%), linear-gradient(0deg, rgba(212,201,176,0.22) 1px, transparent 1px)",
            backgroundSize: "220px 220px, 100% 56px",
          }}
        />
        <div
          className="civic-bg-lines absolute -inset-10 opacity-[0.16]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, transparent 0 46px, rgba(26,60,46,0.26) 47px, transparent 48px)",
          }}
        />
        <div
          className="absolute right-[-8rem] top-24 h-[32rem] w-[32rem] opacity-[0.06]"
          style={{
            background:
              "conic-gradient(from 90deg, transparent, rgba(26,60,46,0.45), transparent 35%, rgba(26,60,46,0.35), transparent 70%)",
            clipPath: "polygon(0 0, 100% 0, 74% 100%, 0 72%)",
          }}
        />
      </div>
    </>
  );
}
