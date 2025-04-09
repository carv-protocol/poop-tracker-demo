// 移除 expo-health 导入
import { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Alert,
  Modal // 添加 Modal 导入
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, X, Activity } from 'lucide-react-native';
import { Calendar, DateData } from 'react-native-calendars';

const EXERCISE_OPTIONS = [
    { id: 'walking', label: 'Walking', emoji: '🚶‍♂️', unit: 'mins' },
    { id: 'running', label: 'Running', emoji: '🏃‍♂️', unit: 'mins' },
    { id: 'yoga', label: 'Yoga', emoji: '🧘‍♀️', unit: 'mins' },
    { id: 'swimming', label: 'Swimming', emoji: '🏊‍♂️', unit: 'mins' },
    { id: 'cycling', label: 'Cycling', emoji: '🚴‍♂️', unit: 'mins' },
  ];
  
  const MEAL_TYPES = [
    { id: 'breakfast', label: 'Breakfast', emoji: '🍳' },
    { id: 'lunch', label: 'Lunch', emoji: '🍱' },
    { id: 'dinner', label: 'Dinner', emoji: '🍽️' },
    { id: 'snacks', label: 'Snacks', emoji: '🍪' },
  ];
  
  const PERIOD_STATUS = [
    { id: 'light', label: 'Light', emoji: '💫' },
    { id: 'medium', label: 'Medium', emoji: '⭐' },
    { id: 'heavy', label: 'Heavy', emoji: '✨' },
  ];

// 添加健康数据类型定义
// 首先修改 HealthData 接口，添加 summary 属性
interface HealthData {
  id: string;
  type: string;
  value: number;
  unit: string;
  date: Date;
  description?: string;
  summary?: HealthSummary;  // 添加这一行
}

interface PeriodData {
    date: string;
    status: 'light' | 'medium' | 'heavy';
}

interface PeriodMarkedDates {
[date: string]: {
    marked: boolean;
    dotColor?: string;
    selected?: boolean;
    selectedColor?: string;
};
}
// 将接口定义移到文件顶部
interface HealthSummary {
  steps: number;
  sleep: {
    duration: number;
    quality: number;
    startTime: string;
    endTime: string;
  };
  activity: {
    current: number;
    target: number;
    duration: number;
    hourly: number;
  };
  water: {
    current: number;
    target: number;
  };
  mindful: {
    duration: number;
    weekLog: boolean[];
  };
}

interface HealthData {
  id: string;
  type: string;
  value: number;
  unit: string;
  date: Date;
  description?: string;
  summary?: HealthSummary;
}

