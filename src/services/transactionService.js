import { db, storage, auth } from "../config/firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
  doc,
  updateDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const TRANSACTIONS_COLLECTION = "transactions";

export const updateTransaction = async (id, data) => {
  try {
    const transactionRef = doc(db, TRANSACTIONS_COLLECTION, id);
    await updateDoc(transactionRef, data);
    return true;
  } catch (error) {
    console.error("Erro ao atualizar transação: ", error);
    throw error;
  }
};

export const addTransaction = async ({
  title,
  amount,
  category,
  date,
  receiptUrl,
}) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuário não autenticado");

    const docRef = await addDoc(collection(db, TRANSACTIONS_COLLECTION), {
      userId: user.uid,
      title,
      amount,
      category,
      date: date || serverTimestamp(),
      receiptUrl,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Erro ao adicionar transação: ", error);
    throw error;
  }
};

export const getTransactions = async (lastVisible = null) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuário não autenticado");

    let q = query(
      collection(db, TRANSACTIONS_COLLECTION),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc"),
      limit(10),
    );

    if (lastVisible) {
      q = query(q, startAfter(lastVisible));
    }

    const querySnapshot = await getDocs(q);
    const transactions = [];
    querySnapshot.forEach((doc) => {
      transactions.push({ id: doc.id, ...doc.data() });
    });

    return {
      data: transactions,
      lastVisible: querySnapshot.docs[querySnapshot.docs.length - 1],
    };
  } catch (error) {
    console.error("Erro ao buscar transações: ", error);
    throw error;
  }
};

export const getAllTransactions = async () => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuário não autenticado");

    const q = query(
      collection(db, TRANSACTIONS_COLLECTION),
      where("userId", "==", user.uid),
      orderBy("date", "asc"),
    );

    const querySnapshot = await getDocs(q);
    const transactions = [];
    querySnapshot.forEach((doc) => {
      transactions.push({ id: doc.id, ...doc.data() });
    });

    return transactions;
  } catch (error) {
    console.error("Erro ao buscar todas transações: ", error);
    throw error;
  }
};

export const uploadReceipt = async (uri) => {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();

    // Gera um nome único e seguro para o arquivo
    // Evita usar parte da URI que pode conter dados Base64 gigantes
    const filename = `${Date.now()}_receipt.jpg`;

    const storageRef = ref(
      storage,
      `receipts/${auth.currentUser.uid}/${filename}`,
    );

    // Timeout de 5 segundos para evitar que o app trave se o upload falhar (CORS/Rede)
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Upload timeout")), 5000),
    );

    await Promise.race([uploadBytes(storageRef, blob), timeoutPromise]);

    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.warn(
      "Falha no upload do Storage (Possível restrição de plano ou Timeout). Usando URL de fallback.",
    );
    console.error("Erro original:", error);
    // Retorna uma imagem de placeholder para não impedir o usuário de salvar a transação
    // Isso permite que o app funcione mesmo sem o plano pago do Firebase
    return "https://placehold.co/600x400/png?text=Comprovante+N%C3%A3o+Dispon%C3%ADvel";
  }
};
