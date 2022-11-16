import { auth, db } from '../firebase';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const getUserImageUrl = async () => {
  const storage = getStorage();
  return await getDownloadURL(ref(storage, `${auth.currentUser.uid}.jpg`));
};