export default function HealthScreen() {
  const [selectedSection, setSelectedSection] = useState('exercise');
  const [exerciseType, setExerciseType] = useState('');
  const [exerciseDuration, setExerciseDuration] = useState('');
  const [mealType, setMealType] = useState('');
  const [mealContent, setMealContent] = useState('');
  const [waterAmount, setWaterAmount] = useState('');
  const [periodStatus, setPeriodStatus] = useState('');
  const [medicine, setMedicine] = useState('');
  const [medicineDose, setMedicineDose] = useState('');
  const [healthData, setHealthData] = useState<HealthData[]>([]);
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [showManualInput, setShowManualInput] = useState(false);
  const [isHealthDataLoading, setIsHealthDataLoading] = useState(false);
  const [selectedPeriodDate, setSelectedPeriodDate] = useState<string>('');

  const [periodData, setPeriodData] = useState<PeriodData[]>(() => {
    const today = new Date();
    const mockPeriodDays: PeriodData[] = [];
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      if (i >= 3 && i <= 7) {
        mockPeriodDays.push({
          date: date.toISOString().split('T')[0],
          status: i === 5 ? 'heavy' : i === 4 ? 'medium' : 'light'
        });
      } else {
        mockPeriodDays.push({
          date: date.toISOString().split('T')[0],
          status: 'light'
        });
      }
    }
    return mockPeriodDays;
  });

  // 添加获取经期标记日期的函数
  const getPeriodMarkedDates = (): PeriodMarkedDates => {
    const marked: PeriodMarkedDates = {};
    const today = new Date();
    
    // 模拟最近14天的经期数据
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      // 模拟5天经期（从第3天到第7天）
      if (i >= 3 && i <= 7) {
        marked[dateString] = {
          marked: true,
          dotColor: '#FF69B4',
          selected: dateString === selectedPeriodDate,
          selectedColor: '#FFB6C1',
        };
      }
    }
    return marked;
  };
  
  const getHealthData = async () => {
    setIsHealthDataLoading(true);
    try {
      // 模拟延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 生成随机步数
      const randomSteps = Math.floor(Math.random() * 8000) + 2000; // 2000-10000 步
      const estimatedDuration = Math.round(randomSteps / 100);
      
      // 更新运动数据
      setExerciseType('walking');
      setExerciseDuration(String(estimatedDuration));
  
      Alert.alert(
        "Success",
        `Retrieved health data: ${randomSteps} steps today (${estimatedDuration} mins)`,
        [{ text: "OK" }]
      );
  
    } catch (error) {
      Alert.alert(
        "Error",
        "Failed to fetch health data",
        [{ text: "OK" }]
      );
    } finally {
      setIsHealthDataLoading(false);
    }
  };

  // 首先添加新的数据类型
  interface HealthSummary {
    steps: number;
    sleep: {
      duration: number;
      quality: number;
      startTime: string;
      endTime: string;
    };
    activity: {
      current: number;
      target: number;
      duration: number;
      hourly: number;
    };
    water: {
      current: number;
      target: number;
    };
    mindful: {
      duration: number;
      weekLog: boolean[];
    };
  }
  
  // 修改 mockHealthSync 函数
  const mockHealthSync = async () => {
    setIsHealthDataLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockData: HealthSummary = {
        steps: 4723,
        sleep: {
          duration: 7,
          quality: 92,
          startTime: '01:38',
          endTime: '10:08',
        },
        activity: {
          current: 210,
          target: 600,
          duration: 40,
          hourly: 8,
        },
        water: {
          current: 0,
          target: 2500,
        },
        mindful: {
          duration: 5,
          weekLog: [true, false, false, false, false, false, false],
        },
      };
      
      setHealthData([{
        id: Date.now().toString(),
        type: 'daily_summary',
        value: 0,
        unit: '',
        date: new Date(),
        summary: mockData,
      }]);
      setShowActionMenu(false);
    } catch (error) {
      Alert.alert("Error", "Failed to sync health data");
    } finally {
      setIsHealthDataLoading(false);
    }
  };

  const handleManualSave = () => {
    if (!exerciseType || !exerciseDuration) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    const newData: HealthData = {
      id: Date.now().toString(),
      type: exerciseType,
      value: parseInt(exerciseDuration),
      unit: 'mins',
      date: new Date(),
      description: `Manual ${exerciseType} record`,
    };

    setHealthData(prev => [newData, ...prev]);
    setShowManualInput(false);
    setExerciseType('');
    setExerciseDuration('');
    Alert.alert("Success", "Exercise record saved!");
  };

  // 添加渲染健康摘要的函数
  const renderHealthSummary = () => {
    if (healthData.length > 0 && healthData[0].type === 'daily_summary' && healthData[0].summary) {
      const summary = healthData[0].summary;
      return (
        <View style={styles.summaryGrid}>
          <View style={styles.summaryCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardIcon}>👣</Text>
              <Text style={styles.cardValue}>{summary.steps}</Text>
            </View>
            <Text style={styles.cardLabel}>of {4000} steps</Text>
          </View>

          <View style={styles.summaryCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardIcon}>💤</Text>
              <Text style={styles.cardMetrics}>
                {summary.sleep.duration}h {summary.sleep.quality}%
              </Text>
            </View>
            <Text style={styles.cardLabel}>Sleep Quality</Text>
            <Text style={styles.timeRange}>
              {summary.sleep.startTime} - {summary.sleep.endTime}
            </Text>
          </View>

          <View style={styles.summaryCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardIcon}>🔥</Text>
              <Text style={styles.cardValue}>
                {summary.activity.current}/{summary.activity.target}
              </Text>
            </View>
            <Text style={styles.cardLabel}>KCAL</Text>
            <Text style={styles.subMetrics}>
              {summary.activity.duration}min • {summary.activity.hourly}hr
            </Text>
          </View>

          <View style={styles.summaryCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardIcon}>💧</Text>
              <Text style={styles.cardValue}>
                {summary.water.current}ml
              </Text>
            </View>
            <Text style={styles.cardLabel}>of {summary.water.target}ml water</Text>
          </View>
        </View>
      );
    }
    return null;
  };

  // 添加经期日历渲染函数
  const renderPeriodCalendar = () => (
    <View style={styles.periodSection}>
      <Text style={styles.sectionTitle}>👩 Period Calendar</Text>
      <Calendar
        style={styles.calendar}
        markedDates={getPeriodMarkedDates()}
        onDayPress={(day: DateData) => setSelectedPeriodDate(day.dateString)}
        theme={{
        //   todayTextColor: '#FF69B4',
        //   selectedDayBackgroundColor: '#FFB6C1',
        //   selectedDayTextColor: '#000000',
        //   dotColor: '#FF69B4',
        //   indicatorColor: '#FF69B4',
            todayTextColor: '#FF69B4',
            selectedDayBackgroundColor: '#FFB6C1',
            selectedDayTextColor: '#000000',
            dotColor: '#FF69B4',
            indicatorColor: '#FF69B4',
            calendarBackground: '#FFFFFF',
            textDayFontSize: 14,
            textMonthFontSize: 16,
            textDayHeaderFontSize: 14,
            'stylesheet.calendar.main': {
            week: {
                marginTop: 7,
                marginBottom: 7,
                flexDirection: 'row',
                justifyContent: 'space-around'
            }
            }
        }}
      />
    </View>
  );

  // 修改 return 中的 ScrollView 内容
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Health Tracker</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {healthData.length === 0 ? (
          <View style={styles.emptyState}>
            <Activity size={64} color="#CCC" />
            <Text style={styles.emptyText}>No health data available</Text>
            <Text style={styles.emptySubtext}>Tap the + button to add data or sync from health app</Text>
          </View>
        ) : (
          <>
            {renderHealthSummary()}
            {healthData.filter(data => data.type !== 'daily_summary').length > 0 && (
              <View style={styles.dataGrid}>
                {healthData
                  .filter(data => data.type !== 'daily_summary')
                  .map(data => (
                    <View key={data.id} style={styles.dataCard}>
                      <Text style={styles.dataValue}>{data.value}</Text>
                      <Text style={styles.dataUnit}>{data.unit}</Text>
                      <Text style={styles.dataType}>{data.type}</Text>
                      <Text style={styles.dataDate}>
                        {data.date.toLocaleDateString()}
                      </Text>
                    </View>
                  ))}
              </View>
            )}
          </>
        )}
        {renderPeriodCalendar()}
      </ScrollView>

      <TouchableOpacity 
        style={styles.fab}
        onPress={() => setShowActionMenu(true)}>
        <Plus size={24} color="#FFF" />
      </TouchableOpacity>

      <Modal
        visible={showActionMenu}
        transparent
        animationType="fade"
        onRequestClose={() => setShowActionMenu(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.actionMenu}>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowActionMenu(false)}>
              <X size={24} color="#666"/>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={mockHealthSync}
              disabled={isHealthDataLoading}>
              <Text style={styles.actionButtonText}>
                {isHealthDataLoading ? "Syncing..." : "Sync Health Data"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => {
                setShowActionMenu(false);
                setShowManualInput(true);
              }}>
              <Text style={styles.actionButtonText}>Manual Input</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showManualInput}
        transparent
        animationType="slide"
        onRequestClose={() => setShowManualInput(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.inputModal}>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowManualInput(false)}>
              <X size={24} color="#666" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Record Exercise</Text>
            <View style={styles.optionsGrid}>
              {EXERCISE_OPTIONS.map(option => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.optionButton,
                    exerciseType === option.id && styles.optionButtonSelected
                  ]}
                  onPress={() => setExerciseType(option.id)}>
                  <Text style={styles.optionEmoji}>{option.emoji}</Text>
                  <Text style={styles.optionLabel}>{option.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              style={styles.input}
              placeholder="Duration (mins)"
              value={exerciseDuration}
              onChangeText={setExerciseDuration}
              keyboardType="numeric"
            />
            <TouchableOpacity 
              style={styles.saveButton}
              onPress={handleManualSave}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    padding: 16,
  },
  scrollContent: {
    padding: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4ECDC4',
  },
  tabBar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  tabSelected: {
    backgroundColor: '#E3F9F7',
    borderColor: '#4ECDC4',
  },
  tabText: {
    color: '#424242',
    fontSize: 14,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  optionButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    minWidth: 80,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  optionButtonSelected: {
    backgroundColor: '#E3F9F7',
    borderColor: '#4ECDC4',
  },
  optionEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  optionLabel: {
    fontSize: 14,
    color: '#616161',
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#4ECDC4',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  syncButton: {
    backgroundColor: '#4ECDC4',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  syncButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
  dataGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    padding: 12,
  },
  dataCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    width: '47%',
    height: '55%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dataValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4ECDC4',
  },
  dataUnit: {
    fontSize: 14,
    color: '#666',
  },
  dataType: {
    fontSize: 16,
    color: '#333',
    marginTop: 8,
  },
  dataDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4ECDC4',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionMenu: {
    width: '80%',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    alignItems: 'stretch',
  },
  actionButton: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#4ECDC4',
    marginVertical: 8,
  },
  actionButtonText: {
    color: '#FFF',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
  closeButton: {
    position: 'absolute',
    right: 2,
    top: 7,
    zIndex: 1,
    bottom: 25,
  },
  inputModal: {
    width: '90%',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 4,
  },
  summaryCard: {
    backgroundColor: '#F7FDFC',
    borderRadius: 16,
    padding: 12,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#E3F6F5',
    justifyContent: 'space-between', 
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardIcon: {
    fontSize: 20,
    marginRight: 6,
  },
  cardValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D3748',
    flex: 1,
    flexWrap: 'wrap',
  },
  cardMetrics: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    flex: 1,
    flexWrap: 'wrap',
  },
  cardLabel: {
    fontSize: 12,
    color: '#718096',
    marginTop: 2,
    flexWrap: 'wrap',
  },
  timeRange: {
    fontSize: 11,
    color: '#A0AEC0',
    marginTop: 6,
  },
  subMetrics: {
    fontSize: 11,
    color: '#718096',
    marginTop: 6,
  },
  barChart: {
    height: 40,
    marginTop: 8,
  },
  periodDays: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 8,
  },
  periodDay: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
  },
  
  periodInfo: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
  },
  periodSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  calendar: {
    borderRadius: 10,
    elevation: 4,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    padding: 10,
  },
});