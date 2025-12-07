import { useState, useEffect } from "react";
import { db } from "./firebase";
import { doc, onSnapshot, collection, query, orderBy, limit } from "firebase/firestore";
import "./App.css";

const DEVICE_ID = "esp32-kelompok2";
const MAIN_COLLECTION = "devices";

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

  const [connectionStatus, setConnectionStatus] = useState("Connecting...");
  const [lastUpdateTime, setLastUpdateTime] = useState(null);

  useEffect(() => {

    // Listen to main device status document for actuator states
    const mainStatusRef = doc(db, MAIN_COLLECTION, DEVICE_ID);

    const unsubscribeMain = onSnapshot(
      mainStatusRef,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();

          // Update last update time
          setLastUpdateTime(new Date());
          setConnectionStatus("🟢 Real-time Active");

          // Update actuator state with all possible field names
          setActuatorState({
            pompa:
              data.status_pump_rill ||
              data.status_pump ||
              data.pompa ||
              data.pump ||
              data.Pompa ||
              false,
            katup:
              data.status_valve_rill ||
              data.status_valve ||
              data.katup ||
              data.valve ||
              data.Katup ||
              false,
          });
        } else {
          setConnectionStatus("Waiting for ESP32 to send data...");
        }
      },
      (error) => {
        setConnectionStatus("Error: " + error.message);
      }
    );

    // Listen to logs collection for sensor data
    const logsQuery = query(
      collection(db, MAIN_COLLECTION, DEVICE_ID, "logs"),
      orderBy("ts", "desc"),
      limit(1)
    );

    const unsubscribeLogs = onSnapshot(
      logsQuery,
      (querySnapshot) => {
        if (!querySnapshot.empty) {
          const latestLog = querySnapshot.docs[0].data();

          const newSensorData = {
            suhuUdara: latestLog.temp || 0,
            kelembapanUdara: latestLog.hum || 0,
            kelembapanTanah: latestLog.soil || 0,
            jarak: latestLog.dist || 0,
          };

          setSensorData(newSensorData);
        }
      },
      (error) => {
        // Error listening to logs
      }
    );

    return () => {
      unsubscribeMain();
      unsubscribeLogs();
    };
  }, []);

  return (
    <main className="w-full min-h-screen p-0">
      <div className="w-full px-4 py-6">
        <div className="flex flex-wrap justify-between items-center gap-3 mb-8">
          <div className="flex flex-col gap-1">
            <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em]">
              IoT Monitoring Dashboard
            </h1>
            <div className="flex items-center gap-3">
              {/* <p className="text-gray-400 text-sm">{connectionStatus}</p> */}
              {lastUpdateTime && (
                <p className="text-gray-500 text-xs">
                  Last update: {lastUpdateTime.toLocaleTimeString()}
                </p>
              )}
            </div>
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
                <span className="text-3xl">💧</span>
              </div>
              <p className="text-white text-base font-medium leading-normal flex-1 truncate">
                Pompa
              </p>
            </div>
            <div className="shrink-0">
              <span
                className={`px-4 py-2 rounded-lg font-semibold text-sm ${
                  actuatorState.pompa
                    ? "bg-green-500 text-white"
                    : "bg-gray-600 text-gray-300"
                }`}
              >
                {actuatorState.pompa ? "ON" : "OFF"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white/5 dark:bg-white/[.02] p-4 rounded-xl border border-white/10 dark:border-white/5 justify-between">
            <div className="flex items-center gap-4">
              <div className="text-white flex items-center justify-center rounded-lg bg-blue-500/20 shrink-0 size-12">
                <span className="text-3xl">🔧</span>
              </div>
              <p className="text-white text-base font-medium leading-normal flex-1 truncate">
                Katup
              </p>
            </div>
            <div className="shrink-0">
              <span
                className={`px-4 py-2 rounded-lg font-semibold text-sm ${
                  actuatorState.katup
                    ? "bg-green-500 text-white"
                    : "bg-gray-600 text-gray-300"
                }`}
              >
                {actuatorState.katup ? "OPEN" : "CLOSE"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default App;
