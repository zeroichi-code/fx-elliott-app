import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WaveSignal } from '../types';
import { t } from '../i18n';

interface Props {
  signal: WaveSignal | null;
  currentPrice: number | null;
  pairLabel: string;
}

export default function SignalPanel({ signal, currentPrice, pairLabel }: Props) {
  if (!signal) return null;

  const directionConfig = {
    buy:  { label: t('buy'),  color: '#26a69a', bg: 'rgba(38,166,154,0.15)', icon: '▲' },
    sell: { label: t('sell'), color: '#ef5350', bg: 'rgba(239,83,80,0.15)', icon: '▼' },
    wait: { label: t('wait'), color: '#9e9e9e', bg: 'rgba(158,158,158,0.1)', icon: '━' },
  };

  const cfg = directionConfig[signal.direction];
  const isJPY = pairLabel.includes('JPY');
  const priceDecimals = isJPY ? 3 : 5;

  return (
    <View style={styles.container}>
      <View style={[styles.directionBadge, { backgroundColor: cfg.bg, borderColor: cfg.color }]}>
        <Text style={[styles.directionIcon, { color: cfg.color }]}>{cfg.icon}</Text>
        <Text style={[styles.directionLabel, { color: cfg.color }]}>{cfg.label}</Text>
        <View style={styles.confidencePill}>
          <Text style={styles.confidenceText}>{t('probability')} {signal.confidence}%</Text>
        </View>
      </View>

      <View style={styles.waveRow}>
        <View style={styles.waveItem}>
          <Text style={styles.waveItemLabel}>{t('currentWave')}</Text>
          <Text style={styles.waveItemValue}>{t(signal.currentWave as any)}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.waveItem}>
          <Text style={styles.waveItemLabel}>{t('nextForecast')}</Text>
          <Text style={styles.waveItemValue}>{t(signal.nextWaveLabel as any)}</Text>
        </View>
      </View>

      <Text style={styles.reason}>{t(signal.reason as any)}</Text>

      {(signal.targetPrice || signal.stopLoss || signal.entryPrice) && (
        <View style={styles.priceRow}>
          {signal.entryPrice && (
            <View style={styles.priceItem}>
              <Text style={styles.priceLabel}>{t('entry')}</Text>
              <Text style={[styles.priceValue, { color: '#fff' }]}>
                {signal.entryPrice.toFixed(priceDecimals)}
              </Text>
            </View>
          )}
          {signal.targetPrice && (
            <View style={styles.priceItem}>
              <Text style={styles.priceLabel}>{t('target')}</Text>
              <Text style={[styles.priceValue, { color: '#26a69a' }]}>
                {signal.targetPrice.toFixed(priceDecimals)}
              </Text>
            </View>
          )}
          {signal.stopLoss && (
            <View style={styles.priceItem}>
              <Text style={styles.priceLabel}>{t('stopLoss')}</Text>
              <Text style={[styles.priceValue, { color: '#ef5350' }]}>
                {signal.stopLoss.toFixed(priceDecimals)}
              </Text>
            </View>
          )}
        </View>
      )}

      <Text style={styles.disclaimer}>{t('disclaimer')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#12121a',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 12,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  directionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1.5,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 12,
  },
  directionIcon: { fontSize: 22, fontWeight: 'bold', marginRight: 8 },
  directionLabel: { fontSize: 22, fontWeight: 'bold', letterSpacing: 2, flex: 1 },
  confidencePill: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  confidenceText: { color: '#e0e0e0', fontSize: 13, fontWeight: '600' },
  waveRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  waveItem: { flex: 1, alignItems: 'center' },
  waveItemLabel: { color: '#757575', fontSize: 10, marginBottom: 3 },
  waveItemValue: { color: '#e0e0e0', fontSize: 13, fontWeight: '600', textAlign: 'center' },
  divider: { width: 1, backgroundColor: 'rgba(255,255,255,0.1)', marginHorizontal: 8 },
  reason: { color: '#bdbdbd', fontSize: 12, lineHeight: 18, marginBottom: 10 },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  priceItem: { alignItems: 'center' },
  priceLabel: { color: '#757575', fontSize: 10, marginBottom: 2 },
  priceValue: { fontSize: 13, fontWeight: '700', fontVariant: ['tabular-nums'] },
  disclaimer: { color: '#616161', fontSize: 10, fontStyle: 'italic' },
});
