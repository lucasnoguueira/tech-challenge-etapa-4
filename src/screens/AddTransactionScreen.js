import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import {
  addTransaction,
  uploadReceipt,
  updateTransaction,
} from "../services/transactionService";

const COLORS = {
  primary: "#2A9D8F",
  secondary: "#E76F51",
  background: "#F4F6F8",
  card: "#FFFFFF",
  textDark: "#264653",
  textLight: "#8D99AE",
  inputBorder: "#E9ECEF",
};

export default function AddTransactionScreen({ navigation, route }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transactionId, setTransactionId] = useState(null);
  const [type, setType] = useState("expense"); // 'income' or 'expense'

  // Hook para carregar dados se for edição
  useEffect(() => {
    if (route.params?.transaction) {
      const {
        id,
        title: t,
        amount: a,
        category: c,
        receiptUrl,
      } = route.params.transaction;
      setTitle(t);
      setAmount(String(Math.abs(a))); // Mostra valor absoluto
      setType(a < 0 ? "expense" : "income");
      setCategory(c);
      setImage(receiptUrl);
      setTransactionId(id);
      navigation.setOptions({ title: "Editar Transação" });
    } else {
      navigation.setOptions({ title: "Nova Transação" });
    }
  }, [route.params]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!title || !amount || !category) {
      Alert.alert("Erro", "Preencha todos os campos obrigatórios");
      return;
    }

    const numericAmount = parseFloat(amount.replace(",", "."));
    if (isNaN(numericAmount)) {
      Alert.alert("Erro", "Valor inválido");
      return;
    }

    const finalAmount =
      type === "expense" ? -Math.abs(numericAmount) : Math.abs(numericAmount);

    setUploading(true);
    try {
      let receiptUrl = image;

      // Se a imagem é local (file://), faz upload. Se for http (já existe), mantém.
      if (image && !image.startsWith("http")) {
        receiptUrl = await uploadReceipt(image);
      }

      const transactionData = {
        title,
        amount: finalAmount,
        category,
        receiptUrl,
      };

      if (transactionId) {
        await updateTransaction(transactionId, transactionData);
        Alert.alert("Sucesso", "Transação atualizada!");
      } else {
        await addTransaction({
          ...transactionData,
          date: new Date(),
        });
        Alert.alert("Sucesso", "Transação salva!");
      }

      navigation.goBack();
    } catch (e) {
      console.error(e);
      Alert.alert("Erro", "Falha ao salvar. Verifique sua conexão e login.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View style={styles.typeContainer}>
          <TouchableOpacity
            style={[
              styles.typeButton,
              type === "income" && {
                backgroundColor: "rgba(42, 157, 143, 0.1)",
                borderColor: COLORS.primary,
              },
            ]}
            onPress={() => setType("income")}
          >
            <Ionicons
              name="arrow-up-circle"
              size={24}
              color={type === "income" ? COLORS.primary : COLORS.textLight}
            />
            <Text
              style={[
                styles.typeText,
                type === "income" && {
                  color: COLORS.primary,
                  fontWeight: "bold",
                },
              ]}
            >
              Receita
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.typeButton,
              type === "expense" && {
                backgroundColor: "rgba(231, 111, 81, 0.1)",
                borderColor: COLORS.secondary,
              },
            ]}
            onPress={() => setType("expense")}
          >
            <Ionicons
              name="arrow-down-circle"
              size={24}
              color={type === "expense" ? COLORS.secondary : COLORS.textLight}
            />
            <Text
              style={[
                styles.typeText,
                type === "expense" && {
                  color: COLORS.secondary,
                  fontWeight: "bold",
                },
              ]}
            >
              Despesa
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Título</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Ex: Supermercado"
            placeholderTextColor={COLORS.textLight}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Valor (R$)</Text>
          <TextInput
            style={[styles.input, { fontSize: 18, fontWeight: "600" }]}
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            placeholder="0,00"
            placeholderTextColor={COLORS.textLight}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Categoria</Text>
          <TextInput
            style={styles.input}
            value={category}
            onChangeText={setCategory}
            placeholder="Ex: Alimentação, Lazer..."
            placeholderTextColor={COLORS.textLight}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Comprovante</Text>
          <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
            <Ionicons name="image-outline" size={24} color={COLORS.textDark} />
            <Text style={styles.imageButtonText}>
              {image ? "Alterar Imagem" : "Selecionar da Galeria"}
            </Text>
          </TouchableOpacity>

          {image && (
            <View style={styles.previewContainer}>
              <Image
                source={{ uri: image }}
                style={styles.previewImage}
                resizeMode="cover"
              />
              <TouchableOpacity
                style={styles.removeImageButton}
                onPress={() => setImage(null)}
              >
                <Ionicons name="close-circle" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.submitButton,
            {
              backgroundColor:
                type === "income" ? COLORS.primary : COLORS.secondary,
            },
          ]}
          onPress={handleSubmit}
          disabled={uploading}
        >
          {uploading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.submitButtonText}>Salvar Transação</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: COLORS.background,
  },
  typeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  typeButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    backgroundColor: COLORS.card,
    marginHorizontal: 6,
  },
  typeText: {
    marginLeft: 8,
    fontSize: 16,
    color: COLORS.textLight,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textDark,
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.textDark,
  },
  imageButton: {
    flexDirection: "row",
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    borderStyle: "dashed",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  imageButtonText: {
    marginLeft: 10,
    color: COLORS.textDark,
    fontWeight: "500",
  },
  previewContainer: {
    marginTop: 12,
    position: "relative",
    alignSelf: "center",
  },
  previewImage: {
    width: 200,
    height: 150,
    borderRadius: 12,
  },
  removeImageButton: {
    position: "absolute",
    top: -10,
    right: -10,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 15,
  },
  submitButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
