import { useState, useRef, useCallback } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const BRANCH_CONFIG: Record<
  string,
  { name: string; loginUrl: string; uploadUrl: string; bgUrl: string }
> = {
  october: {
    name: "October Branch",
    loginUrl:
      "https://script.google.com/macros/s/AKfycbyo3Uev7N8ZCH4xZMVfrTQqbFoyKezzwGrSm40__3Iw3eemjKb3FXlQCXezR2KFzjWVAg/exec",
    uploadUrl:
      "https://script.google.com/macros/s/AKfycbw6hqCxbvrZMW_RNvsCB11Q0MNKb0C_smBbWRrfMVPdBvW6axbBlY3rqsgN6_ZmYxbw/exec",
    bgUrl: "/DKW.png",
  },
  dokki: {
    name: "Dokki Ville",
    loginUrl:
      "https://script.google.com/macros/s/AKfycby2b4bx3Rv8GvokvCWRvO_CGQQpk_p5tb1APsn07VqHnQZLPTzVPElcvXDnEMxtKnGk/exec",
    uploadUrl:
      "https://script.google.com/macros/s/AKfycbw4leNN1qNUYSoLI4Ppss7BZgmcKrjrJWn_DsgR6Zsl6KxXLky0r08EOPmMsAVJzh46pQ/exec",
    bgUrl: "/dokki.png",
  },
};

type RecordingState = "idle" | "recording" | "paused" | "uploading" | "done";

