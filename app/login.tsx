// app/login.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { AutenticacaoService } from "../services/autenticacao"; 

export default function LoginScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Verifica se veio o parametro 'role' como 'rh'
  const roleParam = Array.isArray(params.role) ? params.role[0] : params.role;
  const isRh = roleParam === 'rh';

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isRh) {
      // setEmail
    } else {
      // setEmail
    }
  }, [isRh]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Atenção", "Por favor, preencha email e senha.");
      return;
    }

    setIsLoading(true);
    try {
      // Chama o serviço passando 'isRh' (true ou false)
      const tipoUsuario = await AutenticacaoService.loginWithCredentials(email, password, isRh);

      // Redireciona baseado no tipo retornado
      if (tipoUsuario === "ADMIN") {
        router.replace("/rh");
      } else {
        router.replace("/home");
      }
      
    } catch (error: any) {
      Alert.alert(
        "Erro no Login",
        error.message || "Não foi possível entrar."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Acesso {isRh ? 'Gestor' : 'Colaborador'}
      </Text>

      <TextInput
        style={styles.input}
        placeholder="E-mail"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={isLoading}>
        {isLoading ? (
            <ActivityIndicator color="#fff" />
        ) : (
            <Text style={styles.buttonText}>Entrar</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.back()} style={{marginTop: 20}}>
        <Text style={styles.link}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: "#111",
    justifyContent: "center", padding: 20,
  },
  title: {
    fontSize: 28, color: "#fff", marginBottom: 30,
    textAlign: "center", fontWeight: 'bold'
  },
  input: {
    width: "100%", padding: 12, backgroundColor: "#222",
    borderRadius: 8, marginBottom: 15, color: "#fff",
    borderWidth: 1, borderColor: '#333'
  },
  button: {
    width: "100%", padding: 15, backgroundColor: "#2563EB",
    borderRadius: 8, alignItems: "center", marginTop: 10,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: '600' },
  link: { color: "#AAA", textAlign: "center" },
});