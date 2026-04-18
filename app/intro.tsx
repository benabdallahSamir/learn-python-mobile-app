import { setIntroStatus, setSelectedTrack } from '@/hooks/useStorage';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Dimensions, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

type Track = 'python' | 'django';

export default function IntroScreen() {
  const [selectedTrack, setSelectedTrackState] = useState<Track>('python');
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  const handleStart = async () => {
    setIsSaving(true);
    try {
      await setSelectedTrack(selectedTrack);
      await setIntroStatus(true);
      router.replace('/');
    } catch (e) {
      console.error('Error in handleStart:', e);
      Alert.alert(
        'Storage Error',
        'Could not save your preferences. If you are using a development build, please ensure you have rebuilt the native app.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Welcome</Text>
          <Text style={styles.titleText}>Learn Python & Django step by step</Text>
          <Text style={styles.subtitleText}>Learn Python & Django.</Text>
        </View>

        <View style={styles.cardContainer}>
          {/* Python Card */}
          <TouchableOpacity
            style={[
              styles.card,
              selectedTrack === 'python' ? styles.cardSelected : styles.cardUnselected,
            ]}
            onPress={() => setSelectedTrackState('python')}
            activeOpacity={0.8}
          >
            <View style={styles.cardHeader}>
              <Text
                style={[
                  styles.cardTitle,
                  selectedTrack === 'python' ? styles.textWhite : styles.textBlack,
                ]}
              >
                Start with Python
              </Text>
              {selectedTrack === 'python' && (
                <Ionicons name="checkmark-circle" size={24} color="#FFFFFF" />
              )}
            </View>
            <Text
              style={[
                styles.cardDescription,
                selectedTrack === 'python' ? styles.textWhiteSoft : styles.textGray,
              ]}
            >
              Recommended
            </Text>
          </TouchableOpacity>

          {/* Django Card */}
          <TouchableOpacity
            style={[
              styles.card,
              selectedTrack === 'django' ? styles.cardSelected : styles.cardUnselected,
            ]}
            onPress={() => setSelectedTrackState('django')}
            activeOpacity={0.8}
          >
            <View style={styles.cardHeader}>
              <Text
                style={[
                  styles.cardTitle,
                  selectedTrack === 'django' ? styles.textWhite : styles.textBlack,
                ]}
              >
                Jump to Django
              </Text>
              {selectedTrack === 'django' && (
                <Ionicons name="checkmark-circle" size={24} color="#FFFFFF" />
              )}
            </View>
            <Text
              style={[
                styles.cardDescription,
                selectedTrack === 'django' ? styles.textWhiteSoft : styles.textGray,
              ]}
            >
              Jump to: Python to Django
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.startButton} onPress={handleStart} activeOpacity={0.9}>
          <Text style={styles.startButtonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  header: {
    marginBottom: 40,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  titleText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1C1C1E',
    lineHeight: 32,
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: 16,
    color: '#636366',
  },
  cardContainer: {
    gap: 16,
  },
  card: {
    padding: 24,
    borderRadius: 20,
    borderWidth: 2,
    position: 'relative',
    overflow: 'hidden',
  },
  cardSelected: {
    backgroundColor: '#5E5CE6',
    borderColor: '#5E5CE6',
  },
  cardUnselected: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  cardDescription: {
    fontSize: 14,
  },
  textWhite: {
    color: '#FFFFFF',
  },
  textWhiteSoft: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  textBlack: {
    color: '#1C1C1E',
  },
  textGray: {
    color: '#636366',
  },
  recommendedBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  recommendedText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  footer: {
    padding: 24,
    paddingBottom: 40,
  },
  startButton: {
    backgroundColor: '#5E5CE6',
    height: 60,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#5E5CE6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});
