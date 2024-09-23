import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'YOUR_API_KEY', // Nếu không có, có thể bỏ qua trong ứng dụng này
  authDomain: 'YOUR_PROJECT_ID.firebaseapp.com', // Tùy chỉnh dựa trên Project ID
  projectId: 'vonhuthao-4a269',
  storageBucket: 'YOUR_PROJECT_ID.appspot.com', // Tùy chỉnh dựa trên Project ID
  messagingSenderId: '299840529658',
  appId: 'YOUR_APP_ID', // Có thể lấy từ Firebase Console
  measurementId: 'YOUR_MEASUREMENT_ID', // Có thể bỏ qua nếu không sử dụng Google Analytics
};

// Kiểm tra nếu app đã được khởi tạo
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
