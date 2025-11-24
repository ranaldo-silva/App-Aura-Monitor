// app/register.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";

import { useMutation } from "@tanstack/react-query";
import { DataService } from "../services/dataService";
import { router } from "expo-router";

export default function RegisterScreen() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const registerMutation = useMutation({
    mutationFn: (data: any) => DataService.createUser(data),
  });

  const handleSubmit = async () => {
    if (!nome || !email || !senha) {
      Alert.alert("Atenção", "Preencha todos os campos.");
      return;
    }

    // Gera data de hoje no formato YYYY-MM-DD
    const dataHoje = new Date().toISOString().split('T')[0];

    // Payload EXATO 
    const payload = {
      nome: nome.trim(),
      email: email.trim(),
      senha: senha.trim(),
      dataCadastro: dataHoje 
    };

    try {
      console.log("Enviando cadastro:", payload);
      await registerMutation.mutateAsync(payload);
      
      Alert.alert("Sucesso", "Conta criada! Faça login agora.");
      router.replace("/login");
      
    } catch (err: any) {
      console.error(err);
      const msg = err.response?.data?.message || "Não foi possível criar sua conta.";
      Alert.alert("Erro", msg);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Criar Conta</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Nome completo</Text>
        <TextInput
          style={styles.input}
          value={nome}
          onChangeText={setNome}
          placeholder="Ex: João Silva"
        />

        <Text style={styles.label}>E-mail</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="email@empresa.com"
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Text style={styles.label}>Senha</Text>
        <TextInput
          style={styles.input}
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
          placeholder="Crie uma senha"
        />

        <TouchableOpacity
          style={[styles.button, registerMutation.isPending && styles.disabled]}
          onPress={handleSubmit}
          disabled={registerMutation.isPending}
        >
          {registerMutation.isPending ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>Cadastrar</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.loginLink}
        >
          <Text style={styles.loginText}>Voltar para Login</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, alignItems: "center", backgroundColor: "#F7FAFC", flexGrow: 1, justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 24, color: "#1E3A8A" },
  card: {
    width: "100%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 16,
    elevation: 4,
  },
  label: { fontWeight: "600", marginBottom: 6, color: '#333' },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    padding: 14,
    borderRadius: 10,
    backgroundColor: "#F8FAFC",
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#2563EB",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 8
  },
  disabled: { backgroundColor: "#9CA3AF" },
  buttonText: { color: "white", fontWeight: "600", fontSize: 16 },
  loginLink: { marginTop: 16, alignSelf: "center", padding: 10 },
  loginText: { color: "#2563EB", fontWeight: "600" },
});