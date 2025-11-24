// app/manage-employees.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  Alert,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl
} from "react-native";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DataService } from "../services/dataService";
import { Trash2, Edit, UserPlus, X } from "lucide-react-native";
import { router } from "expo-router";

export default function ManageEmployees() {
  const queryClient = useQueryClient();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState<any | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
  });

  // 1. GET: Listar Usuários (/api/usuarios/all)
  const { data: employees = [], isLoading } = useQuery({
    queryKey: ["employees"],
    queryFn: DataService.getAllUsers,
  });

  // 2. POST: Criar Usuário
  const createMutation = useMutation({
    mutationFn: (data: any) => DataService.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      queryClient.invalidateQueries({ queryKey: ["allUsers"] }); // Atualiza o RH
      Alert.alert("Sucesso", "Usuário criado!");
      closeModal();
    },
    onError: (err: any) => {
      Alert.alert("Erro", err.response?.data?.message || "Falha ao criar.");
    }
  });

  // 3. PUT: Atualizar Usuário
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: any) => DataService.updateUsuario(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      queryClient.invalidateQueries({ queryKey: ["allUsers"] });
      Alert.alert("Sucesso", "Usuário atualizado!");
      closeModal();
    },
    onError: (err: any) => {
      Alert.alert("Erro", err.response?.data?.message || "Falha ao atualizar.");
    }
  });

  // 4. DELETE: Remover Usuário
  const deleteMutation = useMutation({
    mutationFn: (id: number) => DataService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      queryClient.invalidateQueries({ queryKey: ["allUsers"] });
      Alert.alert("Removido", "Usuário excluído com sucesso.");
    },
    onError: (err: any) => {
      Alert.alert("Erro", "Não foi possível excluir este usuário.");
    }
  });

  // --- FUNÇÕES AUXILIARES ---

  const onRefresh = async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ["employees"] });
    setRefreshing(false);
  };

  const handleSave = async () => {
    if (!formData.nome || !formData.email) {
      Alert.alert("Atenção", "Nome e Email são obrigatórios.");
      return;
    }

    const dataHoje = new Date().toISOString().split('T')[0];

    if (currentEmployee) {
      // === EDITAR ===
      // No PUT, precisamos enviar todos os campos.
      // Se a senha estiver vazia, avisamos (ou você pode decidir manter a senha antiga se tiver acesso)
      if (!formData.senha) {
        Alert.alert("Atenção", "Para atualizar, confirme a senha ou crie uma nova.");
        return;
      }

      const payload = {
        nome: formData.nome.trim(),
        email: formData.email.trim(),
        senha: formData.senha.trim(),
        dataCadastro: currentEmployee.dataCadastro || dataHoje
      };

      updateMutation.mutate({ id: currentEmployee.id, data: payload });

    } else {
      // === CRIAR ===
      if (!formData.senha) {
        Alert.alert("Atenção", "Senha é obrigatória para novos usuários.");
        return;
      }

      const payload = {
        nome: formData.nome.trim(),
        email: formData.email.trim(),
        senha: formData.senha.trim(),
        dataCadastro: dataHoje
      };

      createMutation.mutate(payload);
    }
  };

  const handleDelete = (item: any) => {
    Alert.alert(
      "Confirmar exclusão",
      `Deseja realmente remover ${item.nome}?`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", style: "destructive", onPress: () => deleteMutation.mutate(item.id) }
      ]
    );
  };

  const openEditModal = (item: any) => {
    setCurrentEmployee(item);
    setFormData({
      nome: item.nome,
      email: item.email,
      senha: "", // Por segurança, senha vem vazia
    });
    setIsModalVisible(true);
  };

  const openNewModal = () => {
    setCurrentEmployee(null);
    setFormData({ nome: "", email: "", senha: "" });
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setCurrentEmployee(null);
    setFormData({ nome: "", email: "", senha: "" });
  };

  // --- RENDERIZAÇÃO ---

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backLink}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Gestão de Usuários</Text>
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      ) : (
        <ScrollView 
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          <TouchableOpacity style={styles.addButton} onPress={openNewModal}>
            <UserPlus size={20} color="white" />
            <Text style={styles.addButtonText}>Novo Usuário</Text>
          </TouchableOpacity>

          {employees.length === 0 ? (
             <Text style={styles.emptyText}>Nenhum usuário cadastrado.</Text>
          ) : (
             employees.map((emp: any) => (
              <View key={emp.id} style={styles.card}>
                <View style={styles.cardInfo}>
                  <Text style={styles.cardName}>{emp.nome}</Text>
                  <Text style={styles.cardEmail}>{emp.email}</Text>
                  <Text style={styles.cardId}>ID: {emp.id}</Text>
                </View>
                
                <View style={styles.cardActions}>
                  <TouchableOpacity onPress={() => openEditModal(emp)} style={styles.actionBtn}>
                    <Edit size={20} color="#2563EB" />
                  </TouchableOpacity>
                  
                  <TouchableOpacity onPress={() => handleDelete(emp)} style={styles.actionBtn}>
                    <Trash2 size={20} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      )}

      {/* MODAL DE CRIAÇÃO/EDIÇÃO */}
      <Modal animationType="slide" transparent visible={isModalVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {currentEmployee ? "Editar Usuário" : "Novo Usuário"}
              </Text>
              <TouchableOpacity onPress={closeModal}>
                <X size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Nome</Text>
            <TextInput
              style={styles.input}
              placeholder="Nome completo"
              value={formData.nome}
              onChangeText={(t) => setFormData(p => ({...p, nome: t}))}
            />

            <Text style={styles.label}>E-mail</Text>
            <TextInput
              style={styles.input}
              placeholder="email@empresa.com"
              value={formData.email}
              onChangeText={(t) => setFormData(p => ({...p, email: t}))}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.label}>
              {currentEmployee ? "Nova Senha (Obrigatório para salvar)" : "Senha"}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Digite a senha"
              value={formData.senha}
              onChangeText={(t) => setFormData(p => ({...p, senha: t}))}
              secureTextEntry
            />

            <TouchableOpacity 
              style={styles.saveButton} 
              onPress={handleSave}
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {(createMutation.isPending || updateMutation.isPending) ? (
                 <ActivityIndicator color="white" />
              ) : (
                 <Text style={styles.saveButtonText}>Salvar</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7FAFC" },
  header: { padding: 20, backgroundColor: "white", elevation: 2, paddingBottom: 15 },
  backLink: { color: "#2563EB", marginBottom: 10, fontSize: 16 },
  title: { fontSize: 24, fontWeight: "bold", color: "#1F2937" },
  
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContent: { padding: 20 },
  emptyText: { textAlign: 'center', marginTop: 40, color: '#9CA3AF' },

  addButton: {
    backgroundColor: "#10B981",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    gap: 8
  },
  addButtonText: { color: "white", fontWeight: "bold", fontSize: 16 },

  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 1
  },
  cardInfo: { flex: 1 },
  cardName: { fontSize: 16, fontWeight: "bold", color: "#1F2937" },
  cardEmail: { color: "#6B7280", fontSize: 14 },
  cardId: { color: "#9CA3AF", fontSize: 12, marginTop: 4 },
  
  cardActions: { flexDirection: 'row', gap: 16 },
  actionBtn: { padding: 4 },

  // Modal Styles
  modalOverlay: {
    flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", padding: 20
  },
  modalContainer: {
    backgroundColor: "white", borderRadius: 16, padding: 24, elevation: 5
  },
  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20
  },
  modalTitle: { fontSize: 20, fontWeight: "bold", color: "#1F2937" },
  
  label: { fontWeight: "600", marginBottom: 6, color: '#374151' },
  input: {
    borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 8,
    padding: 12, marginBottom: 16, backgroundColor: "#F9FAFB"
  },
  saveButton: {
    backgroundColor: "#2563EB", padding: 16, borderRadius: 12, alignItems: "center", marginTop: 8
  },
  saveButtonText: { color: "white", fontWeight: "bold", fontSize: 16 }
});