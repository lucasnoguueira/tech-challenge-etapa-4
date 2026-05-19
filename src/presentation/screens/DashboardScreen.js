import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  RefreshControl,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { LineChart, PieChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../hooks/useAuth';
import { useDashboard } from '../hooks/useDashboard';
import BalanceCard from '../components/business/BalanceCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import COLORS from '../../core/constants/colors';

const chartConfig = {
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(38, 70, 83, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(100, 100, 100, ${opacity})`,
  style: { borderRadius: 16 },
  propsForDots: { r: '4', strokeWidth: '2', stroke: COLORS.primary },
  propsForBackgroundLines: { strokeDasharray: '', stroke: '#f0f0f0' },
};

/**
 * Tela do Dashboard.
 * Responsabilidade única: composição de UI usando hook useDashboard (SRP).
 */
export default function DashboardScreen() {
  const screenWidth = Dimensions.get('window').width;
  const { logout } = useAuth();
  const { balance, totalIncome, totalExpenses, lineData, pieData, loading, refreshing, onRefresh } =
    useDashboard();

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      Alert.alert('Erro', 'Não foi possível sair.');
    }
  };

  const hasLineData =
    lineData?.datasets?.[0]?.data?.length > 0 && lineData.datasets[0].data[0] !== 0;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />
      }
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Resumo Financeiro</Text>
          <Text style={styles.headerSubtitle}>Acompanhe sua saúde financeira</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={28} color={COLORS.secondary} />
        </TouchableOpacity>
      </View>

      {loading && !refreshing ? (
        <LoadingSpinner style={styles.loadingContainer} />
      ) : (
        <>
          <BalanceCard
            balance={balance}
            totalIncome={totalIncome}
            totalExpenses={totalExpenses}
          />

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Evolução do Saldo (Últimas 6)</Text>
            <View style={styles.card}>
              {hasLineData ? (
                <LineChart
                  data={lineData}
                  width={screenWidth - 72}
                  height={220}
                  chartConfig={chartConfig}
                  bezier
                  style={styles.chart}
                  withInnerLines={true}
                  withOuterLines={false}
                  withVerticalLines={false}
                />
              ) : (
                <EmptyState
                  icon="analytics-outline"
                  message="Sem dados suficientes para o gráfico"
                />
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
                  accessor="population"
                  backgroundColor="transparent"
                  paddingLeft="15"
                  absolute
                />
              ) : (
                <EmptyState
                  icon="pie-chart-outline"
                  message="Registre despesas para ver a distribuição"
                />
              )}
            </View>
          </View>
        </>
      )}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  loadingContainer: {
    height: 300,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 12,
    marginLeft: 4,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});
