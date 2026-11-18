import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
} from "react-native";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!
);

export default function App() {
  const [articles, setArticles] = useState<any[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    loadArticles();
  }, []);

  async function loadArticles() {
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      setError(error.message);
      return;
    }

    setArticles(data || []);
  }

  if (selectedArticle) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <Pressable
            onPress={() => setSelectedArticle(null)}
          >
            <Text style={styles.back}>
              ← Back
            </Text>
          </Pressable>

          <Text style={styles.articleTitle}>
            {selectedArticle.title_en ||
              selectedArticle.title_ru ||
              selectedArticle.title}
          </Text>

          <Text style={styles.meta}>
            Source: {selectedArticle.source}
          </Text>

          <Text style={styles.meta}>
            Topic: {selectedArticle.topic}
          </Text>

          <Text style={styles.content}>
            {selectedArticle.content_en ||
              selectedArticle.content_ru ||
              selectedArticle.content}
          </Text>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.logo}>
          Cyprus News Network
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
          <Pressable
            key={article.id}
            onPress={() => setSelectedArticle(article)}
          >
            <View style={styles.card}>
              <Text style={styles.title}>
                {article.title_en ||
                  article.title_ru ||
                  article.title ||
                  "No Title"}
              </Text>

              <Text style={styles.meta}>
                {article.source}
              </Text>

              <Text style={styles.meta}>
                {article.topic}
              </Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#071733",
    padding: 20,
  },

  logo: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
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
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },

  title: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  meta: {
    color: "#cbd5e1",
    marginTop: 4,
  },

  back: {
    color: "#38bdf8",
    marginBottom: 20,
    fontSize: 18,
  },

  articleTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },

  content: {
    color: "#fff",
    fontSize: 16,
    lineHeight: 24,
    marginTop: 20,
  },
});
