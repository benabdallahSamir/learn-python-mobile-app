import { getUserStats, UserStats } from '@/hooks/useStorage';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
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

export default function ProfileScreen() {
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
});
