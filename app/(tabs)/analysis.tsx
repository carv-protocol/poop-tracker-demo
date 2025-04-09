import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity, Modal, PanResponder,Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, DateData } from 'react-native-calendars';
import { LineChart, PieChart } from 'react-native-chart-kit';

const STOOL_IMAGES = {
  type1: require('../../assets/stool/type1.png'),
  type2: require('../../assets/stool/type2.png'),
  type3: require('../../assets/stool/type3.png'),
  type4: require('../../assets/stool/type4.png'),
  type5: require('../../assets/stool/type5.png'),
  type6: require('../../assets/stool/type6.png'),
  type7: require('../../assets/stool/type7.png'),
};
// 接口定义
interface HistoryData {
  count: number;
  type: number;
  conditions: string[];
  duration: string;
  time: string[];  // 改为数组以支持多个时间
  avgDuration: number;
  composition: {
    [key: string]: number;
  };
  hue: string;
  durationMin: number;
  smell: string;
  healthScore: number;
  images?: any[];
}

interface StatisticsData {
  healthScore: number;
  poopCount: number;
  poopTime: string[];
  avgDuration: number;
  avgInterval: number;
}

interface MarkedDates {
  [date: string]: {
    marked: boolean;
    dotColor: string;
    selected?: boolean;
    selectedColor?: string;
    customStyles?: {
      container?: {
        backgroundColor: string;
      };
      text?: {
        color: string;
      };
    };
  };
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

// 数据定义
const chartData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      data: [4, 3, 4, 4, 3, 5, 4],
      color: (opacity = 1) => `rgba(124, 58, 237, ${opacity})`,
      strokeWidth: 2,
    },
  ],
};

const MOCK_STATISTICS = {
  weekly: {
    healthScore: 88,
    poopCount: 14,
    poopTime: ['08:30', '12:30', '19:30'],
    avgDuration: 5.2,
    avgInterval: 12.5
  },
  monthly: {
    healthScore: 85,
    poopCount: 62,
    poopTime: ['08:15', '13:00', '20:00'],
    avgDuration: 4.8,
    avgInterval: 11.8
  }
};

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

// 工具函数
const getCurrentWeekDates = () => {
  const today = new Date();
  const dates: Record<string, HistoryData> = {};
  
  for(let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateString = date.toISOString().split('T')[0];
    // 先生成次数
    const count = Math.floor(Math.random() * 3) + 1;
    // 根据次数生成对应数量的时间
    const times: string[] = [];
    for(let j = 0; j < count; j++) {
      // 早上7点到晚上10点之间随机生成时间
      const hour = Math.floor(Math.random() * 15) + 7;
      const minute = Math.floor(Math.random() * 60).toString().padStart(2, '0');
      times.push(`${hour}:${minute}`);
    }
    // 按时间排序
    times.sort((a, b) => {
      const timeA = Number(a.replace(':', ''));
      const timeB = Number(b.replace(':', ''));
      return timeA - timeB;
    });

    // 生成对应数量的图片
    const images = Array(count).fill(null).map(() => {
      const typeNum = Math.floor(Math.random() * 7) + 1;
      return STOOL_IMAGES[`type${typeNum}` as keyof typeof STOOL_IMAGES];
    });
    dates[dateString] = {
      count: count,
      type: Math.floor(Math.random() * 3) + 3,
      conditions: ['After Coffee', 'After Meal', 'Morning Routine'][Math.floor(Math.random() * 3)].split(','),
      duration: ['1-2m', '2-5m', '5-10m'][Math.floor(Math.random() * 3)],
      time: times,
      avgDuration: Math.floor(Math.random() * 5) + 3,
      composition: {
        'Separate hard lumps': 10,
        'Like a sausage with cracks': 20,
        'Soft blobs with clear edges': 30,
        'Entirely liquid': 40
      },
      hue: ['Brown', 'Dark Brown', 'Light Brown'][Math.floor(Math.random() * 3)],
      durationMin: parseFloat((Math.random() * 5 + 2).toFixed(1)),
      smell: ['Normal', 'Strong', 'Mild'][Math.floor(Math.random() * 3)],
      healthScore: Math.floor(Math.random() * 20) + 80,
      images: images,
    };
  }
  return dates;
};

const getTypeColor = (type: number) => {
  switch(type) {
    case 3: return '#E0F2F1';
    case 4: return '#B2DFDB';
    case 5: return '#80CBC4';
    default: return '#FFFFFF';
  }
};

const MOCK_HISTORY = getCurrentWeekDates();

