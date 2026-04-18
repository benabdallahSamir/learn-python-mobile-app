import { getUserStats, UserStats } from '@/hooks/useStorage';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const { width } = Dimensions.get('window');

// Reusable Circular Progress component using SVG
const CircularProgress = ({ size, strokeWidth, progress, color }: { size: number, strokeWidth: number, progress: number, color: string }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
      <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
        {/* Background Circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#F1F5F9"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress Circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="none"
        />
      </Svg>
    </View>
  );
};

export default function HomeScreen() {
  const [stats, setStats] = useState<UserStats | null>(null);

  // Refresh stats whenever the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      async function loadData() {
        const data = await getUserStats();
        setStats(data);
      }
      loadData();
    }, [])
  );

  if (!stats) return null;

  const completionPercentage = Math.round((stats.lessonsCompleted / stats.totalLessons) * 100);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Hello, Student!</Text>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="notifications-outline" size={26} color="#1C1C1E" />
              <View style={styles.notificationBadge} />
            </TouchableOpacity>
            <Image
              source="https://i.pravatar.cc/100?u=student123"
              style={styles.avatar}
              contentFit="cover"
            />
          </View>
        </View>

        {/* Progress Section */}
        <View style={styles.progressContainer}>
          <View style={styles.progressCircleWrapper}>
            <CircularProgress 
              size={width * 0.55} 
              strokeWidth={14} 
              progress={completionPercentage} 
              color="#5E5CE6" 
            />
            <View style={styles.progressContent}>
              <Text style={styles.progressValue}>{completionPercentage}%</Text>
              <Text style={styles.progressLabel}>Completion</Text>
            </View>
          </View>
        </View>

        {/* Continue Learning Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Continue learning</Text>
          <View style={styles.learningCard}>
            <View style={styles.learningHeader}>
              <View style={styles.pythonLogoContainer}>
                <Ionicons name="logo-python" size={32} color="#FFD43B" />
              </View>
              <View style={styles.learningTextContainer}>
                <Text style={styles.currentLessonTitle}>{stats.currentLesson}</Text>
                <Text style={styles.nextLessonText}>Next lesson</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.resumeButton} activeOpacity={0.8}>
              <Text style={styles.resumeButtonText}>Resume</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Stats Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick stats</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.lessonsCompleted}</Text>
              <Text style={styles.statDesc}>lessons{"\n"}completed</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.quizzesPassed}</Text>
              <Text style={styles.statDesc}>quizzes{"\n"}passed</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.streakDays}</Text>
              <Text style={styles.statDesc}>streak{"\n"}days</Text>
            </View>
          </View>
        </View>

        {/* Daily Tip Section */}
        <TouchableOpacity style={styles.dailyTipCard} activeOpacity={0.9}>
          <View style={styles.dailyTipHeader}>
            <Text style={styles.dailyTipTitle}>Daily tip</Text>
            <Ionicons name="chevron-forward" size={20} color="#636366" />
          </View>
          <Text style={styles.dailyTipContent}>
            Consistent practice is key! Try to spend at least 15 minutes today on your Python fundamentals.
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1C1C1E',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconButton: {
    position: 'relative',
    padding: 4,
  },
  notificationBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF3B30',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F2F2F7',
  },
  progressContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  progressCircleWrapper: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContent: {
    position: 'absolute',
    alignItems: 'center',
  },
  progressValue: {
    fontSize: 44,
    fontWeight: '800',
    color: '#1C1C1E',
  },
  progressLabel: {
    fontSize: 16,
    color: '#8E8E93',
    fontWeight: '500',
    marginTop: -4,
  },
  section: {
    marginTop: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 16,
  },
  learningCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F2F2F7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  learningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  pythonLogoContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#1C1C1E',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  learningTextContainer: {
    flex: 1,
  },
  currentLessonTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  nextLessonText: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
  },
  resumeButton: {
    backgroundColor: '#00AFB9',
    height: 54,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resumeButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F2F2F7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  statDesc: {
    fontSize: 13,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 18,
    fontWeight: '500',
  },
  dailyTipCard: {
    marginTop: 32,
    backgroundColor: '#F0FFFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E0FFFF',
  },
  dailyTipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  dailyTipTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#006666',
  },
  dailyTipContent: {
    fontSize: 15,
    color: '#008080',
    lineHeight: 22,
  },
});
