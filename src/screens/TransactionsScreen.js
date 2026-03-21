import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  TextInput,
  Platform,
  ScrollView,
} from "react-native";
import { getTransactions } from "../services/transactionService";
import { useFocusEffect } from "@react-navigation/native";
// Picker removed
import { Ionicons } from "@expo/vector-icons";

// Mesmo esquema de cores do Dashboard para consistência
const COLORS = {
  primary: "#2A9D8F",
  secondary: "#E76F51",
  background: "#F4F6F8",
  card: "#FFFFFF",
  textDark: "#264653",
  textLight: "#8D99AE",
  accent: "#E9C46A",
};

export default function TransactionsScreen({ navigation }) {
  const [allTransactions, setAllTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [lastVisible, setLastVisible] = useState(null);
  const [errorMSG, setErrorMSG] = useState(null);

  // Filtros
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [categories, setCategories] = useState(["Todas"]);

  // Aplicar filtros localmente sempre que a lista ou os filtros mudarem
  useEffect(() => {
    let result = allTransactions;

    if (selectedCategory !== "Todas") {
      result = result.filter((t) => t.category === selectedCategory);
    }

    if (searchText) {
      const lower = searchText.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(lower) ||
          t.category.toLowerCase().includes(lower),
      );
    }

    setFilteredTransactions(result);
  }, [searchText, selectedCategory, allTransactions]);

  const loadTransactions = async (reset = false) => {
    if (loading) return;
    setLoading(true);

    try {
      const currentLastVisible = reset ? null : lastVisible;

      const { data, lastVisible: newLastVisible } =
        await getTransactions(currentLastVisible);

      let newData = [];
      if (reset) {
        newData = data;
      } else {
        newData = [...allTransactions, ...data];
      }

      setAllTransactions(newData);
      setLastVisible(newLastVisible);

      const cats = ["Todas", ...new Set(newData.map((item) => item.category))];
      // Atualiza categorias sem duplicar
      setCategories((prev) => Array.from(new Set([...prev, ...cats])));
    } catch (error) {
      console.log("Erro ao carregar transações:", error);
      setErrorMSG("Erro ao carregar dados. Verifique o Index no Firebase.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadTransactions(true);
    }, []),
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadTransactions(true);
  };

  const renderItem = ({ item }) => {
    let dateStr = "Data inválida";
    if (item.date && item.date.toDate) {
      dateStr = item.date.toDate().toLocaleDateString("pt-BR");
    } else if (item.date instanceof Date) {
      dateStr = item.date.toLocaleDateString("pt-BR");
    }

    const isExpense = item.amount < 0;

    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("AddTransaction", { transaction: item })
        }
        activeOpacity={0.7}
      >
        <View style={styles.card}>
          <View style={styles.cardIconContainer}>
            <View
              style={[
                styles.iconCircle,
                {
                  backgroundColor: isExpense
                    ? "rgba(231, 111, 81, 0.1)"
                    : "rgba(42, 157, 143, 0.1)",
                },
              ]}
            >
              <Ionicons
                name={isExpense ? "arrow-down" : "arrow-up"}
                size={20}
                color={isExpense ? COLORS.secondary : COLORS.primary}
              />
            </View>
          </View>

          <View style={styles.cardContent}>
            <Text style={styles.cardTitle} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={styles.cardCategory}>{item.category}</Text>
          </View>

          <View style={styles.cardRight}>
            <Text
              style={[
                styles.cardAmount,
                { color: isExpense ? COLORS.secondary : COLORS.primary },
              ]}
            >
              {isExpense ? "- " : "+ "}
              R$ {Math.abs(item.amount).toFixed(2)}
            </Text>
            <Text style={styles.cardDate}>{dateStr}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Extrato</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("AddTransaction")}
        >
          <Ionicons name="add" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      {errorMSG && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>
            Atenção: Configuração Necessária
          </Text>
          <Text style={styles.errorMessage}>
            {errorMSG} Clique no link no console do navegador para criar o
            índice.
          </Text>
        </View>
      )}

      <View style={styles.filterSection}>
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color={COLORS.textLight}
            style={{ marginRight: 8 }}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar transação..."
            value={searchText}
            onChangeText={setSearchText}
            placeholderTextColor={COLORS.textLight}
          />
        </View>

        <View style={styles.categoryFilterContainer}>
          <Text style={styles.filterLabel}>Categorias:</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryListContent}
          >
            {categories.map((cat, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.categoryChip,
                  selectedCategory === cat && styles.categoryChipSelected,
                ]}
                onPress={() => setSelectedCategory(cat)}
              >
                <Text
                  style={[
                    styles.categoryChipText,
                    selectedCategory === cat && styles.categoryChipTextSelected,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>

      <FlatList
        data={filteredTransactions}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
          />
        }
        onEndReached={() => {
          if (lastVisible && !searchText && selectedCategory === "Todas") {
            loadTransactions(false);
          }
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading && !refreshing ? (
            <ActivityIndicator size="small" color={COLORS.primary} />
          ) : null
        }
        ListEmptyComponent={
          !loading && (
            <View style={styles.emptyState}>
              <Ionicons
                name="wallet-outline"
                size={48}
                color={COLORS.textLight}
              />
              <Text style={styles.emptyText}>
                Nenhuma transação encontrada.
              </Text>
            </View>
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: COLORS.background,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.textDark,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  errorContainer: {
    padding: 10,
    backgroundColor: "#ffebee",
    marginHorizontal: 16,
    borderRadius: 8,
    marginBottom: 10,
  },
  errorTitle: {
    color: "#c62828",
    textAlign: "center",
    fontWeight: "bold",
  },
  errorMessage: {
    color: "#c62828",
    textAlign: "center",
    fontSize: 12,
  },
  filterSection: {
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 50,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  searchInput: {
    flex: 1,
    height: "100%",
    fontSize: 16,
    color: COLORS.textDark,
  },
  categoryFilterContainer: {
    marginTop: 8,
  },
  filterLabel: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 8,
    marginLeft: 4,
  },
  categoryListContent: {
    paddingRight: 20,
    paddingBottom: 4,
  },
  categoryChip: {
    backgroundColor: COLORS.card,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  categoryChipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryChipText: {
    fontSize: 14,
    color: COLORS.textLight,
    fontWeight: "500",
  },
  categoryChipTextSelected: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  cardIconContainer: {
    marginRight: 16,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textDark,
    marginBottom: 4,
  },
  cardCategory: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  cardRight: {
    alignItems: "flex-end",
  },
  cardAmount: {
    fontSize: 16,
    fontWeight: "700",
  },
  cardDate: {
    color: COLORS.textLight,
    fontSize: 12,
    marginTop: 4,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 50,
    opacity: 0.5,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: COLORS.textLight,
  },
});