// 主组件
export default function AnalysisScreen() {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [timeRange, setTimeRange] = useState<'weekly' | 'monthly'>('weekly');
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const getMarkedDates = (): MarkedDates => {
    const marked: MarkedDates = {};
    Object.entries(MOCK_HISTORY).forEach(([date, data]) => {
      marked[date] = {
        marked: true,
        dotColor: '#00BFA5',
        selected: date === selectedDate,
        selectedColor: getTypeColor(data.type),
        customStyles: {
          container: {
            backgroundColor: getTypeColor(data.type)
          },
          text: {
            color: '#1F2937'
          }
        }
      };
    });
    return marked;
  };

  const switchDate = (direction: 'prev' | 'next') => {
    if (!selectedDate) return;
    
    const currentDate = new Date(selectedDate);
    const newDate = new Date(currentDate);
    
    if (direction === 'prev') {
      newDate.setDate(currentDate.getDate() - 1);
    } else {
      newDate.setDate(currentDate.getDate() + 1);
    }
    
    const dateString = newDate.toISOString().split('T')[0];
    if (MOCK_HISTORY[dateString]) {
      setSelectedDate(dateString);
    }
  };

  const handleDayPress = (day: DateData) => {
    setSelectedDate(day.dateString);
    if (MOCK_HISTORY[day.dateString]) {
      setShowModal(true);
    }
  };

  const renderModal = () => {
    if (!selectedDate || !MOCK_HISTORY[selectedDate]) return null;
    const data = MOCK_HISTORY[selectedDate];

    const pieData = Object.entries(data.composition).map(([name, value], index) => {
      const isSelected = name === selectedType;
      return {
        name: name.split(' ').join('\n'), // 将长文本分行显示
        value,
        color: isSelected ? '#00BFA5' : ['#FFA07A', '#98FB98', '#87CEEB', '#DDA0DD'][index],
        legendFontColor: isSelected ? '#00BFA5' : '#7F7F7F',
        legendFontSize: 11,
      };
    });

    return (
      <Modal
        visible={showModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowModal(false)}>
        <View style={modalStyles.modalOverlay}>
          <ScrollView style={modalStyles.modalScroll} 
            contentContainerStyle={modalStyles.scrollContent}
            showsVerticalScrollIndicator={false}
            {...PanResponder.create({
              onMoveShouldSetPanResponder: (evt, gestureState) => {
                return Math.abs(gestureState.dx) > 50;
              },
              onPanResponderRelease: (evt, gestureState) => {
                if (gestureState.dx > 50) {
                  switchDate('prev');
                } else if (gestureState.dx < -50) {
                  switchDate('next');
                }
              },
            }).panHandlers}
            >
            <View style={modalStyles.modalContent}>
              <View style={modalStyles.dateNavigation}>
                <TouchableOpacity 
                  style={modalStyles.dateButton}
                  onPress={() => switchDate('prev')}>
                  <Text style={modalStyles.dateButtonText}>←</Text>
                </TouchableOpacity>
                <Text style={modalStyles.modalTitle}>{selectedDate}</Text>
                <TouchableOpacity 
                  style={modalStyles.dateButton}
                  onPress={() => switchDate('next')}>
                  <Text style={modalStyles.dateButtonText}>→</Text>
                </TouchableOpacity>
              </View>
              <View style={modalStyles.modalContent}>
                {/* <Text style={modalStyles.modalTitle}>{selectedDate} Details</Text> */}
                
                <View style={modalStyles.scoreSection}>
                  <Text style={modalStyles.scoreValue}>{data.healthScore}</Text>
                  <Text style={modalStyles.scoreLabel}>Health Score</Text>
                </View>

                <View style={modalStyles.detailsSection}>
                  <View style={styles.detailsRow}>
                    <Text style={styles.detailsLabel}>Frequency:</Text>
                    <Text style={styles.detailsValue}>{data.count} 次</Text>
                  </View>
                  
                  <View style={styles.detailsRow}>
                    <Text style={styles.detailsLabel}>Doo Doo Time:</Text>
                    <View style={styles.timeList}>
                      {data.time.map((t, i) => (
                        <Text key={i} style={styles.timeTag}>{t}</Text>
                      ))}
                    </View>
                  </View>

                  <View style={styles.detailsRow}>
                    <Text style={styles.detailsLabel}>Avg. Duration:</Text>
                    <Text style={styles.detailsValue}>{data.avgDuration} mins</Text>
                  </View>

                  <View style={styles.detailsRow}>
                    <Text style={styles.detailsLabel}>Min Duration:</Text>
                    <Text style={styles.detailsValue}>{data.durationMin} mins</Text>
                  </View>

                  <View style={styles.detailsRow}>
                    <Text style={styles.detailsLabel}>Color:</Text>
                    <Text style={styles.detailsValue}>{data.hue}</Text>
                  </View>

                  <View style={styles.detailsRow}>
                    <Text style={styles.detailsLabel}>Smell:</Text>
                    <Text style={styles.detailsValue}>{data.smell}</Text>
                  </View>

                  <View style={styles.detailsRow}>
                    <Text style={styles.detailsLabel}>Conditions:</Text>
                    <View style={styles.conditionsList}>
                      {data.conditions.map((condition, index) => (
                        <Text key={index} style={styles.conditionTag}>{condition}</Text>
                      ))}
                    </View>
                  </View>

                  <View style={styles.detailsRow}>
                    <Text style={styles.detailsLabel}>Stool Type:</Text>
                    <View style={styles.photoGrid}>
                      {data.images?.map((img, index) => (
                        <Image
                          key={index}
                          source={img}
                          style={styles.thumbnail}
                          resizeMode="contain"
                        />
                      ))}
                    </View>
                  </View>
                </View>

                <View style={modalStyles.chartSection}>
                  <Text style={modalStyles.chartTitle}>Stool Type Distribution</Text>
                  <PieChart
                    data={pieData}
                    width={300}
                    height={200}
                    chartConfig={{
                      color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    }}
                    accessor="value"
                    backgroundColor="transparent"
                    paddingLeft="15"
                    center={[10, 0]}
                    absolute
                    hasLegend={true}
                  />
                </View>

                <TouchableOpacity 
                  style={modalStyles.closeButton}
                  onPress={() => setShowModal(false)}>
                  <Text style={modalStyles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
    );
  };

  // 添加统计报表渲染函数
  const renderStatistics = () => {
    const data = MOCK_STATISTICS[timeRange];
    return (
      <View style={styles.statisticsContainer}>
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tabButton, timeRange === 'weekly' && styles.activeTab]}
            onPress={() => setTimeRange('weekly')}>
            <Text style={[styles.tabText, timeRange === 'weekly' && styles.activeTabText]}>Weekly</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tabButton, timeRange === 'monthly' && styles.activeTab]}
            onPress={() => setTimeRange('monthly')}>
            <Text style={[styles.tabText, timeRange === 'monthly' && styles.activeTabText]}>Monthly</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Health Score</Text>
            <Text style={styles.statValue}>{data.healthScore}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Poop Count</Text>
            <Text style={styles.statValue}>{data.poopCount}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Peak Time</Text>
            <Text style={styles.statValue}>{data.poopTime[0]}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Avg. Duration</Text>
            <Text style={styles.statValue}>{data.avgDuration}min</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Avg. Interval</Text>
            <Text style={styles.statValue}>{data.avgInterval}h</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderWeeklyAnalysis = () => {
    return (
      <View style={styles.analysisContainer}>
        <View style={styles.scoreCard}>
          <Text style={styles.scoreTitle}>Weekly Health Score</Text>
          <Text style={styles.scoreValue}>{MOCK_WEEKLY_ANALYSIS.healthScore}</Text>
          <Text style={styles.scoreSummary}>{MOCK_WEEKLY_ANALYSIS.summary}</Text>
        </View>

        <View style={styles.trendsCard}>
          <Text style={styles.trendsTitle}>Weekly Trends</Text>
          <View style={styles.trendItem}>
            <Text style={styles.trendLabel}>Frequency</Text>
            <Text style={styles.trendValue}>{MOCK_WEEKLY_ANALYSIS.trends.frequency}</Text>
          </View>
          <View style={styles.trendItem}>
            <Text style={styles.trendLabel}>Consistency</Text>
            <Text style={styles.trendValue}>{MOCK_WEEKLY_ANALYSIS.trends.consistency}</Text>
          </View>
          <View style={styles.trendItem}>
            <Text style={styles.trendLabel}>Timing</Text>
            <Text style={styles.trendValue}>{MOCK_WEEKLY_ANALYSIS.trends.timing}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={baseStyles.container}>
      <ScrollView contentContainerStyle={baseStyles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Health Analysis</Text>
          <TouchableOpacity 
            style={styles.toggleButton}
            onPress={() => setShowCalendar(!showCalendar)}>
            <Text style={styles.toggleButtonText}>
              {showCalendar ? 'View Trends' : 'View Calendar'}
            </Text>
          </TouchableOpacity>
        </View>

        {showCalendar ? (
          <>
            <Calendar
              style={styles.calendar}
              markedDates={getMarkedDates()}
              onDayPress={handleDayPress}
              theme={{
                todayTextColor: '#00BFA5',
                selectedDayBackgroundColor: 'transparent',
                selectedDayTextColor: '#000000',
              }}
            />
            {renderModal()}
            {renderWeeklyAnalysis()}
          </>
        ) : (
          <>
            <View style={styles.chartCard}>
              <Text style={styles.chartTitle}>Weekly Bristol Scale Trend</Text>
              <LineChart
                data={chartData}
                width={Dimensions.get('window').width - 32}
                height={220}
                chartConfig={{
                  backgroundColor: '#FFFFFF',
                  backgroundGradientFrom: '#FFFFFF',
                  backgroundGradientTo: '#FFFFFF',
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(124, 58, 237, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(31, 41, 55, ${opacity})`,
                  propsForDots: {
                    r: '6',
                    strokeWidth: '2',
                    stroke: '#FFFFFF'
                  }
                }}
                bezier
                style={styles.chart}
              />
            </View>
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <Text style={styles.statTitle}>Average Type</Text>
                <Text style={styles.statValue}>4.0</Text>
                <Text style={styles.statDescription}>Healthy Range</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statTitle}>Consistency</Text>
                <Text style={styles.statValue}>85%</Text>
                <Text style={styles.statDescription}>Regular Pattern</Text>
              </View>
            </View>
          </>
        )}
        { renderStatistics() }
      </ScrollView>
    </SafeAreaView>
  );
}

// 样式定义
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  statTitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#7C3AED',
    marginBottom: 4,
  },
  statDescription: {
    fontSize: 14,
    color: '#4B5563',
  },
  insightsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
  },
  insightsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  insightText: {
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 24,
  },
  calendar: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 8,
    marginBottom: 16,
  },
  toggleButton: {
    backgroundColor: '#E0F2F1',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  toggleButtonText: {
    color: '#00BFA5',
    fontWeight: '600',
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  analysisContainer: {
    marginTop: 16,
  },
  scoreCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  scoreTitle: {
    fontSize: 18,
    color: '#4B5563',
    marginBottom: 8,
  },
  scoreValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#00BFA5',
    marginBottom: 8,
  },
  scoreSummary: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  trendsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  trendsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  trendItem: {
    marginBottom: 12,
  },
  trendLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  trendValue: {
    fontSize: 16,
    color: '#1F2937',
  },
  suggestionsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
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
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    alignItems: 'center',
  },
  detailsLabel: {
    fontSize: 16,
    color: '#6B7280',
  },
  detailsValue: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
  },
  timeList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeTag: {
    backgroundColor: '#E0F2F1',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    color: '#00BFA5',
  },
  conditionsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  conditionTag: {
    backgroundColor: '#F0F4F8',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    color: '#4A5568',
  },
  statisticsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    padding: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#00BFA5',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  statLabel: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 8,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingVertical: 8,
    marginLeft: 8, // 添加左边距
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
});

// 基础样式定义
const baseStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  statTitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#7C3AED',
    marginBottom: 4,
  },
  statDescription: {
    fontSize: 14,
    color: '#4B5563',
  },
  insightsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
  },
  insightsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  insightText: {
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 24,
  },
  calendar: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 8,
    marginBottom: 16,
  },
  toggleButton: {
    backgroundColor: '#E0F2F1',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  toggleButtonText: {
    color: '#00BFA5',
    fontWeight: '600',
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  analysisContainer: {
    marginTop: 16,
  },
  scoreCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  scoreTitle: {
    fontSize: 18,
    color: '#4B5563',
    marginBottom: 8,
  },
  scoreValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#00BFA5',
    marginBottom: 8,
  },
  scoreSummary: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  trendsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  trendsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  trendItem: {
    marginBottom: 12,
  },
  trendLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  trendValue: {
    fontSize: 16,
    color: '#1F2937',
  },
  suggestionsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
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
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  detailsLabel: {
    fontSize: 16,
    color: '#6B7280',
  },
  detailsValue: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
  }
});

// Modal 专用样式
const modalStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalScroll: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '100%',
    maxHeight: '90%',
  },
  scrollContent: {
    flexGrow: 1,
  },
  modalContent: {
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
  },
  scoreSection: {
    alignItems: 'center',
    marginVertical: 16,
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#00BFA5',
  },
  scoreLabel: {
    fontSize: 16,
    color: '#666',
  },
  detailsSection: {
    marginVertical: 16,
  },
  chartContainer: {
    alignItems: 'center',
    paddingRight: 20,
    minHeight: 280, // 确保有足够空间显示图表和图例
  },
  chartSection: {
    marginVertical: 16,
    // alignItems: 'center',
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  closeButton: {
    backgroundColor: '#00BFA5',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  dateNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  dateButton: {
    padding: 10,
  },
  dateButtonText: {
    fontSize: 24,
    color: '#00BFA5',
  },
});
