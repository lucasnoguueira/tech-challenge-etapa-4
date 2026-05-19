import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Image,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { addTransactionUseCase, updateTransactionUseCase } from '../contexts/TransactionContext';
import { uploadReceipt } from '../../services/uploadService';
import { CATEGORIES } from '../../core/constants/categories';
import Button from '../components/common/Button';
import COLORS from '../../core/constants/colors';

/**
 * Tela de Adicionar/Editar Transação.
 * Usa Picker para categorias (elimina inconsistências do campo de texto livre).
 * Responsabilidade única: composição de UI e delegação aos use cases (SRP).
 */
export default function AddTransactionScreen({ navigation, route }) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transactionId, setTransactionId] = useState(null);
  const [type, setType] = useState('expense');

  useEffect(() => {
    if (route.params?.transaction) {
      const { id, title: t, amount: a, category: c, receiptUrl } = route.params.transaction;
      setTitle(t);
      setAmount(String(Math.abs(a)));
      setType(a < 0 ? 'expense' : 'income');
      setCategory(CATEGORIES.includes(c) ? c : CATEGORIES[0]);
      setImage(receiptUrl);
      setTransactionId(id);
      navigation.setOptions({ title: 'Editar Transação' });
    } else {
      navigation.setOptions({ title: 'Nova Transação' });
    }
  }, [route.params]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const handleSubmit = async () => {
    setUploading(true);
    try {
      let receiptUrl = image;
      if (image && !image.startsWith('http')) {
        receiptUrl = await uploadReceipt(image);
      }

      const params = { title, amount, category, type, receiptUrl };

      if (transactionId) {
        await updateTransactionUseCase.execute(transactionId, params);
        Alert.alert('Sucesso', 'Transação atualizada!');
      } else {
        await addTransactionUseCase.execute(params);
        Alert.alert('Sucesso', 'Transação salva!');
      }

      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>

        {/* Tipo: Receita ou Despesa */}
        <View style={styles.typeContainer}>
          {['income', 'expense'].map((t) => {
            const isActive = type === t;
            const color = t === 'income' ? COLORS.primary : COLORS.secondary;
            const label = t === 'income' ? 'Receita' : 'Despesa';
            const icon = t === 'income' ? 'arrow-up-circle' : 'arrow-down-circle';
            return (
              <TouchableOpacity
                key={t}
                style={[
                  styles.typeButton,
                  isActive && { backgroundColor: `${color}1A`, borderColor: color },
                ]}
                onPress={() => setType(t)}
              >
                <Ionicons name={icon} size={24} color={isActive ? color : COLORS.textLight} />
                <Text style={[styles.typeText, isActive && { color, fontWeight: 'bold' }]}>
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Título */}
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

        {/* Valor */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Valor (R$)</Text>
          <TextInput
            style={[styles.input, { fontSize: 18, fontWeight: '600' }]}
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            placeholder="0,00"
            placeholderTextColor={COLORS.textLight}
          />
        </View>

        {/* Categoria via Picker */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Categoria</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={category}
              onValueChange={(val) => setCategory(val)}
              style={styles.picker}
              dropdownIconColor={COLORS.textLight}
            >
              {CATEGORIES.map((cat) => (
                <Picker.Item key={cat} label={cat} value={cat} />
              ))}
            </Picker>
          </View>
        </View>

        {/* Comprovante */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Comprovante</Text>
          <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
            <Ionicons name="image-outline" size={24} color={COLORS.textDark} />
            <Text style={styles.imageButtonText}>
              {image ? 'Alterar Imagem' : 'Selecionar da Galeria'}
            </Text>
          </TouchableOpacity>

          {image && (
            <View style={styles.previewContainer}>
              <Image source={{ uri: image }} style={styles.previewImage} resizeMode="cover" />
              <TouchableOpacity style={styles.removeImageButton} onPress={() => setImage(null)}>
                <Ionicons name="close-circle" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        <Button
          title="Salvar Transação"
          onPress={handleSubmit}
          loading={uploading}
          variant={type === 'income' ? 'primary' : 'secondary'}
        />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
  formGroup: { marginBottom: 20 },
  label: {
    fontSize: 14,
    fontWeight: '600',
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
  pickerContainer: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    borderRadius: 12,
    overflow: 'hidden',
  },
  picker: {
    color: COLORS.textDark,
    height: 50,
  },
  imageButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    borderStyle: 'dashed',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageButtonText: {
    marginLeft: 10,
    color: COLORS.textDark,
    fontWeight: '500',
  },
  previewContainer: {
    marginTop: 12,
    position: 'relative',
    alignSelf: 'center',
  },
  previewImage: {
    width: 200,
    height: 150,
    borderRadius: 12,
  },
  removeImageButton: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 15,
  },
});
