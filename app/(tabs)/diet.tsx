import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface FoodItem {
  name: string;
  description: string;
  icon: string;
}

interface WeeklyAnalysis {
  summary: string;
  healthScore: number;
  trends: {
    frequency: string;
    consistency: string;
    timing: string;
  };
  suggestions: string[];
}

const FOODS_TO_EAT: FoodItem[] = [
  {
    name: "Bananas",
    description: "Rich in fiber, helps with regularity",
    icon: "🍌"
  },
  {
    name: "Yogurt",
    description: "Probiotics for gut health",
    icon: "🥛"
  },
  {
    name: "Oatmeal",
    description: "Soluble fiber, improves digestion",
    icon: "🥣"
  },
  {
    name: "Leafy Greens",
    description: "Fiber and nutrients for gut health",
    icon: "🥬"
  }
];

const FOODS_TO_AVOID: FoodItem[] = [
  {
    name: "Processed Foods",
    description: "Low in fiber, can cause constipation",
    icon: "🍫"
  },
  {
    name: "Dairy Products",
    description: "May cause digestive discomfort",
    icon: "🥛"
  },
  {
    name: "Red Meat",
    description: "Hard to digest, can slow transit time",
    icon: "🥩"
  },
  {
    name: "Caffeine",
    description: "Can cause dehydration and irritation",
    icon: "☕"
  }
];

const MOCK_WEEKLY_ANALYSIS: WeeklyAnalysis = {
  summary: "Your bowel health this week has been generally good, with regular patterns and healthy consistency.",
  healthScore: 85,
  trends: {
    frequency: "Average 2 times per day, which is within the healthy range",
    consistency: "Mostly Type 4, indicating good digestive health",
    timing: "Most frequent between 8-10 AM, showing regular pattern"
  },
  suggestions: [
    "Maintain your current fiber intake level",
    "Consider having breakfast at consistent times",
    "Stay hydrated with 8 glasses of water daily",
    "Continue your regular exercise routine"
  ]
};

export default function DietScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Dietary Recommendations</Text>
        </View>

        <View style={styles.suggestionsCard}>
          <Text style={styles.suggestionsTitle}>Recommendations</Text>
          {MOCK_WEEKLY_ANALYSIS.suggestions.map((suggestion, index) => (
            <View key={index} style={styles.suggestionItem}>
              <Text style={styles.suggestionBullet}>•</Text>
              <Text style={styles.suggestionText}>{suggestion}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>🍽️</Text>
            <Text style={styles.sectionTitle}>Foods to Eat</Text>
          </View>
          <View style={styles.foodGrid}>
            {FOODS_TO_EAT.reduce((rows: any[], food: FoodItem, index: number) => {
              if (index % 2 === 0) {
                rows.push([food]);
              } else {
                rows[rows.length - 1].push(food);
              }
              return rows;
            }, []).map((row, rowIndex) => (
              <View key={rowIndex} style={styles.foodRow}>
                {row.map((food: FoodItem, index: number) => (
                  <View key={index} style={[styles.foodCard, { flex: 1, marginHorizontal: 4 }]}>
                    <Text style={styles.foodIcon}>{food.icon}</Text>
                    <View style={styles.foodInfo}>
                      <Text style={styles.foodName}>{food.name}</Text>
                      <Text style={styles.foodDescription}>{food.description}</Text>
                    </View>
                  </View>
                ))}
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>⚠️</Text>
            <Text style={styles.sectionTitle}>Foods to Avoid</Text>
          </View>
          <View style={styles.foodGrid}>
            {FOODS_TO_AVOID.reduce((rows: any[], food: FoodItem, index: number) => {
              if (index % 2 === 0) {
                rows.push([food]);
              } else {
                rows[rows.length - 1].push(food);
              }
              return rows;
            }, []).map((row, rowIndex) => (
              <View key={rowIndex} style={styles.foodRow}>
                {row.map((food: FoodItem, index: number) => (
                  <View key={index} style={[styles.foodCard, styles.avoidCard, { flex: 1, marginHorizontal: 4 }]}>
                    <Text style={styles.foodIcon}>{food.icon}</Text>
                    <View style={styles.foodInfo}>
                      <Text style={styles.foodName}>{food.name}</Text>
                      <Text style={styles.foodDescription}>{food.description}</Text>
                    </View>
                  </View>
                ))}
              </View>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save Recommendations</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
  },
  foodGrid: {
    flexDirection: 'column',
  },
  foodRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  foodCard: {
    flexDirection: 'column',
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    width: '48%',
    marginHorizontal: '1%',
  },
  avoidCard: {
    backgroundColor: '#FFEBEE',
  },
  foodIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  foodInfo: {
    width: '100%',
    alignItems: 'center',
  },
  foodName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
    textAlign: 'center',
  },
  foodDescription: {
    fontSize: 12,
    color: '#4B5563',
    textAlign: 'center',
    paddingHorizontal: 4,
  },
  saveButton: {
    backgroundColor: '#00BFA5',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  suggestionsCard: {
    backgroundColor: '#c0ebe8',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  suggestionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  suggestionItem: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'center',
  },
  suggestionBullet: {
    fontSize: 16,
    color: '#00BFA5',
    marginRight: 8,
    lineHeight: 20,
  },
  suggestionText: {
    flex: 1,
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
});