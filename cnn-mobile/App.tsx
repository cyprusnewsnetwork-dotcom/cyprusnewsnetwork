import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!
);

export default function App() {
  const [articles, setArticles] = useState<any[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    loadArticles();
  }, []);

  async function loadArticles() {
    try {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        setError(error.message);
        return;
      }

      setArticles(data || []);
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>CNN</Text>

        <Text style={styles.title}>
          CypRus News Network
        </Text>

        <Text style={styles.languages}>
          GR • EN • RU
        </Text>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.section}>
          Latest News
        </Text>

        <Text style={styles.counter}>
          Articles Loaded: {articles.length}
        </Text>

        {error !== "" && (
          <Text style={styles.error}>
            {error}
          </Text>
        )}

        {articles.map((article) => (
          <View
            key={article.id}
            style={styles.card}
          >
            <Text style={styles.cardTitle}>
              {article.title_en ||
                article.title_ru ||
                article.title ||
                "No title"}
            </Text>

            <Text style={styles.cardMeta}>
              Source: {article.source}
            </Text>

            <Text style={styles.cardMeta}>
              Topic: {article.topic}
            </Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#071733",
  },

  header: {
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 20,
  },

  logo: {
    color: "#fff",
    fontSize: 48,
    fontWeight: "bold",
  },

  title: {
    color: "#fff",
    fontSize: 20,
    marginTop: 10,
  },

  languages: {
    color: "#ccc",
    marginTop: 10,
  },

  content: {
    padding: 16,
  },

  section: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 10,
  },

  counter: {
    color: "#22c55e",
    marginBottom: 20,
  },

  error: {
    color: "#ef4444",
    marginBottom: 20,
  },

  card: {
    backgroundColor: "#1e293b",
    marginBottom: 12,
    padding: 16,
    borderRadius: 10,
  },

  cardTitle: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },

  cardMeta: {
    color: "#cbd5e1",
    marginTop: 5,
  },
});
