"use client";

export default function MovingCircleBg() {
  return (
    <>
      <style jsx>{`
        @keyframes float-slow {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(60px, -50px) scale(1.08); }
          66% { transform: translate(-40px, 40px) scale(0.92); }
        }
        @keyframes float-medium {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(-70px, 40px) scale(1.15); }
          50% { transform: translate(40px, -70px) scale(0.85); }
          75% { transform: translate(60px, 60px) scale(1.1); }
        }
        @keyframes float-fast {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(80px, -80px) rotate(90deg); }
          50% { transform: translate(-50px, 50px) rotate(180deg); }
          75% { transform: translate(70px, 70px) rotate(270deg); }
        }
        .animate-float-slow {
          animation: float-slow 18s ease-in-out infinite;
        }
        .animate-float-medium {
          animation: float-medium 12s ease-in-out infinite;
        }
        .animate-float-fast {
          animation: float-fast 8s ease-in-out infinite;
        }
      `}</style>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute rounded-full opacity-[0.07] animate-float-slow"
          style={{
            width: "500px",
            height: "500px",
            background: "#1a3c2e",
            top: "10%",
            left: "60%",
          }}
        />
        <div
          className="absolute rounded-full opacity-[0.05] animate-float-medium"
          style={{
            width: "700px",
            height: "700px",
            background: "#2d6a4f",
            top: "50%",
            left: "-20%",
          }}
        />
        <div
          className="absolute rounded-full opacity-[0.06] animate-float-fast"
          style={{
            width: "400px",
            height: "400px",
            background: "#40916c",
            top: "70%",
            right: "10%",
          }}
        />
        <div
          className="absolute rounded-full opacity-[0.04] animate-float-slow"
          style={{
            width: "600px",
            height: "600px",
            background: "#52b788",
            top: "20%",
            right: "-15%",
          }}
        />
      </div>
    </>
  );
}
