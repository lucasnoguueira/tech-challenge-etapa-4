import React, { useState, useCallback, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  RefreshControl,
  Alert,
  Platform,
  TouchableOpacity,
} from "react-native";
import { LineChart, PieChart } from "react-native-chart-kit";
import { useFocusEffect } from "@react-navigation/native";
import { getAllTransactions } from "../services/transactionService";
import { AuthContext } from "../contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";

// Paleta de cores moderna e profissional
const COLORS = {
  primary: "#2A9D8F", // Verde esmeralda (Saldo/Receita)
  secondary: "#E76F51", // Terracota (Despesas)
  background: "#F4F6F8", // Cinza muito suave
  card: "#FFFFFF",
  textDark: "#264653",
  textLight: "#8D99AE",
  chartColors: [
    "#2A9D8F", // Green
    "#E9C46A", // Yellow
    "#F4A261", // Orange
    "#E76F51", // Red
    "#264653", // Dark Blue
    "#457B9D", // Medium Blue
  ],
};

export default function DashboardScreen() {
  const screenWidth = Dimensions.get("window").width;
  const [refreshing, setRefreshing] = useState(false);
  const [balance, setBalance] = useState(0);
  const { logout } = useContext(AuthContext); // Hook do AuthContext

  const handleLogout = async () => {
    try {
      await logout();
      // A navegação/AuthStack irá lidar com o redirecionamento
    } catch (e) {
      console.error(e);
      Alert.alert("Erro", "Não foi possível sair.");
    }
  };

  // States para os gráficos
  const [lineData, setLineData] = useState({
    labels: ["Semana"],
    datasets: [
      {
        data: [0],
        color: (opacity = 1) => COLORS.primary,
        strokeWidth: 2,
      },
    ],
  });

  const [pieData, setPieData] = useState([]);

  const loadDashboardData = async () => {
    try {
      // Busca TODAS as transações para cálculo correto do saldo acumulado
      const data = await getAllTransactions();

      // 1. Calcular Saldo Total e Histórico
      // (getAllTransactions já retorna ordenado por data 'asc', mas mantemos segurança)
      const sortedData = [...data].sort((a, b) => {
        const dateA = a.date?.toDate ? a.date.toDate() : new Date(a.date);
        const dateB = b.date?.toDate ? b.date.toDate() : new Date(b.date);
        return dateA - dateB;
      });

      // Calcular o acumulado (saldo) passo a passo para o gráfico
      let runningBalance = 0;
      const historyData = sortedData.map((item) => {
        runningBalance += item.amount;
        return { ...item, balanceAfter: runningBalance };
      });

      // O saldo final é o último valor acumulado
      setBalance(runningBalance);

      // Agrupar gastos por categoria
      const categoryMap = {};
      data.forEach((t) => {
        if (t.amount < 0) {
          const cat = t.category || "Outros";
          if (!categoryMap[cat]) categoryMap[cat] = 0;
          categoryMap[cat] += Math.abs(t.amount);
        }
      });

      // 2. Preparar dados do Gráfico de Pizza (Categorias)
      const newPieData = Object.keys(categoryMap).map((cat, index) => ({
        name: cat,
        population: categoryMap[cat],
        color: COLORS.chartColors[index % COLORS.chartColors.length],
        legendFontColor: COLORS.textLight,
        legendFontSize: 12,
      }));
      setPieData(newPieData);

      // 3. Preparar dados do Gráfico de Linha (Evolução do Saldo)
      // Usamos o historyData que contém o saldo acumulado
      const recentTransactions = historyData.slice(-6);

      if (recentTransactions.length > 0) {
        const labels = recentTransactions.map((d) => {
          const dateObj = d.date?.toDate ? d.date.toDate() : new Date(d.date);
          return `${dateObj.getDate()}/${dateObj.getMonth() + 1}`;
        });

        // Alterado para mostrar o saldo acumulado (balanceAfter) em vez do valor da transação
        const values = recentTransactions.map((d) => d.balanceAfter);

        setLineData({
          labels: labels,
          datasets: [
            {
              data: values,
              color: (opacity = 1) => COLORS.primary,
              strokeWidth: 2,
            },
          ],
        });
      }
    } catch (e) {
      console.log(e);
      // Silenciar alerta em loop se não tiver índice ainda
      if (!refreshing) {
        // Log apenas no console para evitar spam de UI
      }
    } finally {
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadDashboardData();
    }, []),
  );

  const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(38, 70, 83, ${opacity})`, // Dark Blue text/lines
    labelColor: (opacity = 1) => `rgba(100, 100, 100, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "4",
      strokeWidth: "2",
      stroke: COLORS.primary,
    },
    propsForBackgroundLines: {
      strokeDasharray: "", // solid lines
      stroke: "#f0f0f0",
    },
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            loadDashboardData();
          }}
          colors={[COLORS.primary]}
        />
      }
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Resumo Financeiro</Text>
          <Text style={styles.headerSubtitle}>
            Acompanhe sua saúde financeira
          </Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={28} color={COLORS.secondary} />
        </TouchableOpacity>
      </View>

      <View style={[styles.card, styles.balanceCard]}>
        <Text style={styles.balanceLabel}>Saldo Atual</Text>
        <Text
          style={[
            styles.balanceValue,
            { color: balance >= 0 ? COLORS.primary : COLORS.secondary },
          ]}
        >
          {balance.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </Text>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Fluxo de Caixas (Últimos n)</Text>
        <View style={styles.card}>
          {lineData.datasets[0].data.length > 0 &&
          lineData.datasets[0].data[0] !== 0 ? (
            <LineChart
              data={lineData}
              width={screenWidth - 72} // Adjusted for padding (16*2 screen + 20*2 card)
              height={220}
              chartConfig={chartConfig}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
              withInnerLines={true}
              withOuterLines={false}
              withVerticalLines={false}
            />
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>
                Sem dados suficientes para o gráfico
              </Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Despesas por Categoria</Text>
        <View style={styles.card}>
          {pieData.length > 0 ? (
            <PieChart
              data={pieData}
              width={screenWidth - 72}
              height={220}
              chartConfig={chartConfig}
              accessor={"population"}
              backgroundColor={"transparent"}
              paddingLeft={"15"}
              center={[0, 0]}
              absolute
            />
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>
                Registre despesas para ver a distribuição
              </Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 16,
  },
  header: {
    marginVertical: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.textDark,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 4,
  },
  logoutButton: {
    padding: 8,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 20,
    elevation: 4, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  balanceCard: {
    marginBottom: 24,
    alignItems: "center",
    borderLeftWidth: 6,
    borderLeftColor: COLORS.primary,
  },
  balanceLabel: {
    fontSize: 14,
    color: COLORS.textLight,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  balanceValue: {
    fontSize: 36,
    fontWeight: "bold",
    letterSpacing: -1,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textDark,
    marginBottom: 12,
    marginLeft: 4,
  },
  emptyState: {
    height: 150,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: COLORS.textLight,
    fontStyle: "italic",
  },
});
