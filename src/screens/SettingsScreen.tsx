import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore } from '../store/useStore';
import { CURRENCY_PAIRS, CurrencyPair } from '../types';
import { t } from '../i18n';

export default function SettingsScreen() {
  const { settings, updateSettings, loadData } = useStore();
  const [apiKeyInput, setApiKeyInput] = useState(settings.apiKey);

  const handleSaveApiKey = () => {
    updateSettings({ apiKey: apiKeyInput.trim() || 'demo' });
    Alert.alert(
      t('settingsSaved'),
      apiKeyInput.trim() ? t('apiKeyUpdated') : t('demoModeRestored'),
      [{ text: t('ok'), onPress: () => loadData() }]
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <Text style={styles.screenTitle}>{t('settings')}</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('currencyPair')}</Text>
          <View style={styles.grid}>
            {CURRENCY_PAIRS.map((pair) => (
              <TouchableOpacity
                key={pair}
                style={[styles.pairButton, settings.currencyPair === pair && styles.pairButtonActive]}
                onPress={() => { updateSettings({ currencyPair: pair as CurrencyPair }); loadData(); }}
              >
                <Text style={[styles.pairText, settings.currencyPair === pair && styles.pairTextActive]}>
                  {pair}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('zigzagSensitivity')}</Text>
          <Text style={styles.sectionDesc}>
            {t('zigzagDesc', { value: (settings.zigzagThreshold * 100).toFixed(1) })}
          </Text>
          <View style={styles.sliderRow}>
            <Text style={styles.sliderLabel}>{t('fine')}</Text>
            <View style={styles.sliderWrap}>
              <Text style={styles.sliderValue}>{(settings.zigzagThreshold * 100).toFixed(1)}%</Text>
            </View>
            <Text style={styles.sliderLabel}>{t('large')}</Text>
          </View>
          <View style={styles.sliderSteps}>
            {[0.003, 0.005, 0.008, 0.01, 0.015, 0.02, 0.03].map((v) => (
              <TouchableOpacity
                key={v}
                style={[styles.stepButton, Math.abs(settings.zigzagThreshold - v) < 0.001 && styles.stepButtonActive]}
                onPress={() => { updateSettings({ zigzagThreshold: v }); loadData(); }}
              >
                <Text style={styles.stepText}>{(v * 100).toFixed(1)}%</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('apiKey')}</Text>
          <Text style={styles.sectionDesc}>{t('apiKeyDesc')}</Text>
          <TextInput
            style={styles.input}
            value={apiKeyInput}
            onChangeText={setApiKeyInput}
            placeholder={t('apiKeyPlaceholder')}
            placeholderTextColor="#616161"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveApiKey}>
            <Text style={styles.saveButtonText}>{t('saveAndRefetch')}</Text>
          </TouchableOpacity>
          {settings.apiKey === 'demo' && (
            <View style={styles.demoNotice}>
              <Text style={styles.demoNoticeText}>{t('demoModeActive')}</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('displaySettings')}</Text>
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>{t('showWaveLabels')}</Text>
            <TouchableOpacity
              style={[styles.switch, settings.showWaveLabels && styles.switchOn]}
              onPress={() => updateSettings({ showWaveLabels: !settings.showWaveLabels })}
            >
              <View style={[styles.switchThumb, settings.showWaveLabels && styles.switchThumbOn]} />
            </TouchableOpacity>
          </View>
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>{t('showFibLevels')}</Text>
            <TouchableOpacity
              style={[styles.switch, settings.showFibLevels && styles.switchOn]}
              onPress={() => updateSettings({ showFibLevels: !settings.showFibLevels })}
            >
              <View style={[styles.switchThumb, settings.showFibLevels && styles.switchThumbOn]} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.section, styles.about]}>
          <Text style={styles.aboutTitle}>FX Elliott Wave v1.0.0</Text>
          <Text style={styles.aboutText}>{t('aboutText')}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0a0a0f' },
  scroll: { flex: 1 },
  content: { paddingBottom: 40 },
  screenTitle: {
    color: '#ffd700', fontSize: 22, fontWeight: '700',
    paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8,
  },
  section: {
    backgroundColor: '#12121a', marginHorizontal: 12, marginBottom: 12,
    borderRadius: 12, padding: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
  },
  sectionTitle: { color: '#e0e0e0', fontSize: 15, fontWeight: '600', marginBottom: 10 },
  sectionDesc: { color: '#757575', fontSize: 12, lineHeight: 17, marginBottom: 10 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pairButton: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
  },
  pairButtonActive: { backgroundColor: 'rgba(255,215,0,0.15)', borderColor: '#ffd700' },
  pairText: { color: '#9e9e9e', fontSize: 13, fontWeight: '500' },
  pairTextActive: { color: '#ffd700', fontWeight: '700' },
  sliderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  sliderLabel: { color: '#757575', fontSize: 10 },
  sliderWrap: { flex: 1, alignItems: 'center' },
  sliderValue: { color: '#ffd700', fontSize: 16, fontWeight: '600' },
  sliderSteps: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  stepButton: {
    paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
  },
  stepButtonActive: { backgroundColor: 'rgba(255,215,0,0.15)', borderColor: '#ffd700' },
  stepText: { color: '#bdbdbd', fontSize: 11 },
  input: {
    backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 8, borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)', color: '#e0e0e0', paddingHorizontal: 12,
    paddingVertical: 10, fontSize: 13, marginBottom: 10, fontFamily: 'monospace',
  },
  saveButton: {
    backgroundColor: 'rgba(255,215,0,0.15)', borderWidth: 1, borderColor: '#ffd700',
    borderRadius: 8, padding: 12, alignItems: 'center',
  },
  saveButtonText: { color: '#ffd700', fontSize: 14, fontWeight: '600' },
  demoNotice: {
    backgroundColor: 'rgba(255,165,0,0.1)', borderRadius: 6, padding: 10,
    marginTop: 10, borderWidth: 1, borderColor: 'rgba(255,165,0,0.3)',
  },
  demoNoticeText: { color: '#ffa500', fontSize: 11, lineHeight: 16 },
  toggleRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  toggleLabel: { color: '#bdbdbd', fontSize: 14 },
  switch: {
    width: 44, height: 24, borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)', padding: 2, justifyContent: 'center',
  },
  switchOn: { backgroundColor: 'rgba(255,215,0,0.4)' },
  switchThumb: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#9e9e9e' },
  switchThumbOn: { backgroundColor: '#ffd700', alignSelf: 'flex-end' },
  about: { marginTop: 4 },
  aboutTitle: { color: '#757575', fontSize: 13, fontWeight: '600', marginBottom: 6 },
  aboutText: { color: '#616161', fontSize: 11, lineHeight: 17 },
});
