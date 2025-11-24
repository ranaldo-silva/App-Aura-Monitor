// app/index.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'; 
import { Heart, Users, Shield, UserPlus } from 'lucide-react-native';
import { router } from 'expo-router';

// Componente auxiliar de Card
const Card = ({ icon: Icon, title, description }: { icon: typeof Heart, title: string, description: string }) => (
  <View style={welcomeStyles.featureCard}>
    <View style={welcomeStyles.iconWrapper}>
      <Icon size={32} color="#2563EB" />
    </View>
    <Text style={welcomeStyles.cardTitle}>{title}</Text>
    <Text style={welcomeStyles.cardDescription}>{description}</Text>
  </View>
);

export default function Welcome() {
  const handleLogin = (role: 'rh' | 'colaborador') => {
    router.push({
      pathname: '/login',
      params: { role },
    });
  };
  
  const handleRegister = () => {
      router.push('/register');
  };

  return (
    // View externa para garantir o fundo em toda a tela
    <View style={welcomeStyles.mainContainer}>
      
      {/* ScrollView permite rolar a tela */}
      <ScrollView 
        contentContainerStyle={welcomeStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={welcomeStyles.header}>
          <View style={welcomeStyles.appIcon}>
            <Heart size={48} color="white" />
          </View>
          <Text style={welcomeStyles.mainTitle}>Aura Monitor</Text>
          <Text style={welcomeStyles.subTitle}>
            Monitore seu bem-estar em ambientes híbridos de trabalho
          </Text>
        </View>

        <View style={welcomeStyles.featuresGrid}>
          <Card icon={Heart} title="Check-in Humor" description="Registre como você se sente com emojis intuitivos"/>
          <Card icon={Shield} title="Dados IoT" description="Monitore temperatura e qualidade do ambiente"/>
          <Card icon={Users} title="Pausas Ativas" description="Sugestões para otimizar sua produtividade"/>
        </View>

        <View style={welcomeStyles.ctaCard}>
          <Text style={welcomeStyles.ctaTitle}>Pronto para começar?</Text>
          <Text style={welcomeStyles.ctaDescription}>
            Faça login ou cadastre-se para monitorar seu bem-estar
          </Text>
          
          <TouchableOpacity 
            onPress={() => handleLogin('colaborador')} 
            style={welcomeStyles.employeeButton}
          >
            <Heart size={20} color="#2563EB" />
            <Text style={welcomeStyles.employeeButtonText}>Entrar como Colaborador</Text>
          </TouchableOpacity>
          
           <TouchableOpacity 
            onPress={handleRegister} 
            style={welcomeStyles.registerButton}
          >
            <UserPlus size={20} color="white" />
            <Text style={welcomeStyles.rhButtonText}>Criar Conta (Colaborador)</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={() => handleLogin('rh')} 
            style={welcomeStyles.rhButton}
          >
            <Shield size={20} color="white" />
            <Text style={welcomeStyles.rhButtonText}>Entrar como RH</Text>
          </TouchableOpacity>
        </View>

        {/* Espaço extra no final para não colar na borda da tela */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const welcomeStyles = StyleSheet.create({
  mainContainer: { 
    flex: 1, 
    backgroundColor: '#F7FAFC' 
  },
  scrollContent: { 
    paddingHorizontal: 24, 
    paddingTop: 60, 
    paddingBottom: 40 
  },
  header: { 
    alignItems: 'center', 
    marginBottom: 40 
  },
  appIcon: { 
    width: 80, 
    height: 80, 
    backgroundColor: '#3B82F6', 
    borderRadius: 24, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 16 
  },
  mainTitle: { 
    fontSize: 32, 
    fontWeight: 'bold', 
    color: '#1F2937', 
    marginBottom: 8,
    textAlign: 'center'
  },
  subTitle: { 
    fontSize: 16, 
    color: '#4B5563', 
    textAlign: 'center',
    paddingHorizontal: 10
  },
  featuresGrid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between', 
    marginBottom: 40, 
    gap: 10 
  },
  // largura para garantir que não quebre em telas muito pequenas
  featureCard: { 
    width: '100%', 
    minWidth: 100,
    flexBasis: '30%', 
    padding: 12, 
    backgroundColor: 'white', 
    borderRadius: 12, 
    shadowOpacity: 0.05, 
    shadowRadius: 5, 
    elevation: 1, 
    alignItems: 'center',
    marginBottom: 8
  },
  iconWrapper: { 
    width: 40, 
    height: 40, 
    backgroundColor: '#E0F2F1', 
    borderRadius: 8, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 8 
  },
  cardTitle: { 
    fontSize: 14, 
    fontWeight: 'bold', 
    color: '#1F2937', 
    textAlign: 'center', 
    marginBottom: 4 
  },
  cardDescription: { 
    fontSize: 10, 
    color: '#4B5563', 
    textAlign: 'center' 
  },
  ctaCard: { 
    backgroundColor: '#2563EB', 
    borderRadius: 16, 
    padding: 24, 
    alignItems: 'center', 
    marginTop: 20 
  },
  ctaTitle: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: 'white', 
    marginBottom: 8,
    textAlign: 'center'
  },
  ctaDescription: { 
    fontSize: 16, 
    color: '#BFDBFE', 
    textAlign: 'center', 
    marginBottom: 24 
  },
  employeeButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    height: 56, 
    backgroundColor: 'white', 
    borderRadius: 12, 
    width: '100%', 
    marginBottom: 12 
  },
  employeeButtonText: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#2563EB', 
    marginLeft: 8 
  },
  registerButton: {
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    height: 56, 
    backgroundColor: '#10B981', 
    borderRadius: 12, 
    width: '100%', 
    marginBottom: 12
  },
  rhButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    height: 56, 
    backgroundColor: 'transparent', 
    borderWidth: 2, 
    borderColor: 'white', 
    borderRadius: 12, 
    width: '100%', 
  },
  rhButtonText: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: 'white', 
    marginLeft: 8 
  },
});