// components/MoodSelector.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Smile, Meh, Frown, SmilePlus, Angry } from 'lucide-react-native';
import { MoodLevel } from '../services/types'; // Importando tipo de dado

interface MoodOption {
  value: MoodLevel;
  icon: typeof Smile; // Tipo para ícones Lucide RN
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

const moodOptions: MoodOption[] = [
  { value: 'muito_feliz', icon: SmilePlus, label: 'Muito Feliz', color: '#10B981', bgColor: '#ECFDF5', borderColor: '#34D399' },
  { value: 'feliz', icon: Smile, label: 'Feliz', color: '#3B82F6', bgColor: '#EFF6FF', borderColor: '#60A5FA' },
  { value: 'neutro', icon: Meh, label: 'Neutro', color: '#F59E0B', bgColor: '#FFFBEB', borderColor: '#FCD34D' },
  { value: 'estressado', icon: Frown, label: 'Estressado', color: '#F97316', bgColor: '#FFF7ED', borderColor: '#FB923C' },
  { value: 'muito_estressado', icon: Angry, label: 'Muito Estressado', color: '#EF4444', bgColor: '#FEF2F2', borderColor: '#F87171' }
];

interface MoodSelectorProps {
  selectedMood: MoodLevel | null;
  onMoodSelect: (mood: MoodLevel) => void; 
}

export default function MoodSelector({ selectedMood, onMoodSelect }: MoodSelectorProps) {
  return (
    <View style={styles.gridContainer}>
      {moodOptions.map((mood) => {
        const Icon = mood.icon;
        const isSelected = selectedMood === mood.value;

        return (
          <TouchableOpacity
            key={mood.value}
            onPress={() => onMoodSelect(mood.value)} // <--- CHAMANDO A FUNÇÃO CORRETA: onMoodSelect
            style={[
              styles.moodButton,
              isSelected 
                ? { backgroundColor: mood.bgColor, borderColor: mood.borderColor } 
                : styles.defaultButton
            ]}
          >
            <Icon size={40} style={[styles.moodIcon, isSelected ? { color: mood.color } : styles.defaultIcon]} />
            <Text 
              style={[
                styles.moodLabel, 
                isSelected ? { color: mood.color } : styles.defaultLabel
              ]}
            >
              {mood.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  gridContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  moodButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 2,
    transitionDuration: 200,
  },
  defaultButton: {
    backgroundColor: 'white',
    borderColor: '#E5E7EB',
  },
  moodIcon: {
    marginBottom: 4,
  },
  defaultIcon: {
    color: '#9CA3AF',
  },
  moodLabel: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  defaultLabel: {
    color: '#6B7280',
  }
});