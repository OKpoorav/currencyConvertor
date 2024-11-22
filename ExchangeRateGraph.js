import React from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

export const ExchangeRateGraph = ({ historicalData, fromCurrency, toCurrency }) => {
  if (!historicalData || historicalData.length === 0) {
    return null;
  }

  const labels = historicalData.map(item => item.date);
  const rates = historicalData.map(item => item.rate);

  return (
    <View style={styles.graphContainer}>
      <Text style={styles.graphTitle}>
        {fromCurrency}/{toCurrency} Exchange Rate History
      </Text>
      <LineChart
        data={{
          labels: labels,
          datasets: [{
            data: rates
          }]
        }}
        width={Dimensions.get('window').width - 40} // padding
        height={220}
        chartConfig={{
          backgroundColor: '#ffffff',
          backgroundGradientFrom: '#ffffff',
          backgroundGradientTo: '#ffffff',
          decimalPlaces: 4,
          color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
          style: {
            borderRadius: 16
          }
        }}
        bezier
        style={styles.chart}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  graphContainer: {
    marginTop: 20,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  graphTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
    textAlign: 'center',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});