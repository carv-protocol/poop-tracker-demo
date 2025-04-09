import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform, Modal, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera, ImagePlus } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { CameraView } from 'expo-camera';
import { Animated, PanResponder } from 'react-native';
import { Trash2, Plus, Mic } from 'lucide-react-native';

const POOP_MASCOT = 'https://static.readdy.ai/image/078daee1073e3d1425b8c30e3c7b0709/75caa6fe61f736ccdd5392042444b253.png' //'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=400&h=400&fit=crop';

interface StoolType {
  id: number;
  name: string;
  description: string;
  image: any;
  status: string;
}
// 添加分析结果的接口定义
interface AnalysisResult {
  indicators: {
    color: {
      status: string;
      interpretation: string;
    };
    shape: {
      status: string;
      interpretation: string;
    };
    texture: {
      status: string;
      interpretation: string;
    };
    undigested: {
      status: string;
      interpretation: string;
    };
    feeling: {
      status: string;
      interpretation: string;
    };
  };
}

const STOOL_COLORS = [
  { id: 'brown', label: 'Brown', value: 'Brown', color: '#8B4513', textColor: '#FFFFFF' },
  { id: 'green', label: 'Green', value: 'Green', color: '#228B22', textColor: '#000000' },
  { id: 'red', label: 'Red', value: 'Red', color: '#CD5C5C', textColor: '#FFFFFF' },
  { id: 'black', label: 'Black', value: 'Black', color: '#2F4F4F', textColor: '#FFFFFF' },
  { id: 'yellow', label: 'Yellow', value: 'Yellow', color: '#DAA520', textColor: '#000000' },
  { id: 'clay', label: 'Clay', value: 'Clay', color: '#D3D3D3', textColor: '#000000' },
];

const STOOL_COMPOSITIONS = [
  { id: '1', label: 'Type 1', description: 'Separate hard lumps', emoji: '💩' },
  { id: '2', label: 'Type 2', description: 'Sausage-shaped but lumpy', emoji: '💩' },
  { id: '3', label: 'Type 3', description: 'Like a sausage with cracks', emoji: '💩' },
  { id: '4', label: 'Type 4', description: 'Smooth and soft', emoji: '💩' },
  { id: '5', label: 'Type 5', description: 'Soft blobs with clear edges', emoji: '💩' },
  { id: '6', label: 'Type 6', description: 'Fluffy pieces, mushy', emoji: '💩' },
  { id: '7', label: 'Type 7', description: 'Entirely liquid', emoji: '💩' },
];

const STOOL2_COMPOSITIONS = [
  {
    id: 1,
    name: 'Separate Hard Lumps',
    description: 'Separate hard lumps',
    image: require('../../assets/stool/type1.png'),
    status: 'Constipation',
  },
  {
    id: 2,
    name: 'Lumpy Sausage',
    description: 'Sausage-shaped but lumpy',
    image: require('../../assets/stool/type2.png'),
    status: 'Mild Constipation',
  },
  {
    id: 3,
    name: 'Cracked Sausage',
    description: 'Like a sausage with cracks',
    image: require('../../assets/stool/type3.png'),
    status: 'Normal',
  },
  {
    id: 4,
    name: 'Smooth Sausage',
    description: 'Like a sausage, smooth and soft',
    image: require('../../assets/stool/type4.png'),
    status: 'Normal',
  },
  {
    id: 5,
    name: 'Soft Blobs',
    description: 'Soft blobs with clear-cut edges',
    image: require('../../assets/stool/type5.png'),
    status: 'Mild Diarrhea',
  },
  {
    id: 6,
    name: 'Fluffy Pieces',
    description: 'Fluffy pieces with ragged edges',
    image: require('../../assets/stool/type6.png'),
    status: 'Diarrhea',
  },
  {
    id: 7,
    name: 'Liquid',
    description: 'Watery, no solid pieces',
    image: require('../../assets/stool/type7.png'),
    status: 'Severe Diarrhea',
  },
];

