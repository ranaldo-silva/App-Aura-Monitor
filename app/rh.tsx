// app/rh.tsx
import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  RefreshControl
} from 'react-native';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { UserPlus, Users, Mail, User as UserIcon } from 'lucide-react-native';
import { router, useFocusEffect } from 'expo-router';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { useAuth } from '../hooks/useAuth';
import { DataService } from '../services/dataService';
import Header from '../components/Header';

// Mapeamento visual de humor
const moodEmojis: Record<string, string> = {
  muito_feliz: '😄', feliz: '😊', neutro: '😐', estressado: '😟', muito_estressado: '😩'
};

export default function RH() {
  const { user, isLoading: authLoading } = useAuth();
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);

  // Recarrega os dados ao abrir a tela
  useFocusEffect(
    useCallback(() => {
      queryClient.invalidateQueries({ queryKey: ['allUsers'] });
      queryClient.invalidateQueries({ queryKey: ['allCheckins'] });
    }, [])
  );

  // Busca os dados da API REAL (/api/usuarios/all)
  const { data: allUsers = [], isLoading: usersLoading } = useQuery({
    queryKey: ['allUsers'],
    queryFn: DataService.getAllUsers,
  });

  const { data: allCheckins = [], isLoading: checkinsLoading, refetch: refetchCheckins } = useQuery({
    queryKey: ['allCheckins'],
    queryFn: () => DataService.getAllCheckins().catch(() => []),
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['allUsers'] }),
      refetchCheckins(),
    ]);
    setRefreshing(false);
  };

  if (authLoading || (user?.role === 'admin' && usersLoading)) {
    return (
        <View style={styles.loader}>
            <ActivityIndicator size="large" color="#2563EB" />
        </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.contentContainer}>
        {user && <Header user={user} />}

        <View style={styles.headerSection}>
          <Text style={styles.headerTitle}>Bem-Estar da Equipe</Text>
          <Text style={styles.subTitle}>Painel Administrativo</Text>
        </View>

        {/* --------- CARDS DE ESTATÍSTICA -------- */}
        <View style={styles.actionGrid}>
          <TouchableOpacity
            onPress={() => router.push('/manage-employees')}
            style={styles.manageButton}
          >
            <View style={styles.iconBg}>
              <UserPlus size={24} color="#6D28D9" />
            </View>
            <Text style={styles.manageButtonText}>Gestão de Usuários</Text>
            <Text style={styles.manageButtonSubtext}>Cadastrar ou editar</Text>
          </TouchableOpacity>

          <View style={styles.statCard}>
            <View style={[styles.iconBg, { backgroundColor: '#DBEAFE' }]}>
              <Users size={24} color="#2563EB" />
            </View>
            {/* Aqui mostra o número real de usuários */}
            <Text style={styles.statValue}>{allUsers.length}</Text>
            <Text style={styles.statLabel}>Colaboradores</Text>
          </View>
        </View>

        {/* --------- SEÇÃO: LISTA DE COLABORADORES -------- */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Colaboradores Cadastrados</Text>
          
          {allUsers.length > 0 ? (
            <View style={styles.userList}>
              {allUsers.map((u: any) => (
                <View key={u.id} style={styles.userCard}>
                   <View style={styles.userAvatar}>
                      <UserIcon size={20} color="#2563EB" />
                   </View>
                   <View style={styles.userInfo}>
                      <Text style={styles.userNameList}>{u.nome}</Text>
                      <View style={styles.userEmailRow}>
                        <Mail size={12} color="#6B7280" />
                        <Text style={styles.userEmail}>{u.email}</Text>
                      </View>
                   </View>
                   <View style={styles.userIdBadge}>
                      <Text style={styles.userIdText}>ID: {u.id}</Text>
                   </View>
                </View>
              ))}
            </View>
          ) : (
             <Text style={styles.noDataText}>Nenhum colaborador encontrado na base de dados.</Text>
          )}
        </View>

        {/* --------- ÚLTIMO CHECK-IN E HISTÓRICO -------- */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Histórico Recente</Text>

          {allCheckins.length > 0 ? (
            allCheckins.slice(0, 5).map((mood: any) => (
              <View key={mood.id} style={styles.historyItem}>
                <Text style={styles.historyEmoji}>
                  {moodEmojis[mood.nivelHumor] || '😐'}
                </Text>
                <View style={{ flex: 1 }}>
                   {/* Tenta achar o nome do usuário pelo ID na lista carregada */}
                  <Text style={styles.historyUser}>
                    {allUsers.find((u: any) => u.id === mood.usuarioId)?.nome || `Usuário ${mood.usuarioId}`}
                  </Text>
                  <Text style={styles.historyTime}>
                    {mood.dataCheckin ? format(new Date(mood.dataCheckin), "dd/MM/yyyy", { locale: ptBR }) : '-'}
                  </Text>
                </View>
                {mood.comentario && (
                   <Text numberOfLines={1} style={styles.historyComment}>"{mood.comentario}"</Text>
                )}
              </View>
            ))
          ) : (
            <Text style={styles.noDataText}>Sem registros recentes.</Text>
          )}
        </View>

      </View>
    </ScrollView>
  );
}

// ----------------- ESTILOS ----------------------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7FAFC' },
  contentContainer: { padding: 16, paddingBottom: 40 },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  headerSection: { marginBottom: 24 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#1F2937' },
  subTitle: { fontSize: 14, color: '#6B7280' },

  actionGrid: { flexDirection: 'row', gap: 16, marginBottom: 24 },

  manageButton: {
    flex: 1, backgroundColor: 'white', padding: 16, borderRadius: 16, elevation: 2,
  },
  iconBg: {
    width: 40, height: 40, borderRadius: 12, backgroundColor: '#F3E8FF',
    justifyContent: 'center', alignItems: 'center', marginBottom: 10,
  },
  manageButtonText: { fontSize: 16, fontWeight: 'bold', color: '#1F2937' },
  manageButtonSubtext: { fontSize: 12, color: '#6B7280' },

  statCard: {
    flex: 1, backgroundColor: 'white', padding: 16, borderRadius: 16, elevation: 2,
  },
  statValue: { fontSize: 24, fontWeight: 'bold', color: '#1F2937' },
  statLabel: { color: '#6B7280' },

  sectionContainer: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12, color: '#374151' },

  // --- Estilos da Lista de Usuários ---
  userList: { gap: 10 },
  userCard: {
    backgroundColor: 'white', padding: 12, borderRadius: 12,
    flexDirection: 'row', alignItems: 'center', gap: 12, elevation: 1,
    borderWidth: 1, borderColor: '#F3F4F6'
  },
  userAvatar: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#EFF6FF',
    alignItems: 'center', justifyContent: 'center'
  },
  userInfo: { flex: 1 },
  userNameList: { fontWeight: '600', color: '#1F2937', fontSize: 14 },
  userEmailRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  userEmail: { color: '#6B7280', fontSize: 12 },
  userIdBadge: { backgroundColor: '#F3F4F6', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  userIdText: { fontSize: 10, fontWeight: 'bold', color: '#4B5563' },

  // --- Estilos Histórico ---
  historyItem: {
    padding: 14, backgroundColor: 'white', borderRadius: 10, marginBottom: 10,
    flexDirection: 'row', alignItems: 'center', gap: 10,
    borderWidth: 1, borderColor: '#F3F4F6'
  },
  historyEmoji: { fontSize: 24 },
  historyUser: { fontWeight: '600', color: '#374151', fontSize: 14 },
  historyTime: { fontSize: 12, color: '#6B7280' },
  historyComment: { fontStyle: 'italic', fontSize: 12, color: '#9CA3AF', maxWidth: 100 },
  
  noDataText: { textAlign: 'center', paddingVertical: 20, color: '#9CA3AF', fontStyle: 'italic' },
});