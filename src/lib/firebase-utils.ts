import {
  collection,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Article, Subscriber, Comment, Schedule } from "./types";

// CREATE Article
export async function createArticle(article: Omit<Article, "id" | "createdAt" | "updatedAt">) {
  const now = new Date();
  const docRef = await addDoc(collection(db, "articles"), {
    ...article,
    createdAt: Timestamp.fromDate(now),
    updatedAt: Timestamp.fromDate(now),
  });
  return docRef.id;
}

// UPDATE Article
export async function updateArticle(id: string, updates: Partial<Article>) {
  const docRef = doc(db, "articles", id);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: Timestamp.fromDate(new Date()),
  });
}

// DELETE Article
export async function deleteArticle(id: string) {
  const docRef = doc(db, "articles", id);
  await deleteDoc(docRef);
}

// READ Articles (with optional category filter)
export async function getArticles(category?: string, limitCount = 10) {
  try {
    let q = query(collection(db, "articles"), orderBy("createdAt", "desc"), limit(limitCount));

    if (category) {
      q = query(
        collection(db, "articles"),
        where("category", "==", category),
        orderBy("createdAt", "desc"),
        limit(limitCount),
      );
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate(),
    })) as Article[];
  } catch (error) {
    console.error("Error loading articles:", error);
    return [];
  }
}

// READ Single Article
export async function getArticle(id: string) {
  const docRef = doc(db, "articles", id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate(),
    } as Article;
  }
  return null;
}

// READ Featured Articles
export async function getFeaturedArticles(limitCount = 3) {
  try {
    const q = query(
      collection(db, "articles"),
      where("featured", "==", true),
      orderBy("createdAt", "desc"),
      limit(limitCount),
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate(),
    })) as Article[];
  } catch (error) {
    console.error("Error loading featured articles:", error);
    return [];
  }
}

// CREATE Subscriber (no read required - respects Firestore rules)
export async function createSubscriber(
  email?: string,
  fcmToken?: string,
  type: 'email' | 'notification' = 'email'
) {
  const now = new Date();

  // Deterministic document ID to avoid reads (rules: allow create for anyone)
  const makeId = (prefix: string, value: string) =>
    `${prefix}_${btoa(unescape(encodeURIComponent(value.toLowerCase())))}`;

  const id = email
    ? makeId('email', email)
    : fcmToken
    ? makeId('token', fcmToken)
    : undefined;

  if (!id) throw new Error('No subscriber data provided');

  const ref = doc(db, 'subscribers', id);

  // If already exists, throw a friendly error so UI can show "Already subscribed"
  const existing = await getDoc(ref);
  if (existing.exists()) {
    throw new Error('Already subscribed');
  }

  await setDoc(
    ref,
    {
      email: email || null,
      fcmToken: fcmToken || null,
      type,
      subscribedAt: Timestamp.fromDate(now),
    }
  );

  return id;
}

// READ Subscribers (admin only)
export async function getSubscribers() {
  try {
    const q = query(collection(db, "subscribers"), orderBy("subscribedAt", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      subscribedAt: doc.data().subscribedAt.toDate(),
    })) as Subscriber[];
  } catch (error) {
    console.error("Error loading subscribers:", error);
    return [];
  }
}

// DELETE Subscriber
export async function deleteSubscriber(id: string) {
  const docRef = doc(db, "subscribers", id);
  await deleteDoc(docRef);
}

// CREATE Comment
export async function createComment(text: string, author: string) {
  const now = new Date();
  const docRef = await addDoc(collection(db, "comments"), {
    text,
    author,
    createdAt: Timestamp.fromDate(now),
  });
  return docRef.id;
}

// READ Comments
export async function getComments(limitCount = 50) {
  try {
    const q = query(collection(db, "comments"), orderBy("createdAt", "desc"), limit(limitCount));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
    })) as Comment[];
  } catch (error) {
    console.error("Error loading comments:", error);
    return [];
  }
}

// DELETE Comment
export async function deleteComment(id: string) {
  const docRef = doc(db, "comments", id);
  await deleteDoc(docRef);
}

// ============ SCHEDULE FUNCTIONS ============

// CREATE Schedule
export async function createSchedule(schedule: Omit<Schedule, "id" | "createdAt" | "updatedAt">) {
  const now = new Date();
  const docRef = await addDoc(collection(db, "schedules"), {
    ...schedule,
    createdAt: Timestamp.fromDate(now),
    updatedAt: Timestamp.fromDate(now),
  });
  return docRef.id;
}

// UPDATE Schedule
export async function updateSchedule(id: string, updates: Partial<Schedule>) {
  const docRef = doc(db, "schedules", id);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: Timestamp.fromDate(new Date()),
  });
}

// DELETE Schedule
export async function deleteSchedule(id: string) {
  const docRef = doc(db, "schedules", id);
  await deleteDoc(docRef);
}

// READ All Schedules (for admin)
export async function getSchedules(limitCount = 50) {
  try {
    const q = query(
      collection(db, "schedules"),
      orderBy("startTime", "asc"),
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate(),
    })) as Schedule[];
  } catch (error) {
    console.error("Error loading schedules:", error);
    return [];
  }
}

// READ Active Schedules (for public display)
export async function getActiveSchedules(limitCount = 20) {
  try {
    const q = query(
      collection(db, "schedules"),
      where("isActive", "==", true),
      orderBy("startTime", "asc"),
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate(),
    })) as Schedule[];
  } catch (error) {
    console.error("Error loading active schedules:", error);
    return [];
  }
}

// READ Single Schedule
export async function getSchedule(id: string) {
  const docRef = doc(db, "schedules", id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate(),
    } as Schedule;
  }
  return null;
}