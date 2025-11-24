// components/Header.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { User as UserIcon, LogOut } from 'lucide-react-native';
import { User } from '../services/types';
import { AutenticacaoService } from '../services/autenticacao';
import { router } from 'expo-router'; 

const moodEmojis: Record<string, string> = {
  muito_feliz: '😄', feliz: '😊', neutro: '😐', estressado: '😟', muito_estressado: '😩'
};

interface WellnessHeaderProps {
  user: User;
  greeting?: boolean;
}

export default function Header({ user, greeting = true }: WellnessHeaderProps) {
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  // --- FUNÇÃO DE LOGOUT ---
  const handleLogout = async () => {
    try {
      // 1. Limpa o AsyncStorage
      await AutenticacaoService.logout();
      
      // 2. Força a navegação para a tela de Login
      // Usamos 'replace' para o usuário não conseguir voltar com o botão "Voltar" do Android
      router.replace('/'); 
    } catch (error) {
      Alert.alert("Erro", "Não foi possível sair.");
    }
  };

  return (
    <View style={styles.headerContainer}>
      <View style={styles.infoColumn}>
        {greeting && (
          <Text style={styles.greetingText}>
            {getGreeting()}! 👋
          </Text>
        )}
        <Text style={styles.userName}>
          {user?.full_name || user?.nome || 'Usuário'}
        </Text>
        {user?.mood_status && moodEmojis[user.mood_status] && (
          <View style={styles.moodStatusBadge}>
            <Text style={styles.moodEmoji}>{moodEmojis[user.mood_status]}</Text>
            <Text style={styles.moodStatusText}>
              Como você está se sentindo
            </Text>
          </View>
        )}
      </View>
      
      <View style={styles.actionsColumn}>
        {/* BOTÃO DE LOGOUT */}
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
             <LogOut size={20} color="white" />
        </TouchableOpacity>
        
        <View style={styles.userIconContainer}>
          <UserIcon size={32} color="white" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#2563EB', 
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
    marginBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoColumn: {
      flex: 1,
  },
  actionsColumn: {
      flexDirection: 'column',
      alignItems: 'flex-end',
      gap: 8,
  },
  greetingText: {
    fontSize: 14,
    color: '#BFDBFE', 
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  moodStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  moodEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  moodStatusText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'white',
  },
  userIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 50,
    padding: 12,
  },
  logoutButton: {
      backgroundColor: 'rgba(239, 68, 68, 0.8)', 
      borderRadius: 50,
      padding: 8,
  }
});