// app/checkin.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
  Alert
} from 'react-native';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CheckCircle2, Sparkles, ArrowLeft } from 'lucide-react-native';
import { router } from 'expo-router';

import { useAuth } from '../hooks/useAuth';
import { DataService } from '../services/dataService';
import MoodSelector from '../components/MoodSelector';

export default function Checkin() {
  const { user } = useAuth();
  const [selectedMood, setSelectedMood] = useState<string | null>(null); // Guardamos como string, mas convertemos depois
  const [comment, setComment] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const queryClient = useQueryClient();

  // Mapeamento visual para valor numérico (Backend espera 1 a 10? ou 1 a 5?)
  // Baseado no seu MoodSelector, mapeamos:
  const moodValueMap: Record<string, number> = {
    'muito_feliz': 10,  // backend: 10
    'feliz': 8,
    'neutro': 5,
    'estressado': 3,
    'muito_estressado': 1
  };

  const checkinMutation = useMutation({
    mutationFn: async (data: any) => {
      console.log("Enviando Payload:", JSON.stringify(data)); 
      return await DataService.createCheckin(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recentMoods'] });
      queryClient.invalidateQueries({ queryKey: ['allCheckins'] }); // Atualiza o RH 
      
      setShowSuccess(true);
      setTimeout(() => router.replace('/home'), 1500);
    },
    onError: (error: any) => {
      console.error("Erro no checkin:", error);
      Alert.alert("Erro", "Não foi possível registrar o check-in.");
    }
  });

  const handleSubmit = () => {
    if (!user || !user.id) {
        Alert.alert("Erro", "Usuário não identificado. Faça login novamente.");
        return;
    }

    if (!selectedMood) {
      Alert.alert('Atenção', 'Selecione como você está se sentindo.');
      return;
    }

    // Pega a data de hoje no formato YYYY-MM-DD
    const hoje = new Date().toISOString().split('T')[0];

    // Monta o JSON exato 
    const payload = {
      dataCheckin: hoje,
      nivelHumor: moodValueMap[selectedMood] || 5, // Converte string para Numero
      comentario: comment.trim(),
      usuarioId: user.id // ID do usuário logado
    };

    checkinMutation.mutate(payload);
  };

  return (
    <View style={styles.mainContainer}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#2563EB" />
        </TouchableOpacity>

        {showSuccess ? (
          <View style={styles.successContainer}>
            <CheckCircle2 size={64} color="#10B981" />
            <Text style={styles.successTitle}>Registrado!</Text>
            <Text style={styles.successSub}>Seu humor foi salvo com sucesso.</Text>
          </View>
        ) : (
          <View style={styles.formCard}>
            <View style={styles.formHeader}>
              <Sparkles size={20} color="#2563EB" />
              <Text style={styles.formTitle}>Como você está se sentindo?</Text>
            </View>

            {/* Selector de Humor */}
            <MoodSelector 
                selectedMood={selectedMood as any} 
                onMoodSelect={setSelectedMood} 
            />

            <Text style={styles.labelInput}>Comentário (Opcional)</Text>
            <TextInput
              value={comment}
              onChangeText={setComment}
              placeholder="Aconteceu algo específico?"
              multiline
              maxLength={200}
              style={styles.textArea}
            />

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
              disabled={checkinMutation.isPending}
            >
              {checkinMutation.isPending ? (
                 <ActivityIndicator color="#FFF" />
              ) : (
                 <Text style={styles.submitText}>Registrar Humor</Text>
              )}
            </TouchableOpacity>
          </View>
        )}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#F7FAFC' },
  scrollContent: { flexGrow: 1, padding: 16 },
  backButton: { padding: 8, marginBottom: 10 },
  formCard: {
    backgroundColor: 'white', padding: 24, borderRadius: 16, elevation: 4, shadowOpacity: 0.1
  },
  formHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 20 },
  formTitle: { fontSize: 20, fontWeight: 'bold', color: '#1F2937' },
  labelInput: { marginTop: 20, marginBottom: 8, fontWeight: '600', color: '#4B5563' },
  textArea: {
    minHeight: 100, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0',
    padding: 12, backgroundColor: '#F8FAFC', textAlignVertical: 'top'
  },
  submitButton: {
    backgroundColor: '#2563EB', padding: 16, borderRadius: 12, marginTop: 24, alignItems: 'center',
  },
  submitText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  successContainer: { marginTop: 100, alignItems: 'center' },
  successTitle: { marginTop: 16, fontSize: 24, fontWeight: 'bold', color: '#10B981' },
  successSub: { color: '#6B7280', marginTop: 8 }
});