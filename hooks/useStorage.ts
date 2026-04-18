import AsyncStorage from '@react-native-async-storage/async-storage';

const COMPLETED_INTRO_KEY = 'has_completed_intro';
const SELECTED_TRACK_KEY = 'selected_track';
const USER_STATS_KEY = 'user_stats';

export interface UserStats {
  lessonsCompleted: number;
  quizzesPassed: number;
  streakDays: number;
  totalLessons: number;
  currentLesson: string;
  completedPythonLessons: number[]; // IDs of completed python lessons
  completedDjangoLessons: number[]; // IDs of completed django lessons
}

const DEFAULT_STATS: UserStats = {
  lessonsCompleted: 0,
  quizzesPassed: 0,
  streakDays: 0,
  totalLessons: 50,
  currentLesson: 'Introduction to Python',
  completedPythonLessons: [],
  completedDjangoLessons: [],
};

export const getIntroStatus = async () => {
  try {
    const value = await AsyncStorage.getItem(COMPLETED_INTRO_KEY);
    return value === 'true';
  } catch (e) {
    return false;
  }
};

export const setIntroStatus = async (completed: boolean) => {
  try {
    await AsyncStorage.setItem(COMPLETED_INTRO_KEY, completed ? 'true' : 'false');
  } catch (e) {
    console.error('Error saving intro status', e);
  }
};

export const getSelectedTrack = async () => {
  try {
    return await AsyncStorage.getItem(SELECTED_TRACK_KEY);
  } catch (e) {
    return null;
  }
};

export const setSelectedTrack = async (track: 'python' | 'django') => {
  try {
    await AsyncStorage.setItem(SELECTED_TRACK_KEY, track);
  } catch (e) {
    console.error('Error saving track selection', e);
  }
};

export const getUserStats = async (): Promise<UserStats> => {
  try {
    const value = await AsyncStorage.getItem(USER_STATS_KEY);
    return value ? JSON.parse(value) : DEFAULT_STATS;
  } catch (e) {
    return DEFAULT_STATS;
  }
};

export const saveUserStats = async (stats: UserStats) => {
  try {
    await AsyncStorage.setItem(USER_STATS_KEY, JSON.stringify(stats));
  } catch (e) {
    console.error('Error saving user stats', e);
  }
};

export const completeLesson = async (track: 'python' | 'django', lessonId: number) => {
  const stats = await getUserStats();
  const key = track === 'python' ? 'completedPythonLessons' : 'completedDjangoLessons';
  
  if (!stats[key].includes(lessonId)) {
    stats[key].push(lessonId);
    stats.lessonsCompleted = stats.completedPythonLessons.length + stats.completedDjangoLessons.length;
    await saveUserStats(stats);
  }
};

export const getCompletedLessons = async (track: 'python' | 'django'): Promise<number[]> => {
  const stats = await getUserStats();
  return track === 'python' ? stats.completedPythonLessons : stats.completedDjangoLessons;
};
