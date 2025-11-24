// app/home.tsx
import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Heart, Sparkles, RefreshCw } from 'lucide-react-native'; // ícone de refresh
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { router } from 'expo-router';

import { useAuth } from '../hooks/useAuth';
import { DataService } from '../services/dataService';
import Header from '../components/Header';
import Card from '../components/Card';

// Mapeamento reverso (Número -> Texto/Emoji)
const moodLabels: Record<number, string> = {
  10: 'Muito Feliz', 8: 'Feliz', 5: 'Neutro', 3: 'Estressado', 1: 'Muito Estressado'
};

const moodEmojis: Record<number, string> = {
  10: '😄', 8: '😊', 5: '😐', 3: '😟', 1: '😩'
};

export default function Home() {
  const { width } = useWindowDimensions();
  const isWeb = width >= 800;
  const { user, isLoading: authLoading } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!authLoading && !user) router.replace('/login');
  }, [authLoading, user]);

  // QUERY PRINCIPAL: Busca checkins do usuário logado
  const { data: recentMoods = [], isLoading, refetch } = useQuery({
    queryKey: ['recentMoods', user?.id], // A chave deve incluir o ID do usuário para ser única
    queryFn: async () => {
        if (!user?.id) return [];
        const data = await DataService.getCheckinsByUser(user.id);
        
        // ORDENAÇÃO: Garante que o mais novo (maior ID ou data) fique em primeiro [0]
        // Assumindo que o ID maior é o mais recente
        return data.sort((a, b) => b.id - a.id);
    },
    enabled: !!user?.id && !authLoading,
  });

  if (authLoading || !user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  // Pega o primeiro item (o mais recente após o sort)
  const lastMood = recentMoods.length > 0 ? recentMoods[0] : null;

  return (
    <ScrollView style={styles.container}>
      <View style={[styles.contentContainer, isWeb && styles.contentContainerWeb]}>
        
        <Header user={user} />

        {/* CTA Check-in */}
        <TouchableOpacity
          onPress={() => router.push('/checkin')}
          style={styles.ctaCard}
        >
          <View style={styles.ctaContent}>
            <View style={{ flex: 1 }}>
              <View style={styles.ctaHeader}>
                <Sparkles size={20} color="#FACC15" />
                <Text style={styles.ctaSubText}>Como está seu dia hoje?</Text>
              </View>
              <Text style={styles.ctaTitle}>Registre seu humor agora</Text>
              <Text style={styles.ctaDescription}>Monitoramento diário de bem-estar</Text>
            </View>
            <View style={styles.ctaButton}>
              <Heart size={20} color="#2563EB" />
              <Text style={styles.ctaButtonText}>Check-in</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* IoT Widget */}
        <View style={styles.widgetContainer}>
          <Card />
        </View>

        {/* Card Último Registro */}
        <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Último Registro</Text>
            {/* Botão discreto para forçar atualização se precisar */}
            <TouchableOpacity onPress={() => refetch()}>
                <RefreshCw size={16} color="#6B7280" />
            </TouchableOpacity>
        </View>

        <View style={[styles.cardBase, styles.gridItem]}>
          {isLoading ? (
             <ActivityIndicator color="#2563EB" />
          ) : lastMood ? (
            <View style={styles.moodDetails}>
              <Text style={styles.moodEmoji}>
                {moodEmojis[lastMood.nivelHumor] || '😐'}
              </Text>
              <View>
                <Text style={styles.moodLabelText}>
                  {moodLabels[lastMood.nivelHumor] || 'Neutro'}
                </Text>
                <Text style={styles.checkinDateText}>
                  {lastMood.dataCheckin ? format(new Date(lastMood.dataCheckin), "dd 'de' MMMM", { locale: ptBR }) : 'Data desconhecida'}
                </Text>
                {lastMood.comentario && (
                    <Text style={styles.commentText}>"{lastMood.comentario}"</Text>
                )}
              </View>
            </View>
          ) : (
            <Text style={styles.noDataText}>
              Nenhum registro ainda. Faça seu primeiro check-in acima!
            </Text>
          )}
        </View>

        {/* Histórico Recente (Lista) */}
        {recentMoods.length > 0 && (
          <View style={styles.historyContainer}>
            <Text style={styles.sectionTitle}>Histórico Anterior</Text>
            {recentMoods.slice(1, 4).map((mood) => ( // Pula o primeiro (0) pois já mostramos acima
                <View key={mood.id} style={styles.historyItem}>
                    <Text style={{fontSize: 20}}>{moodEmojis[mood.nivelHumor]}</Text>
                    <View style={{flex: 1}}>
                        <Text style={styles.historyLabel}>{moodLabels[mood.nivelHumor]}</Text>
                        <Text style={styles.historyDate}>
                             {format(new Date(mood.dataCheckin), "dd/MM/yyyy", { locale: ptBR })}
                        </Text>
                    </View>
                </View>
            ))}
          </View>
        )}

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7FAFC' },
  contentContainer: { width: '100%', padding: 16, paddingBottom: 40 },
  contentContainerWeb: { maxWidth: 900, alignSelf: 'center' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  ctaCard: { backgroundColor: '#3B82F6', borderRadius: 16, padding: 20, marginBottom: 20, elevation: 3 },
  ctaContent: { flexDirection: 'row', alignItems: 'center' },
  ctaHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  ctaSubText: { color: 'white', marginLeft: 8, fontWeight: '500', fontSize: 12 },
  ctaTitle: { color: 'white', fontSize: 20, fontWeight: 'bold', marginBottom: 2 },
  ctaDescription: { color: 'rgba(255,255,255,0.8)', fontSize: 12 },
  ctaButton: { backgroundColor: 'white', borderRadius: 12, paddingHorizontal: 12, height: 40, flexDirection: 'row', alignItems: 'center', marginLeft: 10 },
  ctaButtonText: { color: '#2563EB', fontWeight: 'bold', marginLeft: 6, fontSize: 12 },

  widgetContainer: { marginBottom: 20 },
  
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#374151' },

  cardBase: { backgroundColor: 'white', borderRadius: 12, padding: 16, marginBottom: 16, elevation: 2 },
  gridItem: { flex: 1 },

  moodDetails: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  moodEmoji: { fontSize: 40 },
  moodLabelText: { fontWeight: 'bold', fontSize: 18, color: '#1F2937' },
  checkinDateText: { fontSize: 12, color: '#6B7280' },
  commentText: { fontStyle: 'italic', color: '#4B5563', marginTop: 4, fontSize: 12 },
  noDataText: { color: '#6B7280', textAlign: 'center', fontStyle: 'italic' },

  historyContainer: { marginTop: 10 },
  historyItem: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: 'white', padding: 12, borderRadius: 10, marginBottom: 8 },
  historyLabel: { fontWeight: '600', color: '#374151' },
  historyDate: { fontSize: 10, color: '#9CA3AF' }
});