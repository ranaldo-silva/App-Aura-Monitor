// components/Card.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Thermometer, MapPin, AlertCircle } from 'lucide-react-native';
import { DataService } from '../services/dataService';
import { DadosIot } from '../services/types';

const RNCard = ({ children, style }: { children: React.ReactNode, style?: any }) => (
  <View style={[styles.card, style]}>{children}</View>
);

export default function Card() {
  const [iot, setIot] = useState<DadosIot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    loadData();
    // Atualiza a cada 10 segundos
    const interval = setInterval(loadData, 10000); 
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const response = await DataService.getIoT();
      
      // Lógica de segurança: Aceita Array direto ou Objeto Paginado (Spring Boot)
      let lista: DadosIot[] = [];
      if (Array.isArray(response)) {
        lista = response;
      } else if (response.content && Array.isArray(response.content)) {
        lista = response.content;
      }

      if (lista.length > 0) {
        // Pega o último registro (o mais recente)
        setIot(lista[lista.length - 1]);
      } else {
        setIot(null);
      }
      setError(false);
    } catch (e) {
      console.log("Erro ao carregar IoT:", e);
      setError(true);
    } finally {
      setLoading(false); // Para o loading independente do resultado
    }
  };

  return (
    <RNCard style={styles.widgetCard}>
      <View style={styles.header}>
        <Thermometer size={20} color="#2563EB" />
        <Text style={styles.headerText}>Ambiente - IoT</Text>
      </View>

      {/* ESTADO 1: CARREGANDO */}
      {loading && (
        <View style={styles.centerContainer}>
          <ActivityIndicator color="#2563EB" />
          <Text style={styles.loadingText}>Sincronizando sensores...</Text>
        </View>
      )}

      {/* ESTADO 2: ERRO */}
      {!loading && error && (
        <View style={styles.centerContainer}>
          <AlertCircle size={24} color="#EF4444" />
          <Text style={styles.errorText}>Erro de conexão IoT</Text>
        </View>
      )}

      {/* ESTADO 3: SEM DADOS */}
      {!loading && !error && !iot && (
        <View style={styles.centerContainer}>
          <Text style={styles.noDataText}>Nenhum dado de sensor recebido.</Text>
        </View>
      )}

      {/* ESTADO 4: DADOS CARREGADOS (SUCESSO) */}
      {!loading && !error && iot && (
        <View style={styles.grid}>
          <View style={styles.statItem}>
            <Text style={styles.label}>Temperatura</Text>
            <Text style={styles.value}>{iot.temperatura}°C</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.label}>Local</Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <MapPin size={16} color="#2563EB" />
              <Text style={styles.valueSmall} numberOfLines={1}>
                {iot.localSensor}
              </Text>
            </View>
          </View>
        </View>
      )}
    </RNCard>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
  },
  widgetCard: {
    backgroundColor: '#F3F4F6',
    padding: 16,
    minHeight: 140, 
    justifyContent: 'center'
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  headerText: {
    fontWeight: "600",
    color: "#1F2937",
  },
  grid: {
    gap: 12
  },
  statItem: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 12
  },
  label: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 4
  },
  value: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#111827"
  },
  valueSmall: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    flex: 1
  },
  // Estilos de estados vazios/loading
  centerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    gap: 6
  },
  loadingText: {
    fontSize: 12,
    color: '#6B7280'
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    fontWeight: '500'
  },
  noDataText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontStyle: 'italic'
  }
});