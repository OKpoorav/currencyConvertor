
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
  Modal,
} from 'react-native';
import { CurrencyService } from './Api';

const CURRENCIES = {
  USD: "US Dollar",
  EUR: "Euro",
  GBP: "British Pound",
  JPY: "Japanese Yen",
  AUD: "Australian Dollar",
  CAD: "Canadian Dollar",
  CHF: "Swiss Franc",
  CNY: "Chinese Yuan",
  INR: "Indian Rupee",
  NZD: "New Zealand Dollar",
  SGD: "Singapore Dollar",
  HKD: "Hong Kong Dollar",
  KRW: "South Korean Won",
  MXN: "Mexican Peso",
  BRL: "Brazilian Real",
};

const App = () => {
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [exchangeRate, setExchangeRate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('INR');
  const [showFromCurrencyModal, setShowFromCurrencyModal] = useState(false);
  const [showToCurrencyModal, setShowToCurrencyModal] = useState(false);

  useEffect(() => {
    fetchExchangeRate();
  }, [fromCurrency, toCurrency]);

  const fetchExchangeRate = async () => {
    setIsLoading(true);
    const result = await CurrencyService.getExchangeRate(fromCurrency, toCurrency);
    
    if (result.success) {
      setExchangeRate(result.rate);
    } else {
      console.error('Failed to fetch exchange rate');
    }
    setIsLoading(false);
  };

  const convertCurrency = (amount, direction = 'fromTo') => {
    if (amount && exchangeRate) {
      if (direction === 'fromTo') {
        const converted = (parseFloat(amount) * exchangeRate).toFixed(2);
        setToAmount(converted);
      } else {
        const converted = (parseFloat(amount) / exchangeRate).toFixed(2);
        setFromAmount(converted);
      }
      Keyboard.dismiss();
    } else {
      setToAmount('');
    }
  };

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  const CurrencyDropdown = ({ value, onPress }) => (
    <TouchableOpacity 
      style={styles.dropdownButton}
      onPress={onPress}
    >
      <Text style={styles.dropdownButtonText}>{value}</Text>
      <Text style={styles.dropdownButtonSubtext}>{CURRENCIES[value]}</Text>
    </TouchableOpacity>
  );

  const CurrencyModal = ({ visible, onClose, selectedCurrency, onSelect }) => (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Currency</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.modalCloseButton}>✕</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.currencyList}>
            {Object.entries(CURRENCIES).map(([code, name]) => (
              <TouchableOpacity
                key={code}
                style={[
                  styles.currencyOption,
                  code === selectedCurrency && styles.selectedCurrencyOption
                ]}
                onPress={() => {
                  onSelect(code);
                  onClose();
                }}
              >
                <Text style={[
                  styles.currencyOptionText,
                  code === selectedCurrency && styles.selectedCurrencyOptionText
                ]}>
                  {code} - {name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f0f8ff" />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.content}>
          {isLoading ? (
            <ActivityIndicator size="large" color="#2563eb" />
          ) : (
            <>
              <View style={styles.header}>
                <Text style={styles.title}>Currency Converter</Text>
              </View>

              <View style={styles.converterContainer}>
                <View style={styles.inputSection}>
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>From</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter amount"
                      keyboardType="numeric"
                      value={fromAmount}
                      onChangeText={(text) => {
                        setFromAmount(text);
                        convertCurrency(text, 'fromTo');
                      }}
                      placeholderTextColor="#94a3b8"
                    />
                  </View>
                  <CurrencyDropdown
                    value={fromCurrency}
                    onPress={() => setShowFromCurrencyModal(true)}
                  />
                </View>

                <TouchableOpacity 
                  style={styles.swapButton}
                  onPress={handleSwapCurrencies}
                >
                  <View style={styles.swapButtonInner}>
                    <Text style={styles.swapButtonIcon}>⇅</Text>
                  </View>
                </TouchableOpacity>

                <View style={styles.inputSection}>
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>To</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter amount"
                      keyboardType="numeric"
                      value={toAmount}
                      onChangeText={(text) => {
                        setToAmount(text);
                        convertCurrency(text, 'toFrom');
                      }}
                      placeholderTextColor="#94a3b8"
                    />
                  </View>
                  <CurrencyDropdown
                    value={toCurrency}
                    onPress={() => setShowToCurrencyModal(true)}
                  />
                </View>

                {exchangeRate && (
                  <View style={styles.rateContainer}>
                    <Text style={styles.rateText}>
                      1 {fromCurrency} = {exchangeRate.toFixed(4)} {toCurrency}
                    </Text>
                  </View>
                )}
              </View>

              <CurrencyModal
                visible={showFromCurrencyModal}
                onClose={() => setShowFromCurrencyModal(false)}
                selectedCurrency={fromCurrency}
                onSelect={setFromCurrency}
              />

              <CurrencyModal
                visible={showToCurrencyModal}
                onClose={() => setShowToCurrencyModal(false)}
                selectedCurrency={toCurrency}
                onSelect={setToCurrency}
              />
            </>
          )}
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#212121',
  },
  content: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 20 : 0,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'grey',
    marginBottom: 8,
  },
  converterContainer: {
    width: '100%',
    backgroundColor: '#A1B0AB',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inputSection: {
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    color: '#475569',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    height: 50,
    width: '100%',
    borderColor: '#cbd5e1',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: 'white',
    color: '#1e293b',
  },
  dropdownButton: {
    padding: 12,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  dropdownButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  dropdownButtonSubtext: {
    fontSize: 12,
    color: '#64748b',
  },
  swapButton: {
    alignSelf: 'center',
    marginVertical: 10,
  },
  swapButtonInner: {
    width: 40,
    height: 40,
    backgroundColor: 'green',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  swapButtonIcon: {
    color: 'white',
    fontSize: 24,
  },
  rateContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  rateText: {
    fontSize: 14,
    color: '#64748b',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  modalCloseButton: {
    fontSize: 24,
    color: '#64748b',
  },
  currencyList: {
    padding: 10,
  },
  currencyOption: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  selectedCurrencyOption: {
    backgroundColor: '#f1f5f9',
  },
  currencyOptionText: {
    fontSize: 16,
    color: '#1e293b',
  },
  selectedCurrencyOptionText: {
    color: 'green',
    fontWeight: '600',
  },
});

export default App;


