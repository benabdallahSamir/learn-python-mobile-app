import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface CodeBlockProps {
  code: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await Clipboard.setStringAsync(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset icon after 2 seconds
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}># Code</Text>
        <TouchableOpacity style={styles.copyButton} onPress={handleCopy}>
          <Ionicons 
            name={copied ? 'checkmark-outline' : 'copy-outline'} 
            size={18} 
            color={copied ? '#4CAF50' : '#FFFFFF'} 
            opacity={copied ? 1 : 0.6} 
          />
        </TouchableOpacity>
      </View>
      <View style={styles.codeContainer}>
        {code.split('\n').map((line, index) => {
          // Very basic syntax highlighting for common Python/Django words
          const highlight = (l: string) => {
            return l.split(' ').map((word, i) => {
              let color = '#FFFFFF';
              if (['def', 'class', 'import', 'from', 'if', 'else', 'return', 'print'].includes(word.replace(/[():]/g, ''))) {
                color = '#569CD6'; // Keyword blue
              } else if (word.includes("'") || word.includes('"')) {
                color = '#CE9178'; // String orange
              } else if (word.includes('#')) {
                color = '#6A9955'; // Comment green
              }
              return <Text key={i} style={{ color }}>{word} </Text>;
            });
          };

          return (
            <Text key={index} style={styles.codeLine}>
              {highlight(line)}
            </Text>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    marginVertical: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#333333',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#252526',
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  headerText: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '600',
    fontFamily: 'monospace',
  },
  copyButton: {
    padding: 4,
  },
  codeContainer: {
    padding: 16,
  },
  codeLine: {
    fontFamily: 'monospace',
    fontSize: 14,
    lineHeight: 22,
    color: '#D4D4D4',
  },
});
