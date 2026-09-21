import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Pedometer } from "expo-sensors";

export default function App() {
  // =========================
  // BMI
  // =========================
  const [gender, setGender] = useState("");
  const [usia, setUsia] = useState("");
  const [berat, setBerat] = useState("");
  const [tinggi, setTinggi] = useState("");

  const [bmi, setBmi] = useState(null);
  const [kategori, setKategori] = useState("");
  const [rekomendasi, setRekomendasi] = useState("");

  const hitungBMI = () => {
    if (!usia || !berat || !tinggi) {
      Alert.alert("Data belum lengkap", "Isi usia, berat, dan tinggi terlebih dahulu.");
      return;
    }

    const beratNumber = parseFloat(berat);
    const tinggiNumber = parseFloat(tinggi);

    if (
      isNaN(beratNumber) ||
      isNaN(tinggiNumber) ||
      beratNumber <= 0 ||
      tinggiNumber <= 0
    ) {
      Alert.alert("Data salah", "Masukkan angka yang valid.");
      return;
    }

    const tinggiMeter = tinggiNumber / 100;
    const hasilBMI = beratNumber / (tinggiMeter * tinggiMeter);

    let hasilKategori = "";

    if (hasilBMI < 18.5) {
      hasilKategori = "Kurus";
    } else if (hasilBMI < 25) {
      hasilKategori = "Normal";
    } else if (hasilBMI < 30) {
      hasilKategori = "Gemuk";
    } else {
      hasilKategori = "Obesitas";
    }

    const beratMinimum = 18.5 * tinggiMeter * tinggiMeter;
    const beratMaksimum = 24.9 * tinggiMeter * tinggiMeter;

    setBmi(hasilBMI.toFixed(1));
    setKategori(hasilKategori);
    setRekomendasi(
      `${beratMinimum.toFixed(1)} - ${beratMaksimum.toFixed(1)} kg`
    );
  };

  // =========================
  // LANGKAH
  // =========================
  const [langkah, setLangkah] = useState(0);
  const [berjalan, setBerjalan] = useState(false);
  const [subscription, setSubscription] = useState(null);

  const mulaiLangkah = async () => {
    try {
      const tersedia = await Pedometer.isAvailableAsync();

      if (!tersedia) {
        Alert.alert(
          "Tidak tersedia",
          "Sensor langkah tidak tersedia di perangkat ini."
        );
        return;
      }

      setLangkah(0);
      setBerjalan(true);

      const sub = Pedometer.watchStepCount((result) => {
        setLangkah(result.steps);
      });

      setSubscription(sub);
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Tidak dapat mengaktifkan penghitung langkah.");
    }
  };

  const berhentiLangkah = () => {
    if (subscription) {
      subscription.remove();
      setSubscription(null);
    }

    setBerjalan(false);
  };

  const resetLangkah = () => {
    berhentiLangkah();
    setLangkah(0);
  };

  useEffect(() => {
    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [subscription]);

  // =========================
  // TAMPILAN
  // =========================
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerIcon}>💗</Text>
        <Text style={styles.title}>BMI & Step Counter</Text>
        <Text style={styles.subtitle}>
          Pantau kesehatanmu dengan mudah
        </Text>
      </View>

      {/* ================= BMI ================= */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>⚖️ Hitung BMI</Text>

        <Text style={styles.label}>Jenis Kelamin</Text>

        <View style={styles.genderContainer}>
          <TouchableOpacity
            style={[
              styles.genderButton,
              gender === "Laki-laki" && styles.genderActive,
            ]}
            onPress={() => setGender("Laki-laki")}
          >
            <Text style={styles.genderText}>👦 Laki-laki</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.genderButton,
              gender === "Perempuan" && styles.genderActive,
            ]}
            onPress={() => setGender("Perempuan")}
          >
            <Text style={styles.genderText}>👧 Perempuan</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Usia</Text>
        <TextInput
          style={styles.input}
          placeholder="Contoh: 17"
          keyboardType="numeric"
          value={usia}
          onChangeText={setUsia}
        />

        <Text style={styles.label}>Berat Badan (kg)</Text>
        <TextInput
          style={styles.input}
          placeholder="Contoh: 55"
          keyboardType="numeric"
          value={berat}
          onChangeText={setBerat}
        />

        <Text style={styles.label}>Tinggi Badan (cm)</Text>
        <TextInput
          style={styles.input}
          placeholder="Contoh: 165"
          keyboardType="numeric"
          value={tinggi}
          onChangeText={setTinggi}
        />

        <TouchableOpacity style={styles.mainButton} onPress={hitungBMI}>
          <Text style={styles.mainButtonText}>💗 Hitung BMI</Text>
        </TouchableOpacity>

        {bmi !== null && (
          <View style={styles.resultBox}>
            <Text style={styles.resultTitle}>Hasil BMI</Text>

            <Text style={styles.bmiNumber}>{bmi}</Text>

            <Text style={styles.category}>{kategori}</Text>

            <Text style={styles.recommendation}>
              Berat ideal: {rekomendasi}
            </Text>
          </View>
        )}
      </View>

      {/* ================= LANGKAH ================= */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>👟 Penghitung Langkah</Text>

        <View style={styles.stepBox}>
          <Text style={styles.stepIcon}>👣</Text>

          <Text style={styles.stepNumber}>{langkah}</Text>

          <Text style={styles.stepLabel}>Langkah</Text>
        </View>

        <Text style={styles.status}>
          Status: {berjalan ? "🟢 Sedang berjalan" : "⚪ Berhenti"}
        </Text>

        {!berjalan ? (
          <TouchableOpacity
            style={styles.mainButton}
            onPress={mulaiLangkah}
          >
            <Text style={styles.mainButtonText}>
              ▶️ Mulai Menghitung
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.stopButton}
            onPress={berhentiLangkah}
          >
            <Text style={styles.mainButtonText}>
              ⏹️ Berhenti
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.resetButton}
          onPress={resetLangkah}
        >
          <Text style={styles.resetText}>🔄 Reset</Text>
        </TouchableOpacity>

        <Text style={styles.info}>
          💡 Penghitung langkah menggunakan sensor gerak pada perangkat.
        </Text>
      </View>

      <Text style={styles.footer}>
        💕 Jaga kesehatan dan tetap aktif setiap hari!
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF4F8",
  },

  content: {
    padding: 18,
    paddingBottom: 40,
  },

  header: {
    alignItems: "center",
    marginBottom: 20,
  },

  headerIcon: {
    fontSize: 45,
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#D85A8A",
    marginTop: 5,
  },

  subtitle: {
    fontSize: 14,
    color: "#888",
    marginTop: 5,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    marginBottom: 18,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },

  cardTitle: {
    fontSize: 21,
    fontWeight: "bold",
    color: "#D85A8A",
    marginBottom: 18,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
    marginBottom: 7,
    marginTop: 8,
  },

  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#F0B6CC",
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 15,
    backgroundColor: "#FFF9FB",
  },

  genderContainer: {
    flexDirection: "row",
    gap: 10,
  },

  genderButton: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#F0B6CC",
    alignItems: "center",
    backgroundColor: "#FFF9FB",
  },

  genderActive: {
    backgroundColor: "#FFD6E5",
    borderColor: "#D85A8A",
  },

  genderText: {
    color: "#555",
    fontWeight: "600",
  },

  mainButton: {
    backgroundColor: "#E875A3",
    paddingVertical: 15,
    borderRadius: 13,
    alignItems: "center",
    marginTop: 18,
  },

  mainButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },

  stopButton: {
    backgroundColor: "#E57373",
    paddingVertical: 15,
    borderRadius: 13,
    alignItems: "center",
    marginTop: 18,
  },

  resetButton: {
    backgroundColor: "#FCE4EC",
    paddingVertical: 13,
    borderRadius: 13,
    alignItems: "center",
    marginTop: 10,
  },

  resetText: {
    color: "#D85A8A",
    fontWeight: "bold",
  },

  resultBox: {
    backgroundColor: "#FFF0F5",
    borderRadius: 15,
    padding: 18,
    marginTop: 18,
    alignItems: "center",
  },

  resultTitle: {
    fontSize: 16,
    color: "#777",
  },

  bmiNumber: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#D85A8A",
    marginVertical: 5,
  },

  category: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#555",
  },

  recommendation: {
    fontSize: 14,
    color: "#777",
    marginTop: 8,
  },

  stepBox: {
    backgroundColor: "#FFF0F5",
    borderRadius: 20,
    alignItems: "center",
    paddingVertical: 25,
  },

  stepIcon: {
    fontSize: 42,
  },

  stepNumber: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#D85A8A",
    marginTop: 5,
  },

  stepLabel: {
    fontSize: 16,
    color: "#777",
  },

  status: {
    textAlign: "center",
    marginTop: 15,
    color: "#666",
  },

  info: {
    textAlign: "center",
    color: "#999",
    fontSize: 12,
    marginTop: 18,
    lineHeight: 18,
  },

  footer: {
    textAlign: "center",
    color: "#C56A8D",
    fontSize: 13,
    marginTop: 5,
  },
});