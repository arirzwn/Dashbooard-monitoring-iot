import { useState, useEffect } from "react";
import { database } from "./firebase";
import { ref, onValue, set } from "firebase/database";
import "./App.css";

function App() {
  const [sensorData, setSensorData] = useState({
    suhuUdara: 0,
    kelembapanUdara: 0,
    kelembapanTanah: 0,
    jarak: 0,
  });

  const [actuatorState, setActuatorState] = useState({
    pompa: false,
    katup: false,
  });

  useEffect(() => {
    // 🔥 REAL-TIME LISTENER untuk data sensor
    // onValue() akan otomatis dipanggil setiap kali data di Firebase berubah
    // Tidak perlu refresh manual atau polling!
    const sensorRef = ref(database, "sensors");
    const unsubscribeSensors = onValue(sensorRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setSensorData({
          suhuUdara: data.suhuUdara || 0,
          kelembapanUdara: data.kelembapanUdara || 0,
          kelembapanTanah: data.kelembapanTanah || 0,
          jarak: data.jarak || 0,
        });
      }
    });

    // 🔥 REAL-TIME LISTENER untuk status aktuator
    // Sama seperti sensor, ini akan update otomatis ketika ada perubahan
    const actuatorRef = ref(database, "actuators");
    const unsubscribeActuators = onValue(actuatorRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setActuatorState({
          pompa: data.pompa || false,
          katup: data.katup || false,
        });
      }
    });

    // Cleanup: unsubscribe ketika component unmount
    // Ini penting untuk menghindari memory leaks
    return () => {
      unsubscribeSensors();
      unsubscribeActuators();
    };
  }, []);

  // Function to toggle actuator state
  // 🎛️ Ketika user toggle switch, data langsung ditulis ke Firebase
  // Device IoT yang listening akan mendapat update real-time!
  const toggleActuator = (actuatorName) => {
    const newState = !actuatorState[actuatorName];
    const actuatorRef = ref(database, `actuators/${actuatorName}`);
    set(actuatorRef, newState);
  };

  return (
    <main className="w-full bg-gray-900 min-h-screen p-0">
      <div className="w-full px-4 py-6">
        <div className="flex flex-wrap justify-between items-center gap-3 mb-8">
          <div className="flex flex-col gap-1">
            <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em]">
              IoT Monitoring Dashboard
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="flex flex-col gap-2 rounded-xl p-6 bg-white/5 dark:bg-white/[.02] border border-white/10 dark:border-white/5">
            <p className="text-gray-300 text-base font-medium leading-normal">
              Suhu Udara
            </p>
            <p className="text-white tracking-light text-3xl font-bold leading-tight">
              {sensorData.suhuUdara}°C
            </p>
          </div>

          <div className="flex flex-col gap-2 rounded-xl p-6 bg-white/5 dark:bg-white/[.02] border border-white/10 dark:border-white/5">
            <p className="text-gray-300 text-base font-medium leading-normal">
              Kelembapan Udara
            </p>
            <p className="text-white tracking-light text-3xl font-bold leading-tight">
              {sensorData.kelembapanUdara}%
            </p>
          </div>

          <div className="flex flex-col gap-2 rounded-xl p-6 bg-white/5 dark:bg-white/[.02] border border-white/10 dark:border-white/5">
            <p className="text-gray-300 text-base font-medium leading-normal">
              Kelembapan Tanah
            </p>
            <p className="text-white tracking-light text-3xl font-bold leading-tight">
              {sensorData.kelembapanTanah}%
            </p>
          </div>

          <div className="flex flex-col gap-2 rounded-xl p-6 bg-white/5 dark:bg-white/[.02] border border-white/10 dark:border-white/5">
            <p className="text-gray-300 text-base font-medium leading-normal">
              Jarak
            </p>
            <p className="text-white tracking-light text-3xl font-bold leading-tight">
              {sensorData.jarak} cm
            </p>
          </div>
        </div>

        <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] mb-4">
          Status Aktuator
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-4 bg-white/5 dark:bg-white/[.02] p-4 rounded-xl border border-white/10 dark:border-white/5 justify-between">
            <div className="flex items-center gap-4">
              <div className="text-white flex items-center justify-center rounded-lg bg-blue-500/20 shrink-0 size-12">
                <span className="material-symbols-outlined text-blue-500 text-3xl">
                  💧
                </span>
              </div>
              <p className="text-white text-base font-medium leading-normal flex-1 truncate">
                Pompa
              </p>
            </div>
            <div className="shrink-0">
              <label
                className={`relative flex h-[31px] w-[51px] cursor-pointer items-center rounded-full border-none p-0.5 ${
                  actuatorState.pompa
                    ? "justify-end bg-blue-500"
                    : "justify-start bg-gray-600 dark:bg-gray-700"
                }`}
              >
                <input
                  checked={actuatorState.pompa}
                  onChange={() => toggleActuator("pompa")}
                  className="invisible absolute"
                  type="checkbox"
                />
                <div
                  className="h-full w-[27px] rounded-full bg-white transition-transform"
                  style={{
                    boxShadow:
                      "rgba(0, 0, 0, 0.15) 0px 3px 8px, rgba(0, 0, 0, 0.06) 0px 3px 1px",
                  }}
                ></div>
              </label>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white/5 dark:bg-white/[.02] p-4 rounded-xl border border-white/10 dark:border-white/5 justify-between">
            <div className="flex items-center gap-4">
              <div className="text-white flex items-center justify-center rounded-lg bg-blue-500/20 shrink-0 size-12">
                <span className="material-symbols-outlined text-blue-500 text-3xl">
                  🔧
                </span>
              </div>
              <p className="text-white text-base font-medium leading-normal flex-1 truncate">
                Katup
              </p>
            </div>
            <div className="shrink-0">
              <label
                className={`relative flex h-[31px] w-[51px] cursor-pointer items-center rounded-full border-none p-0.5 ${
                  actuatorState.katup
                    ? "justify-end bg-blue-500"
                    : "justify-start bg-gray-600 dark:bg-gray-700"
                }`}
              >
                <input
                  checked={actuatorState.katup}
                  onChange={() => toggleActuator("katup")}
                  className="invisible absolute"
                  type="checkbox"
                />
                <div
                  className="h-full w-[27px] rounded-full bg-white transition-transform"
                  style={{
                    boxShadow:
                      "rgba(0, 0, 0, 0.15) 0px 3px 8px, rgba(0, 0, 0, 0.06) 0px 3px 1px",
                  }}
                ></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default App;
