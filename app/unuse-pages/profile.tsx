import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Settings, Bell, Lock, CircleHelp as HelpCircle, LogOut } from 'lucide-react-native';

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>

        <View style={styles.profileSection}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop' }}
            style={styles.avatar}
          />
          <Text style={styles.name}>John Doe</Text>
          <Text style={styles.email}>john.doe@example.com</Text>
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.menuItem}>
            <Settings size={24} color="#424242" />
            <Text style={styles.menuText}>Account Settings</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Bell size={24} color="#424242" />
            <Text style={styles.menuText}>Notifications</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Lock size={24} color="#424242" />
            <Text style={styles.menuText}>Privacy</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <HelpCircle size={24} color="#424242" />
            <Text style={styles.menuText}>Help & Support</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton}>
          <LogOut size={24} color="#F44336" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Version 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00BFA5',
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
    color: '#424242',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: '#757575',
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 24,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  menuText: {
    marginLeft: 16,
    fontSize: 16,
    color: '#424242',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  logoutText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#F44336',
    fontWeight: '600',
  },
  version: {
    textAlign: 'center',
    color: '#9E9E9E',
    fontSize: 14,
  },
});