function LoginScreen({
  onLogin,
  selectedBranch,
  onBranchChange,
}: {
  onLogin: (username: string) => void;
  selectedBranch: string;
  onBranchChange: (branch: string) => void;
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = useCallback(async () => {
    if (!username.trim() || !password.trim()) {
      setError("Please enter username and password");
      return;
    }
    setLoading(true);
    setError("");

    const currentLoginUrl = BRANCH_CONFIG[selectedBranch].loginUrl;

    try {
      const res = await fetch(currentLoginUrl, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          username: username.trim().toLowerCase(),
          password: password.trim(),
        }),
      });
      const text = await res.text();
      if (text.toLowerCase().includes("success")) {
        onLogin(username.trim().toLowerCase());
      } else {
        setError("Login failed. Please check your credentials.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [username, password, selectedBranch, onLogin]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleLogin();
  };

  const currentBranchBg = BRANCH_CONFIG[selectedBranch].bgUrl;

  return (
    <div
      className="min-h-screen flex items-center justify-center overflow-x-auto p-4 bg-cover bg-center transition-all duration-500 ease-in-out"
      style={{ backgroundImage: `url(${currentBranchBg})` }}
    >
      <div
        className="glass-panel rounded-[35px] overflow-hidden flex"
        style={{
          width: 1000,
          minWidth: 1000,
          height: 560,
        }}
        data-testid="login-box"
      >
        <div className="flex-1 left-gradient flex flex-col justify-center px-16 py-16 text-white">
          <div className="flag-stripe mb-8 w-24" />
          <h1
            className="font-black mb-5 leading-tight"
            style={{ fontSize: 72, color: "#ffcc00" }}
          >
            Willkommen!
          </h1>
          <p className="text-xl leading-relaxed opacity-95 font-medium">
            <span style={{ color: "#DD0000", fontSize: "1.3em" }}>DKW</span>
            <span style={{ fontSize: "0.90rem", marginLeft: "14px" }}>
              Akademisches Aufzeichnungssystem
            </span>
            <br />
            <br />
            <span className="opacity-80 text-base font-normal">
              Jede Aufnahme verbessert unsere
            </span>
            <span className="ml-2" style={{ color: "#ffcc00" }}>
              Leistung
            </span>
          </p>
          <div className="mt-10 flex items-center gap-3 opacity-60">
            <div className="w-2 h-2 rounded-full bg-white" />
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: "#c40000" }}
            />
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: "#ffcc00" }}
            />
          </div>
        </div>

        <div
          className="flex items-center justify-center"
          style={{
            width: 420,
            background: "rgba(255,255,255,0.07)",
            backdropFilter: "blur(25px)",
          }}
        >
          <div className="w-[85%] text-center">
            <h2 className="font-bold text-white mb-6" style={{ fontSize: 40 }}>
              Anmelden
            </h2>

            <select
              className="glass-input w-full px-5 py-4 rounded-full text-base mb-3 text-white bg-transparent appearance-none cursor-pointer"
              style={{ colorScheme: "dark" }}
              value={selectedBranch}
              onChange={(e) => onBranchChange(e.target.value)}
              disabled={loading}
            >
              {Object.keys(BRANCH_CONFIG).map((key) => (
                <option key={key} value={key} className="text-black">
                  {BRANCH_CONFIG[key].name}
                </option>
              ))}
            </select>

            <input
              data-testid="input-username"
              className="glass-input w-full px-5 py-4 rounded-full text-base mb-3"
              placeholder="Benutzername"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={handleKeyDown}
              autoComplete="username"
            />

            <input
              data-testid="input-password"
              className="glass-input w-full px-5 py-4 rounded-full text-base mb-3"
              type="password"
              placeholder="Passwort"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              autoComplete="current-password"
            />

            <button
              data-testid="button-login"
              className="dkw-btn-primary w-full py-4 rounded-full text-base mt-3"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? "Anmeldung läuft..." : "Anmelden"}
            </button>

            {error && (
              <p
                data-testid="text-login-error"
                className="text-white mt-5 font-semibold text-sm"
                style={{ textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}
              >
                {error}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function RecordingScreen({
  currentUser,
  selectedBranch,
  onLogout,
}: {
  currentUser: string;
  selectedBranch: string;
  onLogout: () => void;
}) {
  const [studentName, setStudentName] = useState("");
  const [phone, setPhone] = useState("");
  const [recordingState, setRecordingState] = useState<RecordingState>("idle");
  const [statusMsg, setStatusMsg] = useState("");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = useCallback(() => {
    timerRef.current = setInterval(() => {
      setElapsedSeconds((s) => s + 1);
    }, 1000);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleStart = useCallback(async () => {
    if (!studentName.trim()) {
      setStatusMsg("Please enter student name first.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      audioChunksRef.current = [];
      setElapsedSeconds(0);

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.start();
      setRecordingState("recording");
      setStatusMsg("Aufnahme läuft...");
      startTimer();
    } catch {
      setStatusMsg("Microphone access denied.");
    }
  }, [studentName, startTimer]);

  const handlePause = useCallback(() => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.pause();
      stopTimer();
      setRecordingState("paused");
      setStatusMsg("Aufnahme pausiert.");
    }
  }, [stopTimer]);

  const handleResume = useCallback(() => {
    if (mediaRecorderRef.current?.state === "paused") {
      mediaRecorderRef.current.resume();
      startTimer();
      setRecordingState("recording");
      setStatusMsg("Aufnahme fortgesetzt...");
    }
  }, [startTimer]);

  const handleStop = useCallback(() => {
    const recorder = mediaRecorderRef.current;
    if (!recorder) return;

    stopTimer();

    recorder.onstop = async () => {
      const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });

      if (blob.size < 1000) {
        setStatusMsg("Recording is empty. Please try again.");
        setRecordingState("idle");
        return;
      }

      setRecordingState("uploading");
      setStatusMsg("Upload zum Server...");

      const currentUploadUrl = BRANCH_CONFIG[selectedBranch].uploadUrl;

      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const base64 = (reader.result as string).split(",")[1];
        try {
          const res = await fetch(currentUploadUrl, {
            method: "POST",
            headers: { "Content-Type": "text/plain;charset=utf-8" },
            body: JSON.stringify({
              audio: base64,
              studentName: studentName.trim(),
              phone: phone.trim(),
              instructor: currentUser,
            }),
          });
          const text = await res.text();
          setStatusMsg(text || "Upload complete!");
          setRecordingState("done");
          setElapsedSeconds(0);
        } catch {
          setStatusMsg("Upload failed. Please try again.");
          setRecordingState("idle");
        }
      };
    };

    recorder.stop();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    mediaRecorderRef.current = null;
  }, [stopTimer, studentName, phone, currentUser, selectedBranch]);

  const handleReset = useCallback(() => {
    setStudentName("");
    setPhone("");
    setStatusMsg("");
    setRecordingState("idle");
    setElapsedSeconds(0);
  }, []);

  const isRecording = recordingState === "recording";
  const isPaused = recordingState === "paused";
  const isUploading = recordingState === "uploading";
  const isDone = recordingState === "done";
  const isActive = isRecording || isPaused;

  const currentBranchBg = BRANCH_CONFIG[selectedBranch].bgUrl;

  return (
    <div
      className="min-h-screen flex items-center justify-center overflow-x-auto p-4 bg-cover bg-center transition-all duration-500 ease-in-out"
      style={{ backgroundImage: `url(${currentBranchBg})` }}
    >
      <div
        className="glass-panel rounded-[35px] overflow-hidden flex"
        style={{
          width: 1000,
          minWidth: 1000,
          height: 560,
        }}
        data-testid="recording-box"
      >
        <div className="flex-1 left-gradient flex flex-col justify-center px-16 py-16 text-white">
          <div className="flag-stripe mb-8 w-24" />
          <h1
            className="font-black mb-5 leading-tight"
            style={{ fontSize: 72, color: "#ffcc00" }}
          >
            Die Aufnahme
          </h1>
          <p className="text-xl leading-relaxed opacity-95 font-medium">
            Sprachaufnahmesystem - {BRANCH_CONFIG[selectedBranch].name}
          </p>
          <p className="text-base opacity-65 mt-3">
            Aufnehmen &bull; Pause &bull; Fortsetzen &bull; Hochladen
          </p>

          <div className="mt-10">
            {isActive && (
              <div className="flex items-center gap-3">
                <div className="pulse-dot" />
                <span
                  className="font-mono font-bold text-2xl"
                  style={{ color: "#ffcc00" }}
                  data-testid="text-timer"
                >
                  {formatTime(elapsedSeconds)}
                </span>
              </div>
            )}
            {isPaused && (
              <div className="flex items-center gap-2 mt-2">
                <span className="text-sm opacity-60">
                  Paused at {formatTime(elapsedSeconds)}
                </span>
              </div>
            )}
          </div>

          <div className="mt-6 flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold uppercase"
              style={{ background: "#ffcc00", color: "#000" }}
            >
              {currentUser[0]}
            </div>
            <span className="text-sm opacity-70">{currentUser}</span>
            <button
              data-testid="button-logout"
              className="ml-3 text-xs opacity-50 hover:opacity-80 transition-opacity underline underline-offset-2"
              onClick={onLogout}
            >
              Abmelden
            </button>
          </div>
        </div>

        <div
          className="flex items-center justify-center"
          style={{
            width: 420,
            background: "rgba(255,255,255,0.07)",
            backdropFilter: "blur(25px)",
          }}
        >
          <div className="w-[85%] text-center">
            <h2 className="font-bold text-white mb-6" style={{ fontSize: 36 }}>
              DKW Academy
            </h2>

            <input
              data-testid="input-student-name"
              className="glass-input w-full px-5 py-4 rounded-full text-base mb-3"
              placeholder="Der Studentenname"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              disabled={isActive || isUploading}
            />

            <input
              data-testid="input-phone"
              className="glass-input w-full px-5 py-4 rounded-full text-base mb-4"
              placeholder="Telefonnummer"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={isActive || isUploading}
            />

            <div className="flex flex-col gap-2.5">
              {!isActive && !isUploading && !isDone && (
                <button
                  data-testid="button-start-recording"
                  className="dkw-btn-primary w-full py-4 rounded-full text-base"
                  onClick={handleStart}
                  disabled={isUploading}
                >
                  Aufnahme starten
                </button>
              )}

              {isRecording && (
                <button
                  data-testid="button-pause-recording"
                  className="dkw-btn-secondary w-full py-4 rounded-full text-base"
                  onClick={handlePause}
                >
                  Aufnahme pausieren
                </button>
              )}

              {isPaused && (
                <button
                  data-testid="button-resume-recording"
                  className="dkw-btn-secondary w-full py-4 rounded-full text-base"
                  onClick={handleResume}
                >
                  Aufnahme fortsetzen
                </button>
              )}

              {isActive && (
                <button
                  data-testid="button-stop-recording"
                  className="dkw-btn-danger w-full py-4 rounded-full text-base"
                  onClick={handleStop}
                >
                  Stoppen &amp; Hochladen
                </button>
              )}

              {isUploading && (
                <div
                  className="flex items-center justify-center gap-3 py-4 rounded-full text-white font-semibold text-base"
                  style={{ background: "rgba(255,255,255,0.1)" }}
                  data-testid="status-uploading"
                >
                  <svg
                    className="animate-spin h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Wird hochgeladen...
                </div>
              )}

              {isDone && (
                <button
                  data-testid="button-new-recording"
                  className="dkw-btn-primary w-full py-4 rounded-full text-base"
                  onClick={handleReset}
                >
                  Neue Aufnahme
                </button>
              )}
            </div>

            {statusMsg && (
              <p
                data-testid="text-status-message"
                className="text-white mt-5 font-semibold text-sm leading-snug"
                style={{ textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}
              >
                {statusMsg}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<string>("october");

  return (
    <QueryClientProvider client={queryClient}>
      {currentUser ? (
        <RecordingScreen
          currentUser={currentUser}
          selectedBranch={selectedBranch}
          onLogout={() => setCurrentUser(null)}
        />
      ) : (
        <LoginScreen
          onLogin={setCurrentUser}
          selectedBranch={selectedBranch}
          onBranchChange={setSelectedBranch}
        />
      )}
    </QueryClientProvider>
  );
}

export default App;
