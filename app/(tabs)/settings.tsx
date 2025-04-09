import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, Lock, User, CircleHelp as HelpCircle } from 'lucide-react-native';

export default function SettingsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>Manage your preferences</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <TouchableOpacity style={styles.settingItem}>
            <User size={24} color="#4B5563" />
            <Text style={styles.settingText}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <Lock size={24} color="#4B5563" />
            <Text style={styles.settingText}>Privacy</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <View style={styles.settingItem}>
            <Bell size={24} color="#4B5563" />
            <Text style={styles.settingText}>Daily Reminders</Text>
            <Switch
              value={true}
              onValueChange={() => {}}
              trackColor={{ false: '#D1D5DB', true: '#7C3AED' }}
              thumbColor="#FFFFFF"
              style={styles.switch}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <TouchableOpacity style={styles.settingItem}>
            <HelpCircle size={24} color="#4B5563" />
            <Text style={styles.settingText}>Help & FAQ</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.upgradeButton}>
          <Text style={styles.upgradeButtonText}>Upgrade to Pro</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Version 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  scrollContent: {
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
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 4,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingText: {
    fontSize: 16,
    color: '#4B5563',
    marginLeft: 16,
    flex: 1,
  },
  switch: {
    marginLeft: 'auto',
  },
  upgradeButton: {
    backgroundColor: '#7C3AED',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  upgradeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  version: {
    textAlign: 'center',
    color: '#6B7280',
    fontSize: 14,
  },
});