const SMELL_OPTIONS = [
  { id: 'ghosty', label: 'Ghosty', emoji: '👻' },
  { id: 'sniffy', label: 'Sniffy', emoji: '🐽' },
  { id: 'whiffy', label: 'Whiffy', emoji: '💨' },
  { id: 'funky', label: 'Funky', emoji: '🧅' },
  { id: 'doomy', label: 'Doomy', emoji: '☠️' },
];

const DURATION_OPTIONS = [
  { id: '1-2m', label: '1-2m', emoji: '⌛' },
  { id: '2-5m', label: '2-5m', emoji: '⏰' },
  { id: '5-10m', label: '5-10m', emoji: '⏱️' },
  { id: '>10m', label: '>10m', emoji: '📅' },
];

const CONDITION_OPTIONS = [
  { id: 'coffee', label: 'After coffee', emoji: '☕' },
  { id: 'meal', label: 'After meal', emoji: '🍽️' },
  { id: 'holy', label: 'Holy Shit', emoji: '😇' },
  { id: 'crampy', label: 'Crampy', emoji: '⚡' },
  { id: 'farts', label: 'Farts', emoji: '💨' },
  { id: 'strawb', label: 'Strawb-poop', emoji: '🩸' },
  { id: 'nuclear', label: 'Nuclear', emoji: '☠️' },
  { id: 'stubborn', label: 'stubborn than your ex', emoji: '🍆' },
  { id: 'beethoven', label: 'Beethoven’s 5th', emoji: '🎧ྀི' },
];

// 修改 WATER_OPTIONS
const WATER_OPTIONS = [
  { id: 'low', label: 'Low (<500ml)', emoji: '💧' },
  { id: 'medium', label: 'Medium (500-1000ml)', emoji: '🚰' },
  { id: 'high', label: 'High (>1000ml)', emoji: '🌊' },
];

// 添加状态颜色辅助函数
const getStatusColor = (status: string) => {
  switch (status) {
    case 'Constipation':
    case 'Mild Constipation':
      return '#E65100';
    case 'Normal':
      return '#2E7D32';
    case 'Mild Diarrhea':
      return '#F57C00';
    case 'Diarrhea':
    case 'Severe Diarrhea':
      return '#C62828';
    default:
      return '#757575';
  }
};

