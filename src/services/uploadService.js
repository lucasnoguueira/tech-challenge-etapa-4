import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage, auth } from '../config/firebaseConfig';

/**
 * Serviço de upload de comprovantes para o Firebase Storage.
 * Isolado como serviço pois envolve infraestrutura (Storage) e não é lógica de domínio (SRP).
 */
export const uploadReceipt = async (uri) => {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    const filename = `${Date.now()}_receipt.jpg`;
    const storageRef = ref(storage, `receipts/${auth.currentUser.uid}/${filename}`);

    // Timeout de 10s para evitar travamento em caso de falha de rede
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Upload timeout')), 10000),
    );

    await Promise.race([uploadBytes(storageRef, blob), timeoutPromise]);
    return await getDownloadURL(storageRef);
  } catch (error) {
    console.warn('[uploadReceipt] Falha no upload do Storage. Usando placeholder.', error.message);
    return 'https://placehold.co/600x400/png?text=Comprovante+N%C3%A3o+Dispon%C3%ADvel';
  }
};
