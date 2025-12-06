/**
 * Contoh struktur data Firebase Realtime Database untuk IoT Monitoring Dashboard
 *
 * Struktur database yang diperlukan:
 *
 * iot-final-project-a354c-default-rtdb/
 * ├── sensors/
 * │   ├── suhuUdara: 28 (number)
 * │   ├── kelembapanUdara: 65 (number)
 * │   ├── kelembapanTanah: 40 (number)
 * │   └── jarak: 15 (number)
 * └── actuators/
 *     ├── pompa: true (boolean)
 *     └── katup: false (boolean)
 *
 * Anda dapat menambahkan data ini secara manual di Firebase Console:
 * 1. Buka Firebase Console (https://console.firebase.google.com/)
 * 2. Pilih project "iot-final-project-a354c"
 * 3. Buka Realtime Database
 * 4. Tambahkan struktur data di atas
 *
 * Atau gunakan fungsi di bawah ini untuk menginisialisasi data:
 */

import { database } from "./firebase";
import { ref, set } from "firebase/database";

// Fungsi untuk menginisialisasi data awal
export const initializeData = async () => {
  try {
    // Set data sensor awal
    await set(ref(database, "sensors"), {
      suhuUdara: 28,
      kelembapanUdara: 65,
      kelembapanTanah: 40,
      jarak: 15,
    });

    // Set data actuator awal
    await set(ref(database, "actuators"), {
      pompa: false,
      katup: false,
    });

    console.log("Data initialized successfully");
  } catch (error) {
    console.error("Error initializing data:", error);
  }
};

// Fungsi untuk mensimulasikan data sensor (untuk testing)
export const simulateSensorData = () => {
  const updateData = () => {
    const sensorData = {
      suhuUdara: Math.round(25 + Math.random() * 10), // 25-35°C
      kelembapanUdara: Math.round(50 + Math.random() * 30), // 50-80%
      kelembapanTanah: Math.round(30 + Math.random() * 40), // 30-70%
      jarak: Math.round(10 + Math.random() * 20), // 10-30 cm
    };

    set(ref(database, "sensors"), sensorData);
  };

  // Update setiap 5 detik untuk simulasi
  setInterval(updateData, 5000);

  // Update pertama kali
  updateData();
};

export default { initializeData, simulateSensorData };
