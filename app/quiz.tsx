import { completeLesson } from '@/hooks/useStorage';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function QuizScreen() {
  const params = useLocalSearchParams();
  const track = params.track as 'python' | 'django';
  const lessonId = params.lessonId as string;
  const quizzesRaw = params.quizzes as string;
  
  const quizzes = JSON.parse(quizzesRaw || '[]');
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);

  const currentQuiz = quizzes[currentIndex];

  const handleOptionSelect = (option: string) => {
    if (isAnswered) return;
    setSelectedOption(option);
    setIsAnswered(true);

    if (option === currentQuiz.correct_answer) {
      setScore(s => s + 1);
    }
  };

  const nextQuestion = () => {
    if (currentIndex < quizzes.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = async () => {
    const finalScore = Math.round((score / quizzes.length) * 100);
    if (finalScore === 100) {
      await completeLesson(track, parseInt(lessonId, 10));
      Alert.alert(
        'Perfect Score!', 
        'You have mastered this lesson and unlocked the next one.',
        [{ text: 'Great!', onPress: () => router.back() }]
      );
    } else {
      Alert.alert(
        'Quiz Finished', 
        `You got ${score}/${quizzes.length} correct. Try again to reach 100% and unlock the next lesson!`,
        [{ text: 'Retry', onPress: () => {
          setCurrentIndex(0);
          setSelectedOption(null);
          setIsAnswered(false);
          setScore(0);
        }}, { text: 'Back to Lesson', onPress: () => router.back() }]
      );
    }
  };

  if (!currentQuiz) return null;

  const isCorrect = selectedOption === currentQuiz.correct_answer;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Bar */}
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="#1C1C1E" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Question {currentIndex + 1} of {quizzes.length}</Text>
        <Text style={styles.headerScore}>{score}</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.questionText}>{currentQuiz.question}</Text>

        {currentQuiz.options ? (
          <View style={styles.optionsGrid}>
            {currentQuiz.options.map((option: string) => {
              const isSelected = option === selectedOption;
              
              let bgColor = '#FFFFFF';
              let borderColor = '#E5E7EB';
              if (isSelected) {
                bgColor = '#E0F2FE';
                borderColor = '#38BDF8';
              }

              return (
                <TouchableOpacity
                  key={option}
                  style={[styles.optionCard, { backgroundColor: bgColor, borderColor }]}
                  onPress={() => handleOptionSelect(option)}
                  activeOpacity={0.7}
                  disabled={isAnswered}
                >
                  <Text style={[styles.optionLabel, isSelected && { color: '#0369A1' }]}>
                    {option.length > 15 ? option.substring(0, 15) + '...' : option}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          <View style={styles.textInputNotice}>
            <TouchableOpacity style={styles.selfCheckButton} onPress={() => handleOptionSelect(currentQuiz.correct_answer)}>
              <Text style={styles.selfCheckText}>I know the answer</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Feedback Section */}
        {isAnswered && (
          <View style={styles.feedbackContainer}>
            <Text style={styles.feedbackTitle}>Feedback on answers</Text>
            <View style={[styles.feedbackCard, isCorrect ? styles.feedbackCardCorrect : styles.feedbackCardError]}>
              <Ionicons 
                name={isCorrect ? 'checkmark' : 'close'} 
                size={20} 
                color={isCorrect ? '#166534' : '#991B1B'} 
              />
              <Text style={[styles.feedbackText, isCorrect ? styles.feedbackTextCorrect : styles.feedbackTextError]}>
                {isCorrect ? 'Correct answer' : 'Error answer'}
              </Text>
              {isCorrect && <Ionicons name="sparkles-outline" size={18} color="#166534" style={styles.feedbackIcon} />}
            </View>
          </View>
        )}

        {isAnswered && (
          <TouchableOpacity 
            style={[styles.nextButton, { backgroundColor: track === 'python' ? '#5E5CE6' : '#00AFB9' }]} 
            onPress={nextQuestion}
          >
            <Text style={styles.nextButtonText}>
              {currentIndex < quizzes.length - 1 ? 'Next Question' : 'Finish Quiz'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    padding: 2,
  },
  headerText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  headerScore: {
    fontSize: 16,
    color: '#00AFB9',
    fontWeight: '700',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  questionText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 32,
    lineHeight: 32,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  optionCard: {
    width: '48%',
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    backgroundColor: '#FFFFFF',
    borderColor: '#F3F4F6',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  optionLabel: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '600',
  },
  textInputNotice: {
    alignItems: 'center',
    marginTop: 20,
  },
  selfCheckButton: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 24,
    paddingVertical: 15,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  selfCheckText: {
    color: '#5E5CE6',
    fontWeight: '600',
    fontSize: 16,
  },
  feedbackContainer: {
    marginTop: 40,
  },
  feedbackTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  feedbackCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1.5,
  },
  feedbackCardCorrect: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
  },
  feedbackCardError: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  feedbackText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    flex: 1,
  },
  feedbackTextCorrect: {
    color: '#166534',
  },
  feedbackTextError: {
    color: '#991B1B',
  },
  feedbackIcon: {
    marginLeft: 'auto',
  },
  nextButton: {
    position: 'absolute',
    bottom: 40,
    left: 24,
    right: 24,
    height: 60,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});