export default function HomeScreen() {
  const [selectedSmell, setSelectedSmell] = useState('');
  const [selectedDuration, setSelectedDuration] = useState('');
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [selectedWater, setSelectedWater] = useState('');
  const [stoolColor, setStoolColor] = useState('');
  const [stoolComposition, setStoolComposition] = useState('');
  const [entries, setEntries] = useState<Array<{
    id: number;
    date: Date;
    smell: string;
    duration: string;
    conditions: string[];
    water: string;
    image: string | null;
  }>>([]);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  // 添加一个 Toast 组件状态
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAnalyzingModal, setShowAnalyzingModal] = useState(false);
  const [isImageBlurred, setIsImageBlurred] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showActionSheet, setShowActionSheet] = useState(false);

  // 添加语音输入处理函数
  const startVoiceInput = async () => {
    setIsRecording(true);
    // 模拟语音识别过程
    setTimeout(() => {
      setIsRecording(false);
      setIsAnalyzing(true);
      setShowAnalyzingModal(true);
      setAnalysisResult(null);

      // 模拟分析过程
      setTimeout(() => {
        setAnalysisResult({
          indicators: {
            color: {
              status: "Voice input processed",
              interpretation: "Analysis based on voice description"
            },
            shape: {
              status: "Description processed",
              interpretation: "Shape analysis from voice input"
            },
            texture: {
              status: "Voice details analyzed",
              interpretation: "Texture analysis from description"
            },
            undigested: {
              status: "Voice input analyzed",
              interpretation: "Analysis of described contents"
            },
            feeling: {
              status: "Mood detected from voice",
              interpretation: "Analysis of emotional state"
            }
          }
        });
        setIsAnalyzing(false);
        setShowAnalyzingModal(false);
      }, 3000);
    }, 2000);
  };

  const toggleCondition = (id: string) => {
    setSelectedConditions(prev => 
      prev.includes(id) 
        ? prev.filter(c => c !== id)
        : [...prev, id]
    );
  };
  
  // 在组件内添加新的状态
  const [uploadCount, setUploadCount] = useState(0);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  
  // 修改 handleMascotPress 函数
  const handleMascotPress = () => {
    if (uploadCount >= 3) {
      setShowUpgradeModal(true);
      return;
    }
    setShowImagePicker(true);
  };
  
  // 修改 pickImage 函数
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
  
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setUploadCount(prev => prev + 1);
      setShowImagePicker(false);
      setIsAnalyzing(true);
      setShowAnalyzingModal(true);
      setAnalysisResult(null);

      const analysisTime = Math.random() * 3000 + 3000; // 3-6秒随机时间
      await new Promise(resolve => setTimeout(resolve, analysisTime));
      // 模拟 AI 分析结果
      setAnalysisResult({
        indicators: {
          color: {
            status: "Normal brown with slight dark spots",
            interpretation: "Normal digestion, no signs of bleeding"
          },
          shape: {
            status: "Irregular + firm lumps",
            interpretation: "Signs of constipation/pre-constipation"
          },
          texture: {
            status: "Hard with cracks",
            interpretation: "Dehydration or lack of fiber"
          },
          undigested: {
            status: "Visible particles present",
            interpretation: "Possible digestive or absorption issues"
          },
          feeling: {
            status: "(To be supplemented)",
            interpretation: "Can evaluate fatigue, discomfort, etc."
          }
        }
      });
      setIsAnalyzing(false);
      setShowAnalyzingModal(false);
    }
    setShowImagePicker(false);
  };
  
  // 在 return 语句中添加升级弹窗
  const takePhoto = async () => {
    setShowCamera(true);
    setShowImagePicker(false);
  };

  const deleteEntry = (id: number) => {
    setEntries(prev => prev.filter(entry => entry.id !== id));
  };

  const StoolTypeCard = ({ type,isSelected }: { type: StoolType; isSelected: boolean }) => (
    <View style={[
      styles.stoolCard,
      isSelected && styles.stoolCardSelected
    ]}>
      <Image 
        source={type.image}
        style={styles.stoolImage}
        resizeMode="contain"
      />
      <View style={styles.stoolInfo}>
        <Text style={styles.stoolDescription}>{type.description}</Text>
        <View style={[styles.statusTag, { backgroundColor: getStatusColor(type.status) }]}>
          <Text style={styles.stoolTypeStatusText}>{type.status}</Text>
        </View>
      </View>
    </View>
  );

  if (showCamera) {
    return (
      <View style={styles.container}>
        <CameraView style={styles.camera}>
          <View style={styles.cameraControls}>
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => setShowCamera(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </CameraView>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Poop Tracker</Text>
          <Text style={styles.date}>Mon, Apr 7, 2025</Text>
        </View>

        <TouchableOpacity 
          style={styles.mascotContainer}
          onPress={handleMascotPress}>
          <Image 
            source={{ uri: image || POOP_MASCOT }}
            style={[styles.mascotImage, isImageBlurred && styles.blurredImage]}
          />
          {image && (
            <TouchableOpacity 
              style={styles.blurToggle}
              onPress={(e) => {
                e.stopPropagation();
                setIsImageBlurred(!isImageBlurred);
              }}>
              <Text style={styles.blurToggleText}>
                {isImageBlurred ? '🔓' : '🔒'}
              </Text>
            </TouchableOpacity>
          )}
          <View style={styles.mascotOverlay}>
            <Camera size={32} color="#FFFFFF" />
          </View>
        </TouchableOpacity>

        {image && (
          <View style={styles.analysisContainer}>
            {isAnalyzing ? (
                <View style={styles.analyzingState}>
                  <ActivityIndicator size="large" color="#00BFA5" />
                  <Text style={styles.analyzingText}>Analyzing your information...</Text>
                </View>
              ) : (
                analysisResult && (
                  <>
                    <Text style={styles.analysisTitle}>Analysis Result</Text>
                    {Object.entries(analysisResult.indicators).map(([key, value]) => (
                      <View key={key} style={styles.indicatorRow}>
                        <Text style={styles.indicatorLabel}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
                        <View style={styles.indicatorContent}>
                          <Text style={styles.statusText}>{value.status}</Text>
                          <Text style={styles.interpretationText}>{value.interpretation}</Text>
                        </View>
                      </View>
                    ))}
                  </>
                )
              )
            }
          </View>
        )}

        {showImagePicker && (
          <View style={styles.imagePickerModal}>
            <View style={styles.imagePickerContent}>
              <TouchableOpacity 
                style={styles.imagePickerOption}
                onPress={takePhoto}>
                <Camera size={24} color="#00BFA5" />
                <Text style={styles.imagePickerText}>Take Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.imagePickerOption}
                onPress={pickImage}>
                <ImagePlus size={24} color="#00BFA5" />
                <Text style={styles.imagePickerText}>Choose from Library</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.cancelOption}
                onPress={() => setShowImagePicker(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Stool Color:</Text>
          <View style={styles.optionsContainer}>
            {STOOL_COLORS.map(color => (
              <TouchableOpacity
                key={color.id}
                style={[
                  styles.optionButton,
                  { backgroundColor: color.color },
                  stoolColor === color.id && styles.optionButtonSelected,
                  stoolColor === color.id && { borderColor: color.color }
                ]}
                onPress={() => setStoolColor(color.id)}>
                <Text style={[styles.optionText, { color: color.textColor }]}>{color.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Stool Composition:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.compositionGrid}>
              {STOOL2_COMPOSITIONS.map(type => (
                <TouchableOpacity
                  key={type.id}
                  onPress={() => setStoolComposition(type.id.toString())}
                  style={styles.stoolCardWrapper}>
                  <StoolTypeCard type={type} isSelected={stoolComposition === type.id.toString()}/>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Smell:</Text>
          <View style={styles.optionsGrid}>
            {SMELL_OPTIONS.map(option => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.optionButton,
                  selectedSmell === option.id && styles.optionButtonSelected
                ]}
                onPress={() => setSelectedSmell(option.id)}>
                <Text style={styles.optionEmoji}>{option.emoji}</Text>
                <Text style={styles.optionLabel}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Duration:</Text>
          <View style={styles.optionsGrid}>
            {DURATION_OPTIONS.map(option => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.optionButton,
                  selectedDuration === option.id && styles.optionButtonSelected
                ]}
                onPress={() => setSelectedDuration(option.id)}>
                <Text style={styles.optionEmoji}>{option.emoji}</Text>
                <Text style={styles.optionLabel}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Condition:</Text>
          <View style={styles.optionsGrid}>
            {CONDITION_OPTIONS.map(option => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.optionButton,
                  selectedConditions.includes(option.id) && styles.optionButtonSelected
                ]}
                onPress={() => toggleCondition(option.id)}>
                <Text style={styles.optionEmoji}>{option.emoji}</Text>
                <Text style={styles.optionLabel}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

      <TouchableOpacity 
  style={styles.saveButton}
  onPress={() => {
    // 验证是否有选择
    if (!selectedSmell || !selectedDuration || selectedConditions.length === 0) {
      setToastMessage('Please select all required options!');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
      return;
    }

    const newEntry = {
      id: Date.now(),
      date: new Date(),
      smell: selectedSmell,
      duration: selectedDuration,
      conditions: selectedConditions,
      water: selectedWater,
      image: image,
    };
    setEntries(prev => [newEntry, ...prev]);
    
    // 重置所有选项
    setSelectedSmell('');
    setSelectedDuration('');
    setSelectedConditions([]);
    setSelectedWater('');

    // 显示保存成功提示
    // 成功提示
    // 显示成功提示
    setToastMessage('Entry saved successfully!');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  }}>
  <Text style={styles.saveButtonText}>Save Entry</Text>
</TouchableOpacity>

{entries.length > 0 && (
  <View style={styles.historySection}>
    <Text style={styles.historyTitle}>Today Records</Text>
    {entries.map(entry => {
      const pan = new Animated.ValueXY();
      const panResponder = PanResponder.create({
        onMoveShouldSetPanResponder: () => true,
        onPanResponderMove: (_, gesture) => {
          if (gesture.dx < 0) {  // 只允许左滑
            pan.x.setValue(gesture.dx);
          }
        },
        onPanResponderRelease: (_, gesture) => {
          if (gesture.dx < -50) {  // 左滑超过 50 显示删除按钮
            Animated.spring(pan.x, {
              toValue: -80,
              useNativeDriver: false,
            }).start();
          } else {
            Animated.spring(pan.x, {
              toValue: 0,
              useNativeDriver: false,
            }).start();
          }
        },
      });

      return (
        <View key={entry.id} style={styles.historyCardContainer}>
          <Animated.View
            style={[
              styles.historyItemCard,
              { transform: [{ translateX: pan.x }] }
            ]}
            {...panResponder.panHandlers}
          >
            <View style={styles.historyHeader}>
              <Text style={styles.historyDate}>
                {entry.date.toLocaleString('en-US')}
              </Text>
            </View>
            <View style={styles.historyContent}>
              {/* ... 原有的历史记录内容 ... */}
              <View style={styles.historyRow}>
                <Text>💨 {SMELL_OPTIONS.find(o => o.id === entry.smell)?.label || '-'}</Text>
                <Text>⏱️ {DURATION_OPTIONS.find(o => o.id === entry.duration)?.label || '-'}</Text>
                {/* <Text>{WATER_OPTIONS.find(o => o.id === entry.water)?.emoji || '-'}</Text> */}
              </View>
              {entry.conditions.length > 0 && (
                <View style={styles.conditionTags}>
                  {entry.conditions.map(c => (
                    <Text key={c} style={styles.conditionTag}>
                      {CONDITION_OPTIONS.find(o => o.id === c)?.emoji} {CONDITION_OPTIONS.find(o => o.id === c)?.label}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          </Animated.View>
          <TouchableOpacity
            style={[styles.deleteButton]}
            onPress={() => deleteEntry(entry.id)}
          >
            <Trash2 size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      );
    })}
  </View>
)}
      </ScrollView>

      {/* 浮动操作按钮 */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => setShowActionSheet(true)}>
        <Plus size={24} color="#FFFFFF" />
      </TouchableOpacity>

      {/* 操作选项面板 */}
      <Modal
        visible={showActionSheet}
        transparent
        animationType="slide"
        onRequestClose={() => setShowActionSheet(false)}>
        <TouchableOpacity 
          style={styles.actionSheetOverlay}
          activeOpacity={1}
          onPress={() => setShowActionSheet(false)}>
          <View style={styles.actionSheet}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => {
                setShowActionSheet(false);
                takePhoto();
              }}>
              <Camera size={24} color="#00BFA5" />
              <Text style={styles.actionText}>Take Photo</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => {
                setShowActionSheet(false);
                pickImage();
              }}>
              <ImagePlus size={24} color="#00BFA5" />
              <Text style={styles.actionText}>Choose from Library</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => {
                setShowActionSheet(false);
                startVoiceInput();
              }}>
              <Mic size={24} color="#00BFA5" />
              <Text style={styles.actionText}>Voice Input</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* 语音输入状态提示 */}
      {isRecording && (
        <View style={styles.recordingOverlay}>
          <Mic size={48} color="#00BFA5" />
          <Text style={styles.recordingText}>Listening...</Text>
        </View>
      )}

      {showToast && (
      <View style={styles.toast}>
        <Text style={styles.toastText}>{toastMessage}</Text>
      </View>
    )}
      {/* 会员升级提示modal  */}
      <Modal
      visible={showUpgradeModal}
      transparent
      animationType="fade"
      onRequestClose={() => setShowUpgradeModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.upgradeModal}>
            <Text style={styles.upgradeTitle}>Upgrade to Pro</Text>
            <Text style={styles.upgradeDescription}>
            Unlock unlimited image uploads and more advanced features
            </Text>
            <View style={styles.upgradeBenefits}>
              <Text style={styles.benefitItem}>✅ Unlimited picture upload and recognition</Text>
              <Text style={styles.benefitItem}>✅ Advanced data analysis</Text>
              <Text style={styles.benefitItem}>✅ More personalized suggestions</Text>
              <Text style={styles.benefitItem}>✅ Priority customer service support</Text>
            </View>
            <TouchableOpacity 
              style={styles.upgradeButton}
              onPress={() => {
                // 这里添加升级逻辑
                setShowUpgradeModal(false);
              }}>
              <Text style={styles.upgradeButtonText}>Upgrade now</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => setShowUpgradeModal(false)}>
              <Text style={styles.cancelButtonText}>Not upgrading</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        visible={showAnalyzingModal}
        transparent
        animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.analyzingModal}>
            <ActivityIndicator size="large" color="#00BFA5" />
            <Text style={styles.analyzingTitle}>AI Analysis in Progress</Text>
            <Text style={styles.analyzingDescription}>
              Please wait while we analyze your information...
            </Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
    
  );
}

// 修改相关样式
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',  // 更改为更柔和的背景色
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00BFA5',
  },
  date: {
    fontSize: 16,
    color: '#757575',
  },
  mascotContainer: {
    alignItems: 'center',
    marginBottom: 24,
    position: 'relative',
  },
  mascotImage: {
    width: 160,
    height: 160,
    borderRadius: 80,
  },
  mascotOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#00BFA5',
    borderRadius: 20,
    padding: 8,
    ...Platform.select({
      web: {
        cursor: 'pointer',
      },
    }),
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#424242',
    marginBottom: 12,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    backgroundColor: '#FFF8F1',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    minWidth: 100,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  optionButtonSelected: {
    backgroundColor: '#E0F2F1',
    borderColor: '#00BFA5',
    borderWidth: 2,
    transform: [{ scale: 1.05 }],
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
  saveButton: {
    backgroundColor: '#00BFA5',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  imagePickerModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center', // 改为 center
    alignItems: 'center', // 添加居中对齐
    zIndex: 1000,
  },
  imagePickerContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20, // 修改为四周都有圆角
    padding: 20,
    width: '80%', // 添加宽度限制
    maxWidth: 400, // 添加最大宽度
  },
  imagePickerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  imagePickerText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#424242',
  },
  cancelOption: {
    padding: 16,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    color: '#F44336',
    fontWeight: '600',
  },
  camera: {
    flex: 1,
  },
  cameraControls: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: '#F44336',
    fontSize: 16,
    fontWeight: '600',
  },
  historySection: {
    marginTop: 24,
  },
  historyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#424242',
    marginBottom: 16,
  },
  historyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  historyDate: {
    fontSize: 14,
    color: '#757575',
  },
  historyContent: {
    gap: 8,
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  conditionTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  conditionTag: {
    fontSize: 14,
  },
  historyCardContainer: {
    position: 'relative',
    marginBottom: 12,
    flexDirection: 'row',
    height: 100, // 固定高度
    overflow: 'hidden',
  },
  historyItemCard: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    height: '100%',
    zIndex: 1,
  },
  deleteButton: {
    position: 'absolute',
    right: 0,
    height: '100%',
    backgroundColor: '#FF6B6B',  // 更柔和的删除按钮颜色
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    borderRadius: 12,
  },
  toast: {
    position: 'absolute',
    bottom: 100,
    left: '50%',
    transform: [{ translateX: -150 }],
    backgroundColor: 'rgba(78, 205, 196, 0.9)',  // 使用主题色的半透明版本
    padding: 16,
    borderRadius: 8,
    width: 300,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  toastText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '600',
    // color: '#666',
  },
  optionTextSelected: {
    color: '#000',
  },
  compositionGrid: {
    flexDirection: 'row',
    // flexWrap: 'wrap',
    // gap: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  compositionButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: '48%', // 每行显示两个
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  compositionButtonSelected: {
    backgroundColor: '#E0F2F1',
    borderColor: '#00BFA5',
  },
  compositionEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  compositionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#424242',
    marginBottom: 4,
  },
  compositionDescription: {
    fontSize: 12,
    color: '#757575',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  upgradeModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: '85%',
    maxWidth: 400,
    alignItems: 'center',
  },
  upgradeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00BFA5',
    marginBottom: 12,
  },
  upgradeDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  upgradeBenefits: {
    alignSelf: 'stretch',
    marginBottom: 24,
  },
  benefitItem: {
    fontSize: 16,
    color: '#424242',
    marginBottom: 12,
  },
  upgradeButton: {
    backgroundColor: '#00BFA5',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 32,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  upgradeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  analysisContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    marginBottom: 24,
  },
  analysisTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#00BFA5',
    marginBottom: 16,
  },
  indicatorRow: {
    marginBottom: 16,
  },
  indicatorLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#424242',
    marginBottom: 8,
  },
  indicatorContent: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
  },
  statusText: {
    fontSize: 10,
    color: '#000',
    marginBottom: 4,
  },
  interpretationText: {
    fontSize: 14,
    color: '#00BFA5',
    fontStyle: 'italic',
  },
  analyzingState: {
    alignItems: 'center',
    padding: 20,
  },
  analyzingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  analyzingModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 32,
    width: '85%',
    maxWidth: 400,
    alignItems: 'center',
  },
  analyzingTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#00BFA5',
    marginTop: 24,
    marginBottom: 8,
  },
  analyzingDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  blurredImage: {
    opacity: 0.7,
    filter: 'blur(5px)',
  },
  blurToggle: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    padding: 8,
    margin: 8,
    zIndex: 2,
  },
  blurToggleText: {
    fontSize: 14,
    color: '#424242',
    fontWeight: '600',
  },
  stoolCard: {
    backgroundColor: '#FFF8F1',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    // flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  stoolImage: {
    width: 80,
    height: 80,
    marginBottom: 12,
  },
  stoolInfo: {
    // flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  stoolType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B4513',
    marginBottom: 4,
  },
  stoolName: {
    fontSize: 14,
    color: '#5D4037',
    marginBottom: 4,
  },
  stoolDescription: {
    fontSize: 14,
    color: '#424242',
    marginBottom: 8,
    textAlign: 'center',
  },
  statusTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  stoolCardWrapper: {
    width: 160, // 固定宽度
    marginRight: 12,
  },
  stoolCardSelected: {
    backgroundColor: '#E0F2F1',
    borderColor: '#00BFA5',
    borderWidth: 2,
    transform: [{ scale: 1.02 }],
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#00BFA5',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  actionSheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  actionSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  actionText: {
    marginLeft: 16,
    fontSize: 16,
    color: '#424242',
  },
  recordingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordingText: {
    marginTop: 16,
    fontSize: 18,
    color: '#00BFA5',
    fontWeight: '600',
  },
  stoolTypeStatusText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
    // marginBottom: 4,
  },
});
