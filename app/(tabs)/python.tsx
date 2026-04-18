import { CodeBlock } from '@/components/CodeBlock';
import pythonLessons from '@/data/pythonLessons.json';
import { getCompletedLessons } from '@/hooks/useStorage';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Alert, Dimensions, FlatList, Modal, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

interface Quiz {
  question: string;
  options?: string[];
  correct_answer: string;
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: string;
  content: string;
  quizzes?: Quiz[];
}

export default function PythonScreen() {
  const [completedIds, setCompletedIds] = useState<number[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  const loadProgress = async () => {
    const ids = await getCompletedLessons('python');
    setCompletedIds(ids);
  };

  useFocusEffect(
    useCallback(() => {
      loadProgress();
    }, [])
  );

  const startQuiz = (lesson: Lesson) => {
    if (!lesson.quizzes || lesson.quizzes.length === 0) {
      Alert.alert('No Quiz', 'This lesson has no quiz. It will mark as complete automatically.');
      return;
    }
    
    setSelectedLesson(null);
    router.push({
      pathname: '/quiz',
      params: {
        track: 'python',
        lessonId: lesson.id,
        quizzes: JSON.stringify(lesson.quizzes)
      }
    });
  };

  const getIconForLesson = (title: string) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('intro')) return 'book-outline';
    if (lowerTitle.includes('variable')) return 'text-outline';
    if (lowerTitle.includes('operator')) return 'calculator-outline';
    if (lowerTitle.includes('string')) return 'text-selection';
    if (lowerTitle.includes('input')) return 'enter-outline';
    if (lowerTitle.includes('control') || lowerTitle.includes('if')) return 'git-branch-outline';
    if (lowerTitle.includes('loop')) return 'refresh-outline';
    if (lowerTitle.includes('list')) return 'list-outline';
    if (lowerTitle.includes('dict')) return 'grid-outline';
    if (lowerTitle.includes('func')) return 'function-outline';
    return 'code-slash-outline';
  };

  const globalProgress = pythonLessons.length > 0 
    ? Math.round((completedIds.length / pythonLessons.length) * 100) 
    : 0;

  const renderLessonItem = ({ item, index }: { item: Lesson, index: number }) => {
    const itemId = parseInt(item.id, 10);
    const isCompleted = completedIds.includes(itemId);
    
    let isLocked = false;
    if (index > 0) {
      const prevLessonId = parseInt(pythonLessons[index - 1].id, 10);
      if (!completedIds.includes(prevLessonId)) {
        isLocked = true;
      }
    }

    return (
      <TouchableOpacity 
        style={[styles.lessonCard, isLocked && styles.lessonCardLocked]} 
        onPress={() => isLocked ? Alert.alert('Locked', 'Please complete the previous lesson first.') : setSelectedLesson(item)}
        activeOpacity={isLocked ? 1 : 0.7}
      >
        <View style={[styles.iconContainer, isLocked && styles.iconContainerLocked]}>
          <Ionicons 
            name={isLocked ? 'lock-closed' : getIconForLesson(item.title)} 
            size={28} 
            color={isLocked ? '#AEAEB2' : '#5E5CE6'} 
          />
        </View>
        
        <View style={styles.textContainer}>
          <Text style={[styles.lessonTitle, isLocked && styles.textLocked]}>{item.title}</Text>
          <Text style={[styles.lessonDesc, isLocked && styles.textLocked]} numberOfLines={1}>
            {item.description}
          </Text>
          
          <View style={styles.cardProgressContainer}>
            <View style={styles.cardProgressBarBase}>
              <View style={[styles.cardProgressBarFill, { width: isCompleted ? '100%' : '0%' }]} />
            </View>
            <Text style={styles.cardProgressText}>{isCompleted ? '100%' : '0%'}</Text>
          </View>
        </View>

        {!isLocked && isCompleted && (
          <Ionicons name="checkmark-circle" size={24} color="#34C759" />
        )}
        {isLocked && (
          <Ionicons name="lock-closed" size={20} color="#AEAEB2" />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#5E5CE6', '#7B79E6']} style={styles.header}>
        <SafeAreaView>
          <View style={styles.headerTop}>
            <TouchableOpacity style={styles.backButton}>
              <Ionicons name="chevron-back" size={28} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Python Basics</Text>
            <Text style={styles.headerProgressText}>{globalProgress}%</Text>
          </View>
          <View style={styles.headerProgressBase}>
            <View style={[styles.headerProgressFill, { width: `${globalProgress}%` }]} />
          </View>
        </SafeAreaView>
      </LinearGradient>

      <FlatList
        data={pythonLessons as Lesson[]}
        keyExtractor={(item) => item.id}
        renderItem={renderLessonItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Lesson Reader Modal */}
      <Modal visible={!!selectedLesson} animationType="slide" transparent={false}>
        <View style={styles.modalContainer}>
          <LinearGradient colors={['#5E5CE6', '#7B79E6']} style={styles.modalHeader}>
            <SafeAreaView style={styles.modalHeaderContent}>
              <TouchableOpacity onPress={() => setSelectedLesson(null)} style={styles.closeButton}>
                <Ionicons name="close" size={28} color="#FFFFFF" />
              </TouchableOpacity>
              <Text style={styles.modalHeaderTitle} numberOfLines={1}>{selectedLesson?.title}</Text>
              <View style={{ width: 44 }} />
            </SafeAreaView>
          </LinearGradient>
          
          {selectedLesson && (
            <ScrollView style={styles.modalScroll} contentContainerStyle={styles.modalScrollContent}>
              <Text style={styles.theoryHeading}>Theory</Text>
              
              {/* Split content by code blocks if they exist, or just display text */}
              {selectedLesson.content.split('\n\n').map((block, idx) => {
                const isCode = block.includes('print(') || block.includes('def ') || block.includes(' = ');
                if (isCode) {
                  return <CodeBlock key={idx} code={block} />;
                }
                return <Text key={idx} style={styles.theoryText}>{block}</Text>;
              })}

              <View style={styles.spacer} />
            </ScrollView>
          )}

          {selectedLesson && (
            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.takeQuizButton} 
                onPress={() => startQuiz(selectedLesson)}
              >
                <Text style={styles.takeQuizText}>Take Quiz</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    marginBottom: 20,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
    marginLeft: 10,
  },
  headerProgressText: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '600',
  },
  headerProgressBase: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 24,
    borderRadius: 4,
    overflow: 'hidden',
  },
  headerProgressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
  },
  listContent: {
    padding: 20,
    paddingBottom: 40,
  },
  lessonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  lessonCardLocked: {
    opacity: 0.8,
    backgroundColor: '#F9F9F9',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: '#EBEBF5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  iconContainerLocked: {
    backgroundColor: '#F2F2F7',
  },
  textContainer: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  lessonDesc: {
    fontSize: 14,
    color: '#3C3C43',
    opacity: 0.6,
    marginBottom: 10,
  },
  textLocked: {
    color: '#AEAEB2',
  },
  cardProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardProgressBarBase: {
    flex: 1,
    height: 4,
    backgroundColor: '#F2F2F7',
    borderRadius: 2,
    overflow: 'hidden',
  },
  cardProgressBarFill: {
    height: '100%',
    backgroundColor: '#5E5CE6',
  },
  cardProgressText: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '600',
    width: 35,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  modalHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  closeButton: {
    padding: 8,
  },
  modalHeaderTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
  },
  modalScroll: {
    flex: 1,
  },
  modalScrollContent: {
    padding: 24,
  },
  theoryHeading: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1C1C1E',
    marginBottom: 16,
  },
  theoryText: {
    fontSize: 17,
    color: '#3C3C43',
    lineHeight: 26,
    marginBottom: 20,
  },
  spacer: {
    height: 100,
  },
  modalFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 24,
    paddingBottom: 40,
  },
  takeQuizButton: {
    backgroundColor: '#5E5CE6',
    height: 60,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#5E5CE6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  takeQuizText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});
