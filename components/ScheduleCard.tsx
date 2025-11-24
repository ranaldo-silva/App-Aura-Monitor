// components/ScheduleCard.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Clock, Coffee, Briefcase, Users, Target, CheckCircle2, Circle } from 'lucide-react-native';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ScheduleEvent } from '../services/types';

interface ScheduleCardProps {
  event: ScheduleEvent;
  onToggleComplete: (event: ScheduleEvent) => void;
}

const eventIcons: any = {
  work: Briefcase, meeting: Users, break: Coffee, active_pause: Target, focus_time: Target
};

const eventColors: any = {
  work: { bg: '#DBEAFE', text: '#1E40AF', border: '#93C5FD' },
  meeting: { bg: '#EDE9FE', text: '#5B21B6', border: '#C4B5FD' },
  break: { bg: '#D1FAE5', text: '#059669', border: '#6EE7B7' },
  active_pause: { bg: '#FFFAE5', text: '#C2410C', border: '#FDBA74' },
  focus_time: { bg: '#E0F2F1', text: '#0F766E', border: '#4BCFCA' }
};

const eventLabels: any = {
  work: 'Trabalho', meeting: 'Reunião', break: 'Pausa', active_pause: 'Pausa Ativa', focus_time: 'Foco'
};

export default function ScheduleCard({ event, onToggleComplete }: ScheduleCardProps) {
  const Icon = eventIcons[event.event_type] || Briefcase;
  const isActivePause = event.event_type === 'active_pause';
  const colorScheme = eventColors[event.event_type] || eventColors.work;

  return (
    <View 
      style={[
        styles.cardBase,
        isActivePause ? styles.cardActivePause : styles.cardDefault,
        event.is_completed && styles.cardCompleted
      ]}
    >
      <View style={styles.cardContent}>
        <View style={styles.mainInfo}>
          <View style={[styles.iconWrapper, { backgroundColor: isActivePause ? eventColors.active_pause.bg : '#F3F4F6' }]}>
            <Icon size={20} color={isActivePause ? eventColors.active_pause.text : '#4B5563'} />
          </View>
          
          <View style={styles.textContainer}>
            <View style={styles.titleRow}>
              <Text 
                style={[
                  styles.title, 
                  event.is_completed && styles.titleCompleted
                ]}
              >
                {event.title}
              </Text>
              {isActivePause && (
                <View style={styles.badgeActivePause}>
                  <Text style={styles.badgeTextActivePause}>Recomendado</Text>
                </View>
              )}
            </View>
            
            {event.description && (
              <Text style={styles.description}>
                {event.description}
              </Text>
            )}
            
            <View style={styles.detailsRow}>
              <View style={styles.detailItem}>
                <Clock size={12} color="#6B7280" />
                <Text style={styles.detailText}>
                  {format(new Date(event.start_time), 'HH:mm', { locale: ptBR })} - {format(new Date(event.end_time), 'HH:mm', { locale: ptBR })}
                </Text>
              </View>
              <View style={[styles.badgeBase, { backgroundColor: colorScheme.bg, borderColor: colorScheme.border }]}>
                <Text style={[styles.badgeTextBase, { color: colorScheme.text }]}>{eventLabels[event.event_type]}</Text>
              </View>
            </View>
          </View>
        </View>
        
        <TouchableOpacity
          onPress={() => onToggleComplete(event)}
          style={styles.toggleButton}
        >
          {event.is_completed ? (
            <CheckCircle2 size={24} color="#10B981" />
          ) : (
            <Circle size={24} color="#9CA3AF" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardBase: {
    borderRadius: 8,
    borderLeftWidth: 4,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    padding: 16,
    marginBottom: 8,
  },
  cardActivePause: {
    borderLeftColor: '#F97316',
    backgroundColor: '#FFF7ED', 
  },
  cardDefault: {
    borderLeftColor: '#D1D5DB', 
  },
  cardCompleted: {
    opacity: 0.6,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  mainInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  iconWrapper: {
    padding: 8,
    borderRadius: 8,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontWeight: '600',
    color: '#1F2937',
    fontSize: 16,
    marginRight: 8,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
  },
  badgeActivePause: {
    backgroundColor: '#FDBA74',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeTextActivePause: {
    fontSize: 10,
    fontWeight: '600',
    color: '#C2410C',
  },
  description: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 8,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 12,
    color: '#6B7280',
  },
  badgeBase: {
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1,
  },
  badgeTextBase: {
    fontSize: 10,
    fontWeight: '600',
  },
  toggleButton: {
    marginLeft: 10,
    padding: 4,
  }